import React from 'react';
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ReferenceLine as RechartsReferenceLine,
} from 'recharts';
import {
  getHighestColorInRange,
  isSequentialColor,
  sanitizeString,
  totalChartColors,
} from '../utils';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
  Layout,
  ChartColorToken,
  DataColorMapping,
  SecondaryLabelMap,
} from './types';
import {
  RECT_HEIGHT,
  TEXT_BASELINE,
  PADDING_VERTICAL,
  PADDING_HORIZONTAL,
  X_AXIS_TICK_LINE_HEIGHT,
  X_AXIS_TICK_START_DY,
  X_AXIS_LABEL_GAP,
  X_AXIS_LABEL_OFFSET,
  X_AXIS_LABEL_HEIGHT,
  LEGEND_MARGIN_TOP,
  X_OFFSET,
  componentId,
} from './tokens';
import { calculateTextWidth } from './utils';
import { useCommonChartComponentsContext } from './CommonChartComponentsContext';
import { Heading, Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import getIn from '~utils/lodashButBetter/get';

/**
 * Helper function to get the appropriate color for chart elements (tooltip, legend)
 *
 * This function resolves the color token for chart elements based on the chart type and color mapping.
 * The logic varies by chart type:
 * - For line/area charts: Returns the mapped color directly if it's not a custom color.
 *   If it is a custom color, it maps to the highest color in the range (unless it's sequential).
 * - For sequential colors: Returns the mapped color as-is
 * - For other cases: Uses getHighestColorInRange to get the highest intensity color from the range,
 *   with special handling for donut charts when custom colors are used or when there are more
 *   data points than the default color palette
 *
 * @param dataKey - The data key for the chart element
 * @param name - The name/value of the chart element
 * @param dataColorMapping - Color mapping object
 * @param chartName - Type of chart (line, area, donut, etc.)
 * @returns The resolved color token
 */
const getChartColor = (
  dataKey: string,
  name: string,
  dataColorMapping: DataColorMapping,
  chartName: string | undefined,
): ChartColorToken => {
  const colorKey = chartName === 'donut' ? sanitizeString(name ?? '') : dataKey;
  const mappedColorData = dataColorMapping?.[colorKey ?? ''];
  const mappedColor = mappedColorData.colorToken;
  const isCustomColor = mappedColorData.isCustomColor;

  if ((chartName === 'line' || chartName === 'area') && !isCustomColor) {
    return mappedColor;
  }

  if (mappedColor && isSequentialColor(mappedColor)) {
    return mappedColor ?? 'data.background.categorical.azure.faint';
  }
  return getHighestColorInRange({
    colorToken: mappedColor ?? ('data.background.categorical.azure.faint' as ChartColorToken),
    followIntensityMapping:
      chartName === 'donut' &&
      (isCustomColor || Object.keys(dataColorMapping).length > totalChartColors),
  });
};

/**
 * Wraps text to fit within a given pixel width, breaking at word boundaries.
 * Returns an array of lines that each fit within the max width.
 */
const wrapTextToFit = (text: string, maxWidthPx: number, fontSize: number): string[] => {
  // Approximate average character width (varies by font, but ~0.5-0.6 of font size is common)
  const avgCharWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.max(1, Math.floor(maxWidthPx / avgCharWidth));

  // If text fits in one line, return as-is
  if (text.length <= maxCharsPerLine) {
    return [text];
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
};

/**
 * Reusable component for rendering wrapped text labels in SVG.
 * Handles multi-line text rendering with configurable positioning.
 */
const wrappedTextLabel = ({
  text,
  maxWidth,
  fontSize,
  lineHeight,
  startDy,
  textAnchor,
  fill,
  fontFamily,
  fontWeight,
  letterSpacing,
  yOffset = 0,
}: {
  text: string;
  maxWidth: number;
  fontSize: number;
  lineHeight: number;
  startDy: number;
  textAnchor: 'start' | 'middle' | 'end';
  fill: string;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  yOffset?: number;
}): { element: JSX.Element; height: number } => {
  const lines = wrapTextToFit(text, maxWidth, fontSize);
  const totalHeight = lines.length * lineHeight;

  const element = (
    <text
      x={0}
      y={yOffset}
      textAnchor={textAnchor}
      fill={fill}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      style={{ letterSpacing }}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={0} dy={index === 0 ? startDy : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );

  return { element, height: totalHeight };
};

/**
 * Custom tick component for X-axis with automatic text wrapping.
 * - Primary label: Automatically wraps long text to multiple lines based on available width
 * - Secondary label: Optional label from pre-computed secondaryLabelMap (shown below primary, also supports wrapping)
 * - Edge alignment: For line/area charts, first/last ticks align start/end to prevent clipping.
 *   For bar charts, all labels are center-aligned since bars are centered on tick positions.
 * - Reports calculated height via onHeightCalculated callback for dynamic axis sizing
 */
const CustomXAxisTick = ({
  x,
  y,
  payload,
  secondaryLabelMap,
  theme,
  tickWidth,
  tickCount,
  chartName,
  onHeightCalculated,
}: {
  x: number;
  y: number;
  payload: { value: string; index: number };
  secondaryLabelMap?: SecondaryLabelMap;
  theme: ReturnType<typeof useTheme>['theme'];
  tickWidth?: number;
  tickCount: number;
  chartName?: string;
  onHeightCalculated?: (height: number) => void;
}): JSX.Element => {
  const fontSize = theme.typography.fonts.size[75];
  const maxWidth = tickWidth ? tickWidth * 0.9 : Infinity;

  // For bar charts, always center align labels since bars are centered on ticks
  // For line/area charts, align first tick left and last tick right to prevent clipping
  const shouldUseEdgeAlignment = chartName === 'line' || chartName === 'area';
  const isFirstTick = shouldUseEdgeAlignment && payload.index === 0;
  const isLastTick = shouldUseEdgeAlignment && payload.index === tickCount - 1;

  const getTextAnchor = (): 'start' | 'middle' | 'end' => {
    if (isFirstTick) return 'start';
    if (isLastTick) return 'end';
    return 'middle';
  };
  const textAnchor = getTextAnchor();

  // Common text style props
  const textStyleProps = {
    maxWidth,
    fontSize,
    lineHeight: X_AXIS_TICK_LINE_HEIGHT,
    startDy: X_AXIS_TICK_START_DY,
    textAnchor,
    fill: theme.colors.surface.text.gray.muted,
    fontFamily: theme.typography.fonts.family.text,
    fontWeight: theme.typography.fonts.weight.regular,
    letterSpacing: theme.typography.letterSpacings[100],
  } as const;

  // Primary label
  const primaryLabel = wrappedTextLabel({
    ...textStyleProps,
    text: String(payload.value),
  });

  // Secondary label from pre-computed map
  const secondaryValue = secondaryLabelMap?.[payload.index];

  const secondaryLabel =
    secondaryValue !== undefined
      ? wrappedTextLabel({
          ...textStyleProps,
          text: String(secondaryValue),
          // primaryLabel.height gives us where primary ends (relative to its startDy)
          // X_AXIS_LABEL_GAP adds the desired spacing between labels
          yOffset: primaryLabel.height + X_AXIS_LABEL_GAP,
        })
      : null;

  // Calculate total tick height and report it
  const totalTickHeight =
    X_AXIS_TICK_START_DY +
    primaryLabel.height +
    (secondaryLabel ? X_AXIS_LABEL_GAP + secondaryLabel.height : 0);

  React.useEffect(() => {
    onHeightCalculated?.(totalTickHeight);
  }, [totalTickHeight, onHeightCalculated]);

  return (
    <g transform={`translate(${x},${y})`}>
      {primaryLabel.element}
      {secondaryLabel?.element}
    </g>
  );
};

const _ChartXAxis: React.FC<ChartXAxisProps> = (props) => {
  const { theme } = useTheme();
  const { secondaryLabelMap, chartName, dataLength } = useCommonChartComponentsContext();
  // We don't want to pass secondaryLabelKey to recharts
  const { secondaryLabelKey: _unusedSecondaryLabelKey, ...restProps } = props;

  // Calculate tick count from dataLength
  const tickCount = dataLength ?? 1;

  // State to track the maximum tick height reported by CustomXAxisTick components
  const minHeight = secondaryLabelMap ? 20 : 10;
  const [maxTickHeight, setMaxTickHeight] = React.useState(minHeight);

  // Callback to update max height when ticks report their calculated height
  const handleHeightCalculated = React.useCallback((height: number) => {
    setMaxTickHeight((prev) => Math.max(prev, height));
  }, []);

  // Calculate total axis height:
  // - Tick labels height (dynamic)
  // - X-axis label height + offset (if label prop is present)
  const hasAxisLabel = Boolean(props?.label);
  const axisLabelSpace = hasAxisLabel ? X_AXIS_LABEL_OFFSET + X_AXIS_LABEL_HEIGHT : 0;
  const baseHeight = Math.max(maxTickHeight) + axisLabelSpace;

  // Position for X-axis label: below tick labels with offset
  const axisLabelY = maxTickHeight + X_AXIS_LABEL_OFFSET + X_AXIS_LABEL_HEIGHT / 2;

  return (
    <RechartsXAxis
      {...restProps}
      height={baseHeight}
      interval={0} // Show all labels - we handle wrapping to prevent overlaps
      tick={(tickProps: {
        x: number;
        y: number;
        payload: { value: string; index: number };
        width: number;
      }) => {
        // Calculate available width per tick from the total chart width
        const tickWidth = tickProps.width / tickCount;
        return (
          <CustomXAxisTick
            x={tickProps.x}
            y={tickProps.y}
            payload={tickProps.payload}
            secondaryLabelMap={secondaryLabelMap}
            theme={theme}
            tickWidth={tickWidth}
            tickCount={tickCount}
            chartName={chartName}
            onHeightCalculated={handleHeightCalculated}
          />
        );
      }}
      tickLine={false}
      stroke={theme.colors.surface.border.gray.muted}
      label={({ viewBox }: { viewBox: { x: number; y: number; width: number } }) => (
        <text
          x={viewBox.x + viewBox.width / 2 - X_OFFSET}
          y={viewBox.y + axisLabelY}
          textAnchor="middle"
          fill={theme.colors.surface.text.gray.muted}
          fontSize={theme.typography.fonts.size[75]}
          fontFamily={theme.typography.fonts.family.text}
          fontWeight={theme.typography.fonts.weight.regular}
          letterSpacing={theme.typography.letterSpacings[100]}
        >
          {props?.label}
        </text>
      )}
      dataKey={props?.dataKey}
    />
  );
};

const ChartXAxis = assignWithoutSideEffects(_ChartXAxis, {
  componentId: componentId.chartXAxis,
});

const ChartYAxis: React.FC<ChartYAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsYAxis
      {...props}
      tick={{
        fill: theme.colors.surface.text.gray.muted,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
      }}
      tickLine={false}
      stroke={theme.colors.surface.border.gray.muted}
      label={{
        value: props?.label,
        position: 'insideLeft',
        style: {
          textAnchor: 'middle',
          fill: theme.colors.surface.text.gray.muted,
          fontSize: theme.typography.fonts.size[75],
          fontWeight: theme.typography.fonts.weight.regular,
          fontFamily: theme.typography.fonts.family.text,
          letterSpacing: theme.typography.letterSpacings[100],
          lineHeight: theme.typography.lineHeights[500],
        },
        angle: -90,
        fill: theme.colors.surface.text.gray.subtle,
      }}
      dataKey={props?.dataKey}
    />
  );
};

const ChartCartesianGrid: React.FC<ChartCartesianGridProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsCartesianGrid
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      {...props}
    />
  );
};

