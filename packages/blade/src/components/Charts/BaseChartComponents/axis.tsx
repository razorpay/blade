import React from 'react';
import type { ComponentProps } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  ReferenceLine as RechartsReferenceLine,
} from 'recharts';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
// BladeColorToken type for charts
export type BladeColorToken =
  | 'surface.text.gray.normal'
  | 'surface.text.gray.muted'
  | 'interactive.background.primary.default'
  | 'feedback.text.positive.subtle'
  | 'feedback.text.negative.subtle'
  | 'feedback.text.notice.subtle'
  | 'feedback.text.information.subtle'
  | string;

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  color?: BladeColorToken;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelOffset?: number;
}

export type XAxisProps = ComponentProps<typeof RechartsXAxis>;
export type YAxisProps = ComponentProps<typeof RechartsYAxis>;
export type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

// Helper function to resolve color tokens
const resolveColorToken = (color: BladeColorToken | undefined, theme: Theme): string => {
  if (!color) return theme.colors.interactive.background.primary.default;

  if (
    color.startsWith('surface.') ||
    color.startsWith('feedback.') ||
    color.startsWith('interactive.')
  ) {
    const parts = color.split('.');
    let value: Record<string, unknown> = theme.colors;
    for (const part of parts) {
      value = value[part] as Record<string, unknown>;
    }
    return ((value as unknown) as string) || theme.colors.interactive.background.primary.default;
  }

  return color;
};

export const XAxis: React.FC<XAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsXAxis
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      stroke="#c5d0db"
      label={{
        //TODO: remove this hardcoding Value
        value: 'Months',
        position: 'insideBottom',
        //TODO: need to change this offset.
        offset: -10,
        style: {
          textAnchor: 'middle',
          fill: theme.colors.surface.text.gray.subtle,
          fontSize: theme.typography.fonts.size[75],
          fontWeight: theme.typography.fonts.weight.medium,
          fontFamily: theme.typography.fonts.family.text,
          letterSpacing: theme.typography.letterSpacings[100],
          lineHeight: theme.typography.lineHeights[500],
        },
      }}
      {...props}
    />
  );
};

export const YAxis: React.FC<YAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsYAxis
      // axisLine={false}
      // tickLine={false}
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      stroke="#c5d0db"
      label={{
        //TODO: remove this hardcoding Value
        value: 'Active Users',
        position: 'insideLeft',
        //TODO: need to change this offset.
        offset: -10,
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
      {...props}
    />
  );
};

export const CartesianGrid: React.FC<CartesianGridProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsCartesianGrid
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      {...props}
    />
  );
};

const CustomReferenceLabel = ({ viewBox, value }) => {
  const { x, y, width } = viewBox;
  const { theme } = useTheme();

  return (
    <g>
      <rect
        x={x + width - 80} // Position rectangle to the right
        y={y - 15}
        width="80"
        height="30"
        rx={theme.border.radius.medium}
        fill={theme.colors.surface.background.gray.subtle}
        stroke={theme.colors.surface.border.gray.muted}
        strokeWidth="1"
      />
      <text
        x={x + width - 40} // Center text in the rectangle
        y={y + 5}
        textAnchor="middle"
        fill={theme.colors.surface.text.gray.normal}
        fontSize={theme.typography.fonts.size[50]}
        fontFamily={theme.typography.fonts.family.text}
        fontWeight={theme.typography.fonts.weight.medium}
        letterSpacing={theme.typography.letterSpacings[100]}
      >
        Avg: {value}
      </text>
    </g>
  );
};

export const ReferenceLine: React.FC<ReferenceLineProps> = ({
  color,
  label,
  labelPosition = 'right',
  labelOffset = 10,
  ...props
}) => {
  const { theme } = useTheme();
  const [isHover, setIsHover] = React.useState(false);
  const resolvedColor = color
    ? resolveColorToken(color, theme)
    : theme.colors.surface.text.gray.normal;

  return (
    <RechartsReferenceLine
      stroke={resolvedColor}
      strokeWidth={2}
      strokeDasharray="4 4"
      onMouseEnter={() => {
        console.log('onMouseEnter');
        setIsHover(true);
      }}
      onMouseLeave={() => {
        console.log('onMouseLeave');
        setIsHover(false);
      }}
      label={<CustomReferenceLabel value={label} />}
      {...props}
    />
  );
};
