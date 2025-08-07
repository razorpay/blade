import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
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
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';

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

// Chart-specific interfaces based on user specifications
export interface LineProps extends Omit<ComponentProps<typeof RechartsLine>, 'type'> {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  dot?: React.ReactNode;
  connectNulls?: boolean;
  legendType?:
    | 'none'
    | 'line'
    | 'square'
    | 'diamond'
    | 'circle'
    | 'cross'
    | 'triangle'
    | 'triangleDown'
    | 'triangleUp'
    | 'star'
    | 'wye';
  dataKey: string;
  name?: string;
  color?: BladeColorToken;
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
}

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  color?: BladeColorToken;
}

// Predefined chart colors using Blade tokens
const getChartColors = (theme: Theme): Record<string, string> => ({
  primary: theme.colors.interactive.background.primary.default,
  secondary: theme.colors.surface.text.gray.normal,
  success: theme.colors.feedback.text.positive.subtle,
  warning: theme.colors.feedback.text.notice.subtle,
  error: theme.colors.feedback.text.negative.subtle,
  info: theme.colors.feedback.text.information.subtle,
  neutral: theme.colors.surface.text.gray.muted,
  grid: theme.colors.surface.border.gray.muted,
  background: theme.colors.surface.background.gray.intense,
});

// Helper function to resolve color tokens
const resolveColorToken = (color: BladeColorToken | undefined, theme: Theme): string => {
  if (!color) return getChartColors(theme).primary;

  if (
    color.startsWith('surface.') ||
    color.startsWith('feedback.') ||
    color.startsWith('interactive.')
  ) {
    const parts = color.split('.');
    let value: any = theme.colors;
    for (const part of parts) {
      value = value[part];
    }
    return value || getChartColors(theme).primary;
  }

  return color;
};

// TypeScript prop types
export type LineChartProps = Omit<ComponentProps<typeof RechartsLineChart>, 'margin'> &
  StyledPropsBlade & {
    children?: React.ReactNode;
  };

export type XAxisProps = ComponentProps<typeof RechartsXAxis>;
export type YAxisProps = ComponentProps<typeof RechartsYAxis>;
export type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;
export type TooltipProps = ComponentProps<typeof RechartsTooltip>;
export type LegendProps = ComponentProps<typeof RechartsLegend>;
export type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;

// Styled wrapper for LineChart with predefined margins
const StyledLineChart = styled(RechartsLineChart)<{ theme: Theme }>`
  font-family: ${(props) => props.theme.typography.fonts.family.text};
`;

// Main components
export const LineChart: React.FC<LineChartProps> = ({ children, ...props }) => {
  const { theme } = useTheme();
  const styledProps = getStyledProps(props);

  // Predefined margins - not exposed to user
  const defaultMargin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
  };

  return (
    <BaseBox {...styledProps} {...metaAttribute({ name: 'line-chart' })}>
      <StyledLineChart theme={theme} margin={defaultMargin} {...props}>
        {children}
      </StyledLineChart>
    </BaseBox>
  );
};

export const Line: React.FC<LineProps> = ({
  color,
  strokeStyle = 'solid',
  type = 'monotone',
  ...props
}) => {
  const { theme } = useTheme();
  const resolvedColor = resolveColorToken(color, theme);

  const strokeDasharray =
    strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

  return (
    <RechartsLine
      stroke={resolvedColor}
      strokeWidth={2}
      strokeDasharray={strokeDasharray}
      type={type}
      dot={{ fill: resolvedColor, strokeWidth: 0, r: 4 }}
      activeDot={{ r: 6, strokeWidth: 0 }}
      {...props}
    />
  );
};

export const ReferenceLine: React.FC<ReferenceLineProps> = ({ color, label, ...props }) => {
  const { theme } = useTheme();
  const resolvedColor = resolveColorToken(color, theme);

  return (
    <RechartsReferenceLine
      stroke={resolvedColor}
      strokeWidth={1}
      strokeDasharray="3 3"
      label={label}
      {...props}
    />
  );
};

export const XAxis: React.FC<XAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsXAxis
      axisLine={false}
      tickLine={false}
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      {...props}
    />
  );
};

export const YAxis: React.FC<YAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsYAxis
      axisLine={false}
      tickLine={false}
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      {...props}
    />
  );
};

export const CartesianGrid: React.FC<CartesianGridProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsCartesianGrid
      strokeDasharray="3 3"
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      {...props}
    />
  );
};

export const Tooltip: React.FC<TooltipProps> = (props) => {
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
      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
      {...props}
    />
  );
};

export const Legend: React.FC<LegendProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsLegend
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
      }}
      {...props}
    />
  );
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = (props) => {
  return <RechartsResponsiveContainer {...props} />;
};

// Custom ChartTooltip component for forecast charts
export const ChartTooltip: React.FC<TooltipProps> = (props) => {
  return <Tooltip {...props} />;
};