const CustomTooltip = ({
  item,
  key,
}: {
  item: {
    name: string;
    value: string;
    color: string;
    dataKey: string;
    payload: { fill: string };
  };
  key: string;
}): JSX.Element => {
  const { theme } = useTheme();
  const { dataColorMapping, chartName } = useCommonChartComponentsContext();

  const toolTipColor = getChartColor(item.dataKey, item.name, dataColorMapping ?? {}, chartName);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="spacing.4"
      key={key}
    >
      <Box display="flex" gap="spacing.3" alignItems="center" justifyContent="center">
        <div
          style={{
            width: theme.spacing[4],
            height: theme.spacing[4],
            backgroundColor: getIn(theme.colors, toolTipColor),
            borderRadius: theme.border.radius.small,
          }}
        />
        <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
          {item.name}
        </Text>
      </Box>
      <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
        {item.value}
      </Text>
    </Box>
  );
};

const ChartTooltip: React.FC<ChartTooltipProps> = (props) => {
  const { theme } = useTheme();
  return (
    <RechartsTooltip
      content={({ payload, label }) => {
        const filteredPayLoad = payload.filter((item) => item.type !== 'none');
        return (
          <div
            style={{
              backgroundColor: theme.colors.surface.icon.staticBlack.normal,
              borderRadius: theme.border.radius.large,
              border: `1px solid ${theme.colors.surface.border.gray.muted}`,
              padding: theme.spacing[4],
            }}
          >
            <Heading size="small" weight="semibold" color="surface.text.staticWhite.normal">
              {label}
            </Heading>
            <Box paddingTop={label ? 'spacing.4' : undefined}>
              {filteredPayLoad.map((item) => (
                <CustomTooltip item={item} key={item.name} />
              ))}
            </Box>
          </div>
        );
      }}
      cursor={{ fill: 'transparent', stroke: 'transparent' }}
      {...props}
    />
  );
};

