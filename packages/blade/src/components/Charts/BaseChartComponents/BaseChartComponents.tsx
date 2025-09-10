import React from 'react';
import type { ComponentProps } from 'react';
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  ReferenceLine as RechartsReferenceLine,
} from 'recharts';
import type { XAxisProps as RechartsXAxisProps, YAxisProps as RechartsYAxisProps } from 'recharts';
import { castWebType } from '~utils';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';

type ReferenceLineProps = {
  y?: number;
  x?: number;
  label: string;
};

type XAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  label?: string;
  dataKey?: string;
};
type YAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  label?: string;
  dataKey?: string;
};

type ChartToolTipProps = ComponentProps<typeof RechartsTooltip>;
type LegendProps = ComponentProps<typeof RechartsLegend>;
type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;

type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

const XAxis: React.FC<XAxisProps> = (props) => {
  const { theme } = useTheme();
  const X_OFFSET = 32;
  const Y_OFFSET = 14.5;
  const TEXT_BASELINE = 24;

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
          y={viewBox.y + Y_OFFSET + TEXT_BASELINE}
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

const YAxis: React.FC<YAxisProps> = (props) => {
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

const CartesianGrid: React.FC<CartesianGridProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsCartesianGrid
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      {...props}
    />
  );
};

//REVIEW_NOTES: this might change
const ChartToolTip: React.FC<ChartToolTipProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsTooltip
      contentStyle={{
        backgroundColor: theme.colors.surface.background.gray.intense,
        border: `1px solid ${theme.colors.surface.border.gray.muted}`,
        borderRadius: theme.border.radius.medium,
        boxShadow: castWebType(theme.elevation.lowRaised),
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
      }}
      cursor={{ fill: 'rgba(0, 0, 0, 0.1)', stroke: theme.colors.surface.border.gray.muted }}
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

  if (!payload || payload.length === 0) {
    return null;
  }
  const filteredPayload = payload.filter((entry) => entry?.payload?.legendType !== 'none');

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      {filteredPayload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box display="flex" gap="spacing.3" justifyContent="center" alignItems="center">
            <span
              style={{
                backgroundColor: entry.color, // Uses the color of the line/bar
                width: '12px', // Size of the square
                height: '12px', // Size of the square
                display: 'inline-block',
                borderRadius: '2px',
              }}
            />
            {/* Legend text with custom color and size */}
            <Text size="medium" color="surface.text.gray.muted">
              {entry.value}
            </Text>
          </Box>

          {/* Changed text color to a dark gray */}
        </li>
      ))}
    </ul>
  );
};

const Legend: React.FC = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsLegend
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
        paddingTop: '16px',
      }}
      align="center"
      content={<CustomSquareLegend />}
      {...props}
    />
  );
};

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = (props) => {
  return <RechartsResponsiveContainer {...props} />;
};

const CustomReferenceLabel = ({
  viewBox,
  value,
}: {
  viewBox?: { x: number; y: number; width: number };
  value: string | undefined;
}): JSX.Element => {
  const { x, y, width } = viewBox ?? { x: 0, y: 0, width: 0 };
  const { theme } = useTheme();

  const RECT_WIDTH = 80;
  const RECT_HEIGHT = 30;
  const TEXT_BASELINE = 15;
  const rectX = x + width - RECT_WIDTH;
  const rectY = y - TEXT_BASELINE;

  // Padding for text inside the rectangle (4px vertical, 8px horizontal)
  const PADDING_VERTICAL = 4;
  const PADDING_HORIZONTAL = 8;

  // Text position with padding inside the rectangle
  const textX = rectX + PADDING_HORIZONTAL + (RECT_WIDTH - PADDING_HORIZONTAL * 2) / 2;
  const textY = rectY + PADDING_VERTICAL + TEXT_BASELINE; // +15 for text baseline

  return (
    <g>
      <rect
        x={x + width - RECT_WIDTH}
        y={y - TEXT_BASELINE}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx={theme.border.radius.medium}
        fill={theme.colors.surface.background.gray.subtle}
        stroke={theme.colors.surface.border.gray.muted}
        strokeWidth="1"
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fill={theme.colors.surface.text.gray.normal}
        fontSize={theme.typography.fonts.size[50]}
        fontFamily={theme.typography.fonts.family.text}
        fontWeight={theme.typography.fonts.weight.medium}
        letterSpacing={theme.typography.letterSpacings[100]}
      >
        {value}
      </text>
    </g>
  );
};

export const ReferenceLine: React.FC<ReferenceLineProps> = ({ label, x, y }) => {
  const { theme } = useTheme();
  return (
    <RechartsReferenceLine
      stroke={getIn(theme.colors, 'chart.background.categorical.gray.intense')}
      strokeWidth={2}
      strokeDasharray="4 4"
      label={<CustomReferenceLabel value={label} />}
      x={x}
      y={y}
    />
  );
};

export type {
  ReferenceLineProps,
  XAxisProps,
  YAxisProps,
  ChartToolTipProps,
  LegendProps,
  ResponsiveContainerProps,
  CartesianGridProps,
};
export { XAxis, YAxis, ResponsiveContainer, CartesianGrid, ChartToolTip, Legend };
