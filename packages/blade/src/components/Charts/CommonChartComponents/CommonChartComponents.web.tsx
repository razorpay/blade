import React from 'react';
import styled from 'styled-components';
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
} from './types';
import {
  RECT_HEIGHT,
  TEXT_BASELINE,
  PADDING_VERTICAL,
  PADDING_HORIZONTAL,
  X_AXIS_TEXT_BASELINE,
  Y_OFFSET,
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

const ChartXAxis: React.FC<ChartXAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsXAxis
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
      label={({ viewBox }: { viewBox: { x: number; y: number; width: number } }) => (
        <text
          x={viewBox.x + viewBox.width / 2 - X_OFFSET}
          y={viewBox.y + Y_OFFSET + X_AXIS_TEXT_BASELINE}
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

const StyledLegendWrapper = styled.button<{ $isHidden: boolean; $isClickable: boolean }>(
  ({ theme, $isHidden, $isClickable }) => ({
    display: 'flex',
    alignItems: 'center',
    cursor: $isClickable ? 'pointer' : 'default',
    opacity: $isHidden ? 0.4 : 1,
    background: 'none',
    border: 'none',
    padding: 0,
    '& p': {
      color: theme.colors.surface.text.gray.muted,
      transition: `color ${theme.motion.duration.xquick}ms ${theme.motion.easing.linear}`,
    },
    '&:hover p': {
      color: $isClickable ? theme.colors.surface.text.gray.normal : undefined,
    },
  }),
);

const LegendItem = ({
  entry,
  index,
  isSelected,
  onClick,
}: {
  entry: { color: string; value: string; dataKey: string };
  index: number;
  isSelected: boolean;
  onClick: (dataKey: string) => void;
}): JSX.Element => {
  const { theme } = useTheme();
  const { dataColorMapping, chartName } = useCommonChartComponentsContext();

  const legendColor = getChartColor(entry.dataKey, entry.value, dataColorMapping ?? {}, chartName);

  return (
    <StyledLegendWrapper
      key={`item-${index}`}
      $isHidden={!isSelected}
      $isClickable={true}
      onClick={() => {
        onClick(entry.dataKey);
      }}
      type="button"
    >
      <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
        <span
          style={{
            backgroundColor: getIn(theme.colors, legendColor),
            width: theme.spacing[4],
            height: theme.spacing[4],
            display: 'inline-block',
            borderRadius: theme.border.radius.small,
          }}
        />
        <Text size="medium" color="surface.text.gray.muted">
          {entry.value}
        </Text>
      </Box>
    </StyledLegendWrapper>
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
        <LegendItem
          entry={entry}
          index={index}
          key={`item-${index}`}
          isSelected={selectedDataKeys.includes(entry.dataKey)}
          onClick={onClick}
        />
      ))}
    </Box>
  );
};

const _ChartLegend: React.FC<ChartLegendProps> = ({
  selectedDataKeys: selectedDataKeysProp,
  defaultSelectedDataKeys,
  onSelectedDataKeysChange,
  ...props
}) => {
  const { theme } = useTheme();
  const { dataColorMapping, setSelectedDataKeys } = useCommonChartComponentsContext();

  // Get all available dataKeys from the chart
  const allDataKeys = React.useMemo(() => Object.keys(dataColorMapping ?? {}), [dataColorMapping]);

  // Use controllable state for selected keys
  const [selectedKeysArray, setSelectedKeysArray] = useControllableState({
    value: selectedDataKeysProp,
    defaultValue: defaultSelectedDataKeys ?? allDataKeys,
  });

  // Sync selectedDataKeys to context's selectedDataKeys
  React.useEffect(() => {
    setSelectedDataKeys?.(selectedKeysArray);
  }, [selectedKeysArray, setSelectedDataKeys]);

  // Handle toggle
  const handleClick = React.useCallback(
    (dataKey: string) => {
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
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
        paddingTop: theme.spacing[7],
      }}
      align="center"
      verticalAlign={props.layout === 'vertical' ? 'middle' : 'bottom'}
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

export {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartReferenceLine,
};