const LegendItem = ({
  entry,
  index,
}: {
  entry: { color: string; value: string; dataKey: string };
  index: number;
}): JSX.Element => {
  const { theme } = useTheme();
  const { dataColorMapping, chartName } = useCommonChartComponentsContext();

  const legendColor = getChartColor(entry.dataKey, entry.value, dataColorMapping ?? {}, chartName);
  return (
    <Box key={`item-${index}`} display="flex" alignItems="center">
      <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
        <span
          style={{
            backgroundColor: getIn(theme.colors, legendColor), // Uses the color of the line/bar
            width: theme.spacing[4], // Size of the square
            height: theme.spacing[4], // Size of the square
            display: 'inline-block',
            borderRadius: theme.border.radius.small,
          }}
        />
        {/* Legend text with custom color and size */}
        <Text size="medium" color="surface.text.gray.muted">
          {entry.value}
        </Text>
      </Box>
    </Box>
  );
};

const CustomSquareLegend = (props: {
  payload?: Array<{
    payload: {
      legendType: 'none' | 'line';
      type: 'none' | 'line';
    };
    value: string;
    color: string;
    type: 'none' | 'line';
    dataKey: string;
  }>;
  layout: Layout;
}): JSX.Element | null => {
  const { payload, layout } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  /*
  This is a custom legend component that is used to display the legend for the chart.
  we need to show the legend only if the legendType is not none. (for example in line chart we don't want to show the legend for the reference line)
  so we are filtering the payload and then mapping over it to display the legend.
  */
  const filteredPayload = payload.filter(
    (entry) => entry?.payload?.legendType !== 'none' && entry?.type !== 'none',
  );
  const isVerticalLayout = layout === 'vertical';

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap="spacing.5"
      flexDirection={isVerticalLayout ? 'column' : 'row'}
      width={isVerticalLayout ? '100%' : 'auto'}
      flexWrap="wrap"
    >
      {filteredPayload.map((entry, index) => (
        <LegendItem entry={entry} index={index} key={`item-${index}`} />
      ))}
    </Box>
  );
};

