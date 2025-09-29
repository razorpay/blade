import React from 'react';
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ReferenceLine as RechartsReferenceLine,
} from 'recharts';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
} from './types';
import {
  RECT_HEIGHT,
  TEXT_BASELINE,
  PADDING_VERTICAL,
  PADDING_HORIZONTAL,
  X_AXIS_TEXT_BASELINE,
  Y_OFFSET,
  X_OFFSET,
} from './tokens';
import { calculateTextWidth } from './utils';
import { Heading, Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';

const ChartXAxis: React.FC<ChartXAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsXAxis
      {...props}
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
      }}
      stroke={theme.colors.surface.border.gray.muted}
      label={({ viewBox }: { viewBox: { x: number; y: number; width: number } }) => (
        <text
          x={viewBox.x + viewBox.width / 2 - X_OFFSET}
          y={viewBox.y + Y_OFFSET + X_AXIS_TEXT_BASELINE}
          textAnchor="middle"
          fill={theme.colors.surface.text.gray.subtle}
          fontSize={theme.typography.fonts.size[75]}
          fontFamily={theme.typography.fonts.family.text}
          fontWeight={theme.typography.fonts.weight.medium}
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
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
      }}
      stroke={theme.colors.surface.border.gray.muted}
      label={{
        value: props?.label,
        position: 'insideLeft',
        style: {
          textAnchor: 'middle',
          fill: theme.colors.surface.text.gray.subtle,
          fontSize: theme.typography.fonts.size[75],
          fontWeight: theme.typography.fonts.weight.medium,
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

const ChartTooltip: React.FC<ChartTooltipProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsTooltip
      content={({ payload, label }) => {
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
              {payload.map((item) => (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="spacing.4"
                  key={item.name}
                >
                  <Box display="flex" gap="spacing.3" alignItems="center" justifyContent="center">
                    <div
                      style={{
                        width: theme.spacing[4],
                        height: theme.spacing[4],
                        backgroundColor: item.color || item.payload.fill,
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

const CustomSquareLegend = (props: {
  payload?: Array<{
    payload: {
      legendType: 'none' | 'line';
    };
    value: string;
    color: string;
  }>;
}): JSX.Element | null => {
  const { payload } = props;
  const { theme } = useTheme();

  if (!payload || payload.length === 0) {
    return null;
  }
  /*
  This is a custom legend component that is used to display the legend for the chart.
  we need to show the legend only if the legendType is not none. (for example in line chart we don't want to show the legend for the reference line)
  so we are filtering the payload and then mapping over it to display the legend.
  */
  const filteredPayload = payload.filter((entry) => entry?.payload?.legendType !== 'none');

  return (
    <Box display="flex" justifyContent="center" gap="spacing.5">
      {filteredPayload.map((entry, index) => (
        <Box key={`item-${index}`} display="flex" alignItems="center">
          <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
            <span
              style={{
                backgroundColor: entry.color, // Uses the color of the line/bar
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
      ))}
    </Box>
  );
};

const ChartLegend: React.FC<ChartLegendProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsLegend
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
        paddingTop: theme.spacing[5],
      }}
      align="center"
      content={<CustomSquareLegend />}
      {...props}
    />
  );
};

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
      stroke={theme.colors.chart.background.categorical.gray.intense}
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
