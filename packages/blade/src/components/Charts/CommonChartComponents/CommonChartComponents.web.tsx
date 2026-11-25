import React from 'react';
import styled from 'styled-components';
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ReferenceLine as RechartsReferenceLine,
  Line as RechartsLine,
  usePlotArea,
  useChartWidth,
} from 'recharts';
import {
  formatChartValueCompact,
  formatChartValueFull,
  getHighestColorInRange,
  isSequentialColor,
  sanitizeString,
  totalChartColors,
} from '../utils';
import type {
  ChartReferenceLineProps,
  ChartReferenceBandProps,
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
  OVERLAP_Y_AXIS_WIDTH,
  Y_LABEL_HALF_CAP_EM,
  CAP_HEIGHT_EM,
  V2_Y_NAME_MAX_WIDTH_SHARE,
  REFERENCE_BAND_LOWER_CLASS,
  REFERENCE_BAND_UPPER_CLASS,
  X_LABEL_ASCENT_EM,
  componentId,
} from './tokens';
import { calculateTextWidth, measureTextWidth } from './utils';
import { getVisibleXLabelIndexes } from './xAxisLabels';
import { useCommonChartComponentsContext } from './CommonChartComponentsContext';
import getIn from '~utils/lodashButBetter/get';
import { Heading, Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useControllableState } from '~utils/useControllable';

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

  // Handle case where mappedColorData is undefined (e.g., during dynamic nameKey changes)
  if (!mappedColorData) {
    return 'data.background.categorical.azure.faint' as ChartColorToken;
  }

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
      currentLine += ` ${word}`;
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
  chartName,
  onHeightCalculated,
  lastTick,
  tickFormatter,
  isV2 = false,
  plotRight,
}: {
  x: number;
  y: number;
  payload: { value: string; index: number };
  secondaryLabelMap?: SecondaryLabelMap;
  theme: ReturnType<typeof useTheme>['theme'];
  tickWidth?: number;
  chartName?: string;
  onHeightCalculated?: (height: number) => void;
  lastTick: number;
  tickFormatter?: (value: string, index: number) => string;
  /**
   * `v2`: one line, no wrap. The tick sits on the base of the plot, and the label's top sits
   * spacing.3 under it.
   */
  isV2?: boolean;
  /**
   * `v2` number axis: the right edge of the plot. A centred label that would cross it ends at its
   * tick, so it stays inside the chart.
   */
  plotRight?: number;
}): JSX.Element => {
  const fontSize = theme.typography.fonts.size[75];
  const maxWidth = tickWidth && !isV2 ? tickWidth * 0.9 : Infinity;
  // The gap above the label. v1: recharts' tick offset sits above it as well, as on master.
  const topGap = isV2 ? theme.spacing[3] : X_AXIS_TICK_START_DY;

  // For bar charts, always center align labels since bars are centered on ticks
  // For line/area charts, align first tick left and last tick right to prevent clipping
  const shouldUseEdgeAlignment = chartName === 'line' || chartName === 'area';
  const isFirstTick = shouldUseEdgeAlignment && payload.index === 0;
  const isLastTick = shouldUseEdgeAlignment && payload.index === lastTick;

  // Apply tickFormatter if provided, otherwise use raw value
  const displayValue = tickFormatter
    ? tickFormatter(payload.value, payload.index)
    : String(payload.value);

  const crossesPlotRight = (): boolean => {
    if (plotRight === undefined) return false;
    const width = measureTextWidth(displayValue, {
      size: fontSize,
      weight: theme.typography.fonts.weight.regular,
      family: theme.typography.fonts.family.text,
    });
    return x + width / 2 > plotRight;
  };

  const getTextAnchor = (): 'start' | 'middle' | 'end' => {
    if (isFirstTick) return 'start';
    if (isLastTick || crossesPlotRight()) return 'end';
    return 'middle';
  };
  const textAnchor = getTextAnchor();

  // Common text style props
  const textStyleProps = {
    maxWidth,
    fontSize,
    lineHeight: X_AXIS_TICK_LINE_HEIGHT,
    // `v2`: the baseline sits one ascent under the top of the label.
    startDy: isV2 ? topGap + X_LABEL_ASCENT_EM * fontSize : X_AXIS_TICK_START_DY,
    textAnchor,
    fill: theme.colors.surface.text.gray.muted,
    fontFamily: theme.typography.fonts.family.text,
    fontWeight: theme.typography.fonts.weight.regular,
    letterSpacing: theme.typography.letterSpacings[100],
  } as const;

  // Primary label
  const primaryLabel = wrappedTextLabel({
    ...textStyleProps,
    text: displayValue,
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
    topGap + primaryLabel.height + (secondaryLabel ? X_AXIS_LABEL_GAP + secondaryLabel.height : 0);

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

/**
 * Renders again each time the page loads a font, while `isActive`. recharts measures an `auto`
 * width Y axis on each render. A measure before the web font loads takes the fallback font, so
 * the label column comes out too narrow.
 */
const useRenderOnFontLoad = (isActive: boolean): number => {
  const [fontLoads, setFontLoads] = React.useState(0);
  React.useEffect(() => {
    if (!isActive || typeof document === 'undefined' || !document.fonts) return undefined;
    let isMounted = true;
    const onLoad = (): void => {
      if (isMounted) setFontLoads((count) => count + 1);
    };
    void document.fonts.ready.then(onLoad);
    document.fonts.addEventListener('loadingdone', onLoad);
    return () => {
      isMounted = false;
      document.fonts.removeEventListener('loadingdone', onLoad);
    };
  }, [isActive]);
  return fontLoads;
};

const ChartXAxisBody: React.FC<
  ChartXAxisProps & { thinning?: XLabelThinning; plotRight?: number }
> = ({
  interval: intervalProp,
  tickLine = false,
  label,
  dataKey,
  height,
  tickFormatter: tickFormatterProp,
  thinning,
  plotRight,
  ...props
}) => {
  const { theme } = useTheme();
  const {
    secondaryLabelMap,
    chartName,
    dataLength,
    chartVersion,
    valueFormat,
  } = useCommonChartComponentsContext();
  const isV2 = chartVersion === 'v2';
  // `v2` number axis, as on a horizontal bar chart: `valueFormat` on the wrapper writes the ticks
  // compact, as the Y axis of the other charts, unless the axis has its own formatter.
  const tickFormatter =
    tickFormatterProp ??
    (isV2 && props.type === 'number' && valueFormat
      ? (value: string) => formatChartValueCompact(value, valueFormat)
      : undefined);
  // We don't want to pass secondaryDataKey to recharts
  const { secondaryDataKey: _unusedsecondaryDataKey, ...restProps } = props;
  const shouldThinLabels = Boolean(thinning);
  const visibleLabelIndexes = thinning?.visibleLabelIndexes;
  const interval = shouldThinLabels ? 0 : intervalProp ?? 0;

  // Calculate tick count from dataLength
  const totalTickCount = dataLength ?? 1;

  // Calculate visible tick count based on interval
  // When interval is a number: 0 = show all, 1 = every 2nd, 2 = every 3rd, etc.
  const visibleTickCount =
    typeof interval === 'number' ? Math.ceil(totalTickCount / (interval + 1)) : totalTickCount; // For string intervals like 'preserveStart', use total as fallback

  const lastTick = totalTickCount - 1;

  // State to track the maximum tick height reported by CustomXAxisTick components
  const minHeight = secondaryLabelMap ? 20 : 10;
  const [maxTickHeight, setMaxTickHeight] = React.useState(minHeight);

  // Callback to update max height when ticks report their calculated height
  const handleHeightCalculated = React.useCallback((height: number) => {
    setMaxTickHeight((prev) => Math.max(prev, height));
  }, []);

  // Calculate total axis height:
  // - Tick labels height (dynamic)
  // - X-axis label height + offset, always reserved so the gap between the
  //   axis and elements below it (e.g. legend) stays constant whether or not
  //   the `label` prop is present
  // `v2` with no label: no space is kept for a label that is not there.
  const axisLabelSpace = isV2 && !label ? 0 : X_AXIS_LABEL_OFFSET + X_AXIS_LABEL_HEIGHT;
  // `v2`: the labels never wrap, so the height is known: spacing.3 and one line, or two lines
  // with a secondary label.
  const tickHeight = isV2
    ? theme.spacing[3] +
      X_AXIS_TICK_LINE_HEIGHT +
      (secondaryLabelMap ? X_AXIS_LABEL_GAP + X_AXIS_TICK_LINE_HEIGHT : 0)
    : maxTickHeight;
  const baseHeight = Math.max(tickHeight) + axisLabelSpace;

  // Position for X-axis label: below tick labels with offset
  const axisLabelY = tickHeight + X_AXIS_LABEL_OFFSET + X_AXIS_LABEL_HEIGHT / 2;

  return (
    <RechartsXAxis
      // `v2`: the ticks sit on the base of the plot. CustomXAxisTick sets the gap under it.
      {...(isV2 ? { tickSize: 0, tickMargin: 0 } : {})}
      // `v2`: no axis line. The bottom gridline is the baseline, or `showBorder` draws the base.
      {...(isV2 ? { axisLine: false } : {})}
      {...restProps}
      height={baseHeight || height}
      interval={interval}
      tick={(tickProps: {
        x: string | number;
        y: string | number;
        payload: { value: string; index: number };
        width?: string | number;
      }) => {
        // A thinned label is not drawn. Until the plot is measured, no label is drawn.
        if (shouldThinLabels && !visibleLabelIndexes?.has(tickProps.payload.index)) {
          return <g />;
        }
        // Calculate available width per tick from the total chart width
        const tickWidth = Number(tickProps.width ?? 0) / visibleTickCount;
        return (
          <CustomXAxisTick
            x={Number(tickProps.x)}
            y={Number(tickProps.y)}
            payload={tickProps.payload}
            secondaryLabelMap={secondaryLabelMap}
            theme={theme}
            tickWidth={tickWidth}
            lastTick={lastTick}
            chartName={chartName}
            onHeightCalculated={handleHeightCalculated}
            tickFormatter={tickFormatter}
            isV2={isV2}
            plotRight={plotRight}
          />
        );
      }}
      tickLine={tickLine}
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
          {label}
        </text>
      )}
      dataKey={dataKey}
    />
  );
};

/** `v2` X label thinning. `undefined` while the plot is not measured: no label is drawn. */
type XLabelThinning = { visibleLabelIndexes?: Set<number> };

/**
 * `v2` with no `interval`: which labels of a category axis fit, each on one line, with at least
 * spacing.3 between two labels. The widths are measured in the tick font.
 */
const useXLabelThinning = ({
  dataKey,
  tickFormatter,
  padding,
}: Pick<ChartXAxisProps, 'dataKey' | 'tickFormatter' | 'padding'>): XLabelThinning => {
  const { theme } = useTheme();
  const { chartName, chartData } = useCommonChartComponentsContext();
  const plotWidth = usePlotArea()?.width;
  const fontLoads = useRenderOnFontLoad(true);
  const visibleLabelIndexes = React.useMemo(() => {
    if (!plotWidth || !chartData || !dataKey) return undefined;
    const font = {
      size: theme.typography.fonts.size[75],
      weight: theme.typography.fonts.weight.regular,
      family: theme.typography.fonts.family.text,
    };
    const widths = chartData.map((row, index) => {
      const value = row[dataKey] as string;
      return measureTextWidth(
        tickFormatter ? tickFormatter(value, index) : String(value ?? ''),
        font,
      );
    });
    const paddingSides = typeof padding === 'object' ? padding : undefined;
    return new Set(
      getVisibleXLabelIndexes({
        widths,
        plotWidth,
        minGap: theme.spacing[3],
        isBand: chartName === 'bar',
        isEdgeAnchored: chartName === 'line' || chartName === 'area',
        paddingLeft: paddingSides?.left,
        paddingRight: paddingSides?.right,
      }),
    );
    // fontLoads: measure again once the web font is in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotWidth, chartData, dataKey, tickFormatter, padding, chartName, theme, fontLoads]);
  return { visibleLabelIndexes };
};

/** The X axis of a `v2` chart that thins its labels. */
const ChartXAxisWithThinning: React.FC<ChartXAxisProps> = (props) => {
  const thinning = useXLabelThinning(props);
  return <ChartXAxisBody {...props} thinning={thinning} />;
};

/** The number X axis of a `v2` chart. Its last label ends inside the plot. */
const ChartXAxisNumber: React.FC<ChartXAxisProps> = (props) => {
  const plotArea = usePlotArea();
  const plotRight = plotArea ? plotArea.x + plotArea.width : undefined;
  return <ChartXAxisBody {...props} plotRight={plotRight} />;
};

const _ChartXAxis: React.FC<ChartXAxisProps> = (props) => {
  const { chartVersion, chartData } = useCommonChartComponentsContext();
  const isV2 = chartVersion === 'v2';
  // Only `v2` thins its labels. `v1` renders as on master, with no extra hook.
  const shouldThinLabels =
    isV2 &&
    props.interval === undefined &&
    props.type !== 'number' &&
    Boolean(props.dataKey && chartData);
  if (shouldThinLabels) return <ChartXAxisWithThinning {...props} />;
  if (isV2 && props.type === 'number') return <ChartXAxisNumber {...props} />;
  return <ChartXAxisBody {...props} />;
};

const ChartXAxis = assignWithoutSideEffects(_ChartXAxis, {
  componentId: componentId.chartXAxis,
});

/**
 * `v2` `showBorder`: the border of the plot. One line on the left, the right and the bottom, each
 * drawn once, in the colour and the width of the gridlines. ChartCartesianGrid leaves out its
 * gridline at the base of the plot, so the bottom line is not drawn twice.
 */
const ChartPlotBorder = (): JSX.Element | null => {
  const { theme } = useTheme();
  const { gridlineWidth = 'thinner' } = useCommonChartComponentsContext();
  const plotArea = usePlotArea();
  if (!plotArea) return null;
  const left = plotArea.x;
  const right = plotArea.x + plotArea.width;
  const top = plotArea.y;
  const bottom = plotArea.y + plotArea.height;
  const lineProps = {
    stroke: theme.colors.surface.border.gray.muted,
    strokeWidth: theme.border.width[gridlineWidth],
    fill: 'none',
  };
  return (
    <g data-blade-chart-plot-border="">
      <line
        data-blade-chart-plot-border-side="left"
        x1={left}
        x2={left}
        y1={top}
        y2={bottom}
        {...lineProps}
      />
      <line
        data-blade-chart-plot-border-side="right"
        x1={right}
        x2={right}
        y1={top}
        y2={bottom}
        {...lineProps}
      />
      <line
        data-blade-chart-plot-border-side="bottom"
        x1={left}
        x2={right}
        y1={bottom}
        y2={bottom}
        {...lineProps}
      />
    </g>
  );
};

/**
 * Cuts a name to `maxWidth`, with an ellipsis. The width is measured in `font`.
 */
const truncateToWidth = (
  text: string,
  maxWidth: number,
  font: { size: number; weight: number | string; family: string },
): string => {
  if (measureTextWidth(text, font) <= maxWidth) return text;
  let end = text.length;
  while (end > 1 && measureTextWidth(`${text.slice(0, end).trimEnd()}…`, font) > maxWidth) {
    end -= 1;
  }
  return `${text.slice(0, end).trimEnd()}…`;
};

const ChartYAxis: React.FC<ChartYAxisProps> = (props) => {
  const { theme } = useTheme();
  const {
    yLabelPlacement = 'left',
    showBorder = false,
    isVerticalBar = false,
    valueFormat,
    chartVersion,
  } = useCommonChartComponentsContext();
  // `v1`: recharts' Y axis, as on master. The placement props apply to `v2` only.
  const isV2 = chartVersion === 'v2';
  const isOverlap = isV2 && yLabelPlacement === 'overlap';
  const isLabelColumn = isV2 && !isOverlap;
  const tickFontSize = theme.typography.fonts.size[75];
  useRenderOnFontLoad(isLabelColumn);
  const chartWidth = useChartWidth();
  // `v2` horizontal bar: a name longer than its share of the chart width is cut, with an ellipsis.
  // The tooltip shows the full name.
  const nameMaxWidth =
    isV2 && isVerticalBar && chartWidth ? chartWidth * V2_Y_NAME_MAX_WIDTH_SHARE : undefined;
  const getDefaultTickFormatter = (): ((value: unknown) => string) | undefined => {
    if (isV2 && isVerticalBar) {
      if (nameMaxWidth === undefined) return undefined;
      return (value) =>
        truncateToWidth(String(value ?? ''), nameMaxWidth, {
          size: tickFontSize,
          weight: theme.typography.fonts.weight.regular,
          family: theme.typography.fonts.family.text,
        });
    }
    if (valueFormat) return (value) => formatChartValueCompact(value, valueFormat);
    return undefined;
  };
  const defaultTickFormatter = getDefaultTickFormatter();

  return (
    <>
      <RechartsYAxis
        // `overlap`: almost no width. The ticks are mirrored into the plot, so the gridlines run the
        // full width of the chart. Not 0: recharts draws no axis of width 0. tickSize and tickMargin
        // 0: the ticks start at the left edge of the plot, as the X axis.
        {...(isOverlap
          ? {
              width: OVERLAP_Y_AXIS_WIDTH,
              mirror: true,
              tickSize: 0,
              tickMargin: 0,
            }
          : {})}
        // `left` (the default) and `right`: a column as wide as its widest label plus the tick
        // margin, with no fixed gutter. The chart margin on that side is 0, so the widest label
        // meets the edge of the chart. recharts aligns the labels towards the axis. interval 0: each
        // label on its own tick. recharts' default moves the top label off its gridline. A bar chart
        // with `layout="vertical"` gets the same column for its category names.
        {...(isLabelColumn
          ? {
              orientation: yLabelPlacement === 'right' ? ('right' as const) : ('left' as const),
              width: 'auto' as const,
              interval: 0,
              tickSize: 0,
              tickMargin: theme.spacing[3],
            }
          : {})}
        // `v2`: no axis line. `showBorder` draws the left and the right of the plot.
        {...(isV2 ? { axisLine: false } : {})}
        // The default ticks, unless the axis has its own formatter: `valueFormat` on the wrapper
        // writes them compact. The names of a `v2` horizontal bar chart are cut to a width instead.
        {...(defaultTickFormatter ? { tickFormatter: defaultTickFormatter } : {})}
        {...props}
        tick={{
          fill: theme.colors.surface.text.gray.muted,
          fontSize: tickFontSize,
          fontFamily: theme.typography.fonts.family.text,
          fontWeight: theme.typography.fonts.weight.regular,
          letterSpacing: theme.typography.letterSpacings[100],
          ...(isOverlap
            ? {
                // Each tick sits just below its gridline, not across it. recharts centres a tick
                // label on its gridline. Half the cap height moves its top to the gridline, then
                // spacing.3 below it.
                dy: theme.spacing[3] + Y_LABEL_HALF_CAP_EM * tickFontSize,
                // A thin halo in the surface colour, so a line or an area under a tick cannot hide
                // it: 1px outside the glyphs.
                stroke: theme.colors.surface.background.gray.intense,
                strokeWidth: theme.border.width.thicker,
                strokeLinejoin: 'round',
                paintOrder: 'stroke',
              }
            : {}),
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
      {isV2 && showBorder && !props.hide ? <ChartPlotBorder /> : null}
    </>
  );
};

/** The props recharts gives each horizontal gridline. */
type GridLineProps = {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  y?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number | string;
};

/**
 * `showBorder`: each horizontal gridline but the one at the base of the plot. The border draws the
 * base, so it is drawn once.
 */
const renderGridLineAboveBase = (lineProps: GridLineProps): JSX.Element => {
  const { x1, x2, y1, y2, y = 0, height = 0, stroke, strokeWidth } = lineProps;
  if (y1 !== undefined && Math.abs(y1 - (y + height)) < 0.5) {
    return <g />;
  }
  return (
    <line x1={x1} x2={x2} y1={y1} y2={y2} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
  );
};

const ChartCartesianGrid: React.FC<ChartCartesianGridProps> = (props) => {
  const { theme } = useTheme();
  const {
    yGridlines = true,
    gridlineWidth,
    showBorder = false,
    chartVersion,
  } = useCommonChartComponentsContext();
  // `v1`: as on master. The gridline props apply to `v2` only.
  const isV2 = chartVersion === 'v2';

  const getHorizontal = (): ChartCartesianGridProps['horizontal'] | undefined => {
    if (!isV2) return undefined;
    if (!yGridlines) return false;
    if (showBorder) return renderGridLineAboveBase as ChartCartesianGridProps['horizontal'];
    return undefined;
  };
  const horizontal = getHorizontal();

  return (
    <RechartsCartesianGrid
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      // `gridlineWidth`: a Blade border width. With none, recharts' 1px, as before.
      {...(isV2 && gridlineWidth ? { strokeWidth: theme.border.width[gridlineWidth] } : {})}
      {...(horizontal !== undefined ? { horizontal } : {})}
      {...props}
    />
  );
};

const CustomTooltip = ({
  item,
  index,
  payload,
  formatter,
}: {
  item: {
    name: string;
    value: string;
    color: string;
    dataKey: string;
    payload: Record<string, unknown>;
  };
  index: number;
  payload: ReadonlyArray<unknown>;
  formatter?: ChartTooltipProps['formatter'];
}): JSX.Element => {
  const { theme } = useTheme();
  const { dataColorMapping, chartName, rangeMap } = useCommonChartComponentsContext();

  const toolTipColor = getChartColor(item.dataKey, item.name, dataColorMapping ?? {}, chartName);

  // recharts' `formatter`: it returns the value, or a [value, name] pair.
  const formatted = formatter
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter(item.value, item.name, item as any, index, payload as any)
    : item.value;
  const [displayValue, displayName] = Array.isArray(formatted)
    ? [formatted[0], formatted[1] ?? item.name]
    : [formatted, item.name];

  // If this series has a reference band, show its industry range (low–high) beneath the value.
  const range = rangeMap?.[item.dataKey];
  const lowerValue = range ? item.payload?.[range.rangeLowerDataKey] : undefined;
  const upperValue = range ? item.payload?.[range.rangeUpperDataKey] : undefined;
  const hasRange =
    range &&
    lowerValue !== undefined &&
    lowerValue !== null &&
    upperValue !== undefined &&
    upperValue !== null;

  return (
    <Box key={`tooltip-${item.name}`} paddingY="spacing.1">
      <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4">
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
            {displayName}
          </Text>
        </Box>
        <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
          {displayValue}
        </Text>
      </Box>
      {hasRange ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="spacing.4"
          // Indents the range row to start exactly under the series name above it: the colour
          // swatch (spacing.4) plus the gap between it and the name (spacing.3). spacing.5 (16px)
          // was 4px short of that sum (20px), leaving the label visibly adrift to the left.
          paddingLeft="spacing.6"
        >
          <Text size="xsmall" weight="regular" color="surface.text.staticWhite.muted">
            {range?.rangeName ?? 'Industry'}
          </Text>
          <Text size="xsmall" weight="regular" color="surface.text.staticWhite.muted">
            {`${String(lowerValue)}–${String(upperValue)}`}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

const ChartTooltip: React.FC<ChartTooltipProps> = (props) => {
  const { theme } = useTheme();
  const { valueFormat } = useCommonChartComponentsContext();
  // `valueFormat` on the wrapper: full values, unless the tooltip has its own formatter.
  const formatter: ChartTooltipProps['formatter'] =
    props.formatter ??
    (valueFormat ? (value: unknown) => formatChartValueFull(value, valueFormat) : undefined);
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
              {/* recharts' `labelFormatter`, as the X axis has `tickFormatter`. */}
              {props.labelFormatter ? props.labelFormatter(label, payload) : label}
            </Heading>
            <Box paddingTop={label ? 'spacing.4' : undefined}>
              {filteredPayLoad.map((item, index) => (
                <CustomTooltip
                  item={item}
                  key={item.name}
                  index={index}
                  payload={filteredPayLoad}
                  formatter={formatter}
                />
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

const StyledLegendWrapper = styled.button<{
  $isHidden: boolean;
  $isClickable: boolean;
  $isV2: boolean;
}>(({ theme, $isHidden, $isClickable, $isV2 }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: $isClickable ? 'pointer' : 'default',
  opacity: $isHidden ? 0.4 : 1,
  background: 'none',
  border: 'none',
  // `v2`: no side padding, so the gap between two items is the legend's column gap only. The
  // item stays 28px tall.
  padding: $isV2 ? `${theme.spacing[2]}px 0` : theme.spacing[2],
  '& p': {
    color: theme.colors.surface.text.gray.muted,
    textDecoration: $isHidden ? 'line-through' : 'none',
    transition: $isClickable
      ? `color ${theme.motion.duration.xquick}ms ${theme.motion.easing.linear}`
      : 'none',
  },
  '&:hover p': {
    color: $isClickable
      ? theme.colors.surface.text.gray.normal
      : theme.colors.surface.text.gray.muted,
  },
}));

const LegendItem = ({
  entry,
  index,
  isSelected,
  onClick,
  isClickable,
}: {
  entry: {
    color: string;
    value: string;
    dataKey: string;
  };
  index: number;
  isSelected: boolean;
  onClick: (dataKey: string) => void;
  isClickable: boolean;
}): JSX.Element => {
  const { theme } = useTheme();
  const {
    dataColorMapping,
    chartName,
    lineStrokeStyles,
    chartVersion,
  } = useCommonChartComponentsContext();

  const legendColor = getChartColor(entry.dataKey, entry.value, dataColorMapping ?? {}, chartName);
  // A line chart shows each series as a line in its own stroke style, with the dash of the
  // `border.dash` token. Area, bar and donut keep the square.
  const isLineSwatch = chartVersion === 'v2' && chartName === 'line';
  const lineStrokeStyle = lineStrokeStyles?.[entry.dataKey] ?? 'solid';
  const lineDash =
    lineStrokeStyle === 'solid' ? undefined : theme.border.dash[lineStrokeStyle].join(' ');

  // For donut charts, use sanitized value (name) as the key, for other charts use dataKey
  const legendKey = chartName === 'donut' ? sanitizeString(entry.value ?? '') : entry.dataKey;

  return (
    <StyledLegendWrapper
      key={`item-${index}`}
      $isHidden={!isSelected}
      $isClickable={isClickable}
      $isV2={chartVersion === 'v2'}
      onClick={
        isClickable
          ? () => {
              onClick(legendKey);
            }
          : undefined
      }
      type="button"
    >
      <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
        {isLineSwatch ? (
          <svg
            width={theme.spacing[5]}
            height={theme.spacing[4]}
            aria-hidden="true"
            data-blade-legend-swatch={lineStrokeStyle}
            style={{ display: 'block' }}
          >
            <line
              x1={0}
              x2={theme.spacing[5]}
              y1={theme.spacing[4] / 2}
              y2={theme.spacing[4] / 2}
              stroke={getIn(theme.colors, legendColor)}
              strokeWidth={theme.border.width.thicker}
              strokeDasharray={lineDash}
            />
          </svg>
        ) : (
          <span
            style={{
              backgroundColor: getIn(theme.colors, legendColor),
              width: theme.spacing[4],
              height: theme.spacing[4],
              display: 'inline-block',
              borderRadius: theme.border.radius['2xsmall'],
            }}
          />
        )}
        <Text size="medium" color="surface.text.gray.muted">
          {entry.value}
        </Text>
      </Box>
    </StyledLegendWrapper>
  );
};

/**
 * Informational (non-toggleable) legend entries for the reference band(s). Bands aren't selectable
 * series, so each renders a static square swatch in the band's fill colour + its label. One entry
 * per band (a per-line band or the standalone band).
 */
const ReferenceBandLegendSwatch = (): JSX.Element | null => {
  const { theme } = useTheme();
  const { referenceBands, chartVersion } = useCommonChartComponentsContext();
  if (!referenceBands || referenceBands.length === 0) return null;
  return (
    <>
      {referenceBands.map((band, index) => (
        <Box
          display="flex"
          alignItems="center"
          // `v2`: no side padding, as a series item.
          padding={chartVersion === 'v2' ? ['spacing.2', 'spacing.0'] : 'spacing.2'}
          key={`reference-band-${index}`}
        >
          <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
            <span
              style={{
                backgroundColor: getIn(theme.colors, band.color),
                opacity: band.fillOpacity,
                width: theme.spacing[4],
                height: theme.spacing[4],
                display: 'inline-block',
                borderRadius: theme.border.radius['2xsmall'],
              }}
            />
            <Text size="medium" color="surface.text.gray.muted">
              {band.name}
            </Text>
          </Box>
        </Box>
      ))}
    </>
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
  selectedDataKeys: string[];
  onClick: (dataKey: string) => void;
}): JSX.Element | null => {
  const { payload, layout, selectedDataKeys, onClick } = props;
  const {
    chartName,
    dataColorMapping,
    referenceBands,
    legendPlacement,
    chartVersion,
  } = useCommonChartComponentsContext();
  const isV2 = chartVersion === 'v2';

  /*
  This is a custom legend component that is used to display the legend for the chart.
  we need to show the legend only if the legendType is not none. (for example in line chart we don't want to show the legend for the reference line)
  so we are filtering the payload and then mapping over it to display the legend.
  
  For donut charts, we use dataColorMapping directly instead of payload because:
  - When legend items are clicked, the donut data gets filtered
  - This causes the payload to lose the filtered items
  - But we need all legend items to remain visible so users can toggle them back
  - dataColorMapping always contains all the original data keys
  */
  const isVerticalLayout = layout === 'vertical';
  const isClickable =
    chartName === 'line' || chartName === 'area' || chartName === 'bar' || chartName === 'donut';
  // On top, the legend is left-aligned. A `v2` item has no side padding, so the first swatch
  // starts at the left edge of the chart.
  const isTop = legendPlacement === 'top' && !isVerticalLayout;
  const renderLegend = (items: React.ReactNode): JSX.Element => {
    const legend = (
      <Box
        display="flex"
        justifyContent={isTop ? 'flex-start' : 'center'}
        // `v2`: spacing.4 between two items in a row. No row gap: the 4px padding above and below
        // each item leaves spacing.3 between two rows of text. `v1`: as on master.
        {...(isV2 ? { columnGap: 'spacing.4', rowGap: 'spacing.0' } : { gap: 'spacing.5' })}
        flexDirection={isVerticalLayout ? 'column' : 'row'}
        width={isVerticalLayout ? '100%' : 'auto'}
        flexWrap="wrap"
      >
        {items}
      </Box>
    );
    return isTop ? <div data-blade-legend-placement="top">{legend}</div> : legend;
  };

  // For donut charts, generate legend entries from dataColorMapping (which has all keys)
  if (chartName === 'donut' && dataColorMapping) {
    const donutLegendEntries = Object.keys(dataColorMapping).map((key) => ({
      value: key, // The sanitized name
      dataKey: key,
      color: dataColorMapping[key].colorToken,
    }));

    if (donutLegendEntries.length === 0) {
      return null;
    }

    return renderLegend(
      donutLegendEntries.map((entry, index) => (
        <LegendItem
          entry={entry}
          index={index}
          key={`item-${index}`}
          isSelected={selectedDataKeys.includes(entry.dataKey)}
          onClick={onClick}
          isClickable={isClickable}
        />
      )),
    );
  }

  // For other chart types, use the payload from recharts
  const filteredPayload = (payload ?? []).filter(
    (entry) => entry?.payload?.legendType !== 'none' && entry?.type !== 'none',
  );

  // Nothing to render — no real series and no reference band(s).
  if (filteredPayload.length === 0 && (!referenceBands || referenceBands.length === 0)) {
    return null;
  }

  return renderLegend(
    <>
      {filteredPayload.map((entry, index) => (
        <LegendItem
          entry={entry}
          index={index}
          key={`item-${index}`}
          isSelected={selectedDataKeys.includes(entry.dataKey)}
          onClick={onClick}
          isClickable={isClickable}
        />
      ))}
      {/* Static swatch for the reference band (not a toggleable series). */}
      <ReferenceBandLegendSwatch />
    </>,
  );
};

const _ChartLegend: React.FC<ChartLegendProps> = ({
  selectedDataKeys: selectedDataKeysProp,
  defaultSelectedDataKeys,
  onSelectedDataKeysChange,
  ...props
}) => {
  const { theme } = useTheme();
  const {
    dataColorMapping,
    setSelectedDataKeys,
    legendPlacement,
    chartVersion,
    chartName,
    yLabelPlacement,
    yGridlines = true,
    isVerticalBar = false,
  } = useCommonChartComponentsContext();
  const isTop = legendPlacement === 'top' && props.layout !== 'vertical';
  // The gap between the legend and the chart. `v1`: LEGEND_MARGIN_TOP, as on master. `v2`:
  // spacing.5 from the legend items to the nearest chart element.
  const getLegendGap = (): number => {
    if (chartVersion !== 'v2') return LEGEND_MARGIN_TOP;
    const gap = theme.spacing[5];
    // At the bottom, the X labels are the nearest element: the X axis ends at their bottom.
    // A donut has no axes.
    if (!isTop || chartName === 'donut') return gap;
    const fontSize = theme.typography.fonts.size[75];
    // On top, the top gridline is the nearest element, unless a Y label is nearer.
    if ((yLabelPlacement === 'left' || yLabelPlacement === 'right') && !isVerticalBar) {
      // A label in a column is centred on the top gridline. Its box starts one ascent above its
      // baseline, which sits half a cap height under the gridline.
      return gap + Math.ceil((X_LABEL_ASCENT_EM - Y_LABEL_HALF_CAP_EM) * fontSize);
    }
    if (yLabelPlacement === 'overlap' && !yGridlines) {
      // No gridline: the top label is the nearest element. Its cap top sits spacing.3 under the
      // top of the plot, and its box starts one ascent less the cap height above that.
      return Math.max(
        0,
        gap - Math.floor(theme.spacing[3] - (X_LABEL_ASCENT_EM - CAP_HEIGHT_EM) * fontSize),
      );
    }
    return gap;
  };
  const legendGap = getLegendGap();
  const hasUserInteractedRef = React.useRef(false);
  const isControlled = selectedDataKeysProp !== undefined;
  const shouldAutoSelectAllDataKeys = !isControlled && defaultSelectedDataKeys === undefined;

  // Get all available dataKeys from the chart
  const allDataKeys = React.useMemo(() => Object.keys(dataColorMapping ?? {}), [dataColorMapping]);

  // Use controllable state for selected keys
  const [selectedKeysArray, setSelectedKeysArray] = useControllableState({
    value: selectedDataKeysProp,
    defaultValue: defaultSelectedDataKeys ?? allDataKeys,
  });

  React.useEffect(() => {
    if (!shouldAutoSelectAllDataKeys || hasUserInteractedRef.current || allDataKeys.length === 0) {
      return;
    }

    const isSelectedStateInSync =
      selectedKeysArray.length === allDataKeys.length &&
      allDataKeys.every((dataKey) => selectedKeysArray.includes(dataKey));

    if (!isSelectedStateInSync) {
      setSelectedKeysArray(() => [...allDataKeys], true);
    }
  }, [allDataKeys, selectedKeysArray, setSelectedKeysArray, shouldAutoSelectAllDataKeys]);

  // Reset selection when allDataKeys completely changes (e.g., when nameKey prop changes)
  // This detects when none of the currently selected keys exist in the new data keys
  React.useEffect(() => {
    if (allDataKeys.length > 0 && selectedKeysArray.length > 0) {
      const hasOverlap = selectedKeysArray.some((key) => allDataKeys.includes(key));
      if (!hasOverlap) {
        // The data keys have completely changed, reset to all keys
        setSelectedKeysArray(() => [...allDataKeys]);
      }
    }
  }, [allDataKeys, selectedKeysArray, setSelectedKeysArray]);

  // Sync selectedDataKeys to context's selectedDataKeys
  React.useEffect(() => {
    setSelectedDataKeys?.(selectedKeysArray);
  }, [selectedKeysArray, setSelectedDataKeys]);

  // Handle toggle
  const handleClick = React.useCallback(
    (dataKey: string) => {
      hasUserInteractedRef.current = true;
      const newSelectedKeys = selectedKeysArray.includes(dataKey)
        ? selectedKeysArray.filter((key) => key !== dataKey)
        : [...selectedKeysArray, dataKey];

      setSelectedKeysArray(() => newSelectedKeys);
      onSelectedDataKeysChange?.({ dataKey, selectedKeysArray: newSelectedKeys });
    },
    [setSelectedKeysArray, selectedKeysArray, onSelectedDataKeysChange],
  );

  return (
    <RechartsLegend
      // recharts measures the legend only when its items change. A new gap remounts it, so the
      // plot moves to the new gap.
      key={`legend-gap-${legendGap}`}
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
        // On top: the gap sits under the legend, and the legend starts at the left edge.
        ...(isTop ? { paddingBottom: legendGap, left: 0 } : { paddingTop: legendGap }),
      }}
      align={isTop ? 'left' : 'center'}
      verticalAlign={props.layout === 'vertical' ? 'middle' : isTop ? 'top' : 'bottom'}
      content={
        <CustomSquareLegend
          layout={props.layout ?? 'horizontal'}
          selectedDataKeys={selectedKeysArray}
          onClick={handleClick}
        />
      }
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

/**
 * Reference band. Renders two invisible bound lines (`lowerDataKey` / `upperDataKey`) so
 * Recharts computes their geometry and folds them into the y-domain; ChartLineWrapper then reads
 * those curves and paints the shaded band between them (a data-driven range that varies per point,
 * unlike Recharts' fixed-rectangle `ReferenceArea`). The band's fill + legend swatch are handled by
 * the wrapper and the shared legend via context.
 */
const _ChartReferenceBand: React.FC<ChartReferenceBandProps> = ({ lowerDataKey, upperDataKey }) => {
  return (
    <>
      <RechartsLine
        className={REFERENCE_BAND_LOWER_CLASS}
        type="monotone"
        dataKey={lowerDataKey}
        stroke="transparent"
        strokeWidth={1}
        dot={false}
        activeDot={false}
        connectNulls
        legendType="none"
        tooltipType="none"
        isAnimationActive={false}
      />
      <RechartsLine
        className={REFERENCE_BAND_UPPER_CLASS}
        type="monotone"
        dataKey={upperDataKey}
        stroke="transparent"
        strokeWidth={1}
        dot={false}
        activeDot={false}
        connectNulls
        legendType="none"
        tooltipType="none"
        isAnimationActive={false}
      />
    </>
  );
};

const ChartReferenceBand = assignWithoutSideEffects(_ChartReferenceBand, {
  componentId: componentId.chartReferenceBand,
});

export {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartReferenceLine,
  ChartReferenceBand,
};