const _ChartLegend: React.FC<ChartLegendProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsLegend
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
        paddingTop: LEGEND_MARGIN_TOP,
      }}
      align="center"
      verticalAlign={props.layout === 'vertical' ? 'middle' : 'bottom'}
      content={<CustomSquareLegend layout={props.layout ?? 'horizontal'} />}
      {...props}
    />
  );
};

const ChartLegend = assignWithoutSideEffects(_ChartLegend, {
  componentId: componentId.chartLegend,
});

const CustomReferenceLabel = ({
  viewBox,
  value,
  isVertical,
}: {
  viewBox?: { x: number; y: number; width: number };
  value: string | undefined;
  isVertical: boolean;
}): JSX.Element => {
  // Extract viewBox coordinates with fallback values to prevent undefined errors.
  // viewBox contains the positioning information for the reference line label from Recharts.
  const { x, y, width } = viewBox ?? { x: 0, y: 0, width: 0 };
  const { theme } = useTheme();

  // Calculate dynamic text width to ensure the background rectangle fits the text perfectly.
  // This prevents text overflow for long labels and avoids unnecessarily large rectangles for short text.
  // The function also handles text truncation with ellipsis if the text exceeds the maximum width.
  const { width: RECT_WIDTH, displayText } = value
    ? calculateTextWidth(value, theme)
    : { width: 80, displayText: value ?? '' };

  const rect_x = isVertical ? x + width - RECT_WIDTH / 2 : x + width - RECT_WIDTH;
  const rect_y = isVertical ? y : y - TEXT_BASELINE;
  // Text position with padding inside the rectangle
  const text_x = rect_x + PADDING_HORIZONTAL + (RECT_WIDTH - PADDING_HORIZONTAL * 2) / 2;
  const text_y = rect_y + PADDING_VERTICAL + TEXT_BASELINE; // +15 for text baseline

  return (
    <g>
      <rect
        x={rect_x}
        y={rect_y}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx={theme.border.radius.medium}
        fill={theme.colors.surface.background.gray.subtle}
        stroke={theme.colors.surface.border.gray.muted}
        strokeWidth="1"
      />
      <text
        x={text_x}
        y={text_y}
        textAnchor="middle"
        fill={theme.colors.surface.text.gray.normal}
        fontSize={theme.typography.fonts.size[50]}
        fontFamily={theme.typography.fonts.family.text}
        fontWeight={theme.typography.fonts.weight.medium}
        letterSpacing={theme.typography.letterSpacings[100]}
      >
        {displayText}
      </text>
    </g>
  );
};

const ChartReferenceLine: React.FC<ChartReferenceLineProps> = ({ label, x, y }) => {
  const { theme } = useTheme();
  return (
    <RechartsReferenceLine
      stroke={theme.colors.data.background.categorical.gray.intense}
      strokeWidth={2}
      strokeDasharray="4 4"
      label={<CustomReferenceLabel value={label} isVertical={Boolean(x)} />}
      x={x}
      y={y}
    />
  );
};

export {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartReferenceLine,
};
