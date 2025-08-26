import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
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

// Area Chart specific interfaces
export interface AreaProps {
  dataKey: string;
  name: string;
  type: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  stackId?: string | number;
  connectNulls?: boolean;
  color?: BladeColorToken;
  // Additional common props
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}

export interface ReferenceLineProps {
  y: number;
  label: string;
  color?: BladeColorToken;
}

// Predefined chart colors using Blade tokens
const getChartColors = (theme: Theme): Record<string, string> => ({
  primary: theme.colors.interactive.background.primary.default,
  secondary: theme.colors.surface.text.gray.normal,
  tertiary: theme.colors.feedback.text.positive.subtle,
  quaternary: theme.colors.feedback.text.notice.subtle,
  success: theme.colors.feedback.text.positive.subtle,
  warning: theme.colors.feedback.text.notice.subtle,
  error: theme.colors.feedback.text.negative.subtle,
  info: theme.colors.feedback.text.information.subtle,
  neutral: theme.colors.surface.text.gray.muted,
  grid: theme.colors.surface.border.gray.muted,
  background: theme.colors.surface.background.gray.intense,
});

// Curated palette for auto-assignment
const getCuratedPalette = (theme: Theme): string[] => [
  theme.colors.interactive.background.primary.default,
  theme.colors.feedback.text.positive.subtle,
  theme.colors.feedback.text.notice.subtle,
  theme.colors.feedback.text.information.subtle,
  theme.colors.surface.text.gray.muted,
];

// Helper function to resolve color tokens
const resolveColorToken = (color: BladeColorToken | undefined, theme: Theme): string => {
  if (!color) return getChartColors(theme).primary;

  if (
    color.startsWith('surface.') ||
    color.startsWith('feedback.') ||
    color.startsWith('interactive.')
  ) {
    const parts = color.split('.');
    let value: Record<string, any> = theme.colors;
    for (const part of parts) {
      value = value[part];
    }
    return (value as unknown as string) || getChartColors(theme).primary;
  }

  return color;
};

// Auto-assign colors from curated palette
let colorIndex = 0;
const getAutoAssignedColor = (theme: Theme): string => {
  const palette = getCuratedPalette(theme);
  const color = palette[colorIndex % palette.length];
  colorIndex++;
  return color;
};

// TypeScript prop types
export type AreaChartProps = Omit<ComponentProps<typeof RechartsAreaChart>, 'margin'> &
  StyledPropsBlade & {
    children?: React.ReactNode;
  };

export type XAxisProps = ComponentProps<typeof RechartsXAxis>;
export type YAxisProps = ComponentProps<typeof RechartsYAxis>;
export type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;
export type TooltipProps = ComponentProps<typeof RechartsTooltip>;
export type LegendProps = ComponentProps<typeof RechartsLegend>;
export type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;

// Styled wrapper for AreaChart with predefined margins
const StyledAreaChart = styled(RechartsAreaChart)<{ theme: Theme }>`
  font-family: ${(props) => props.theme.typography.fonts.family.text};
`;

// Main components
export const AreaChart: React.FC<AreaChartProps> = ({ children, ...props }) => {
  const { theme } = useTheme();
  const styledProps = getStyledProps(props);

  // Predefined margins - not exposed to user
  const defaultMargin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
  };

  // Reset color index for each chart render
  colorIndex = 0;

  return (
    <BaseBox {...styledProps} {...metaAttribute({ name: 'area-chart' })}>
      <StyledAreaChart theme={theme} margin={defaultMargin} {...props}>
        {children}
      </StyledAreaChart>
    </BaseBox>
  );
};

export const Area: React.FC<AreaProps> = ({
  color,
  type = 'monotone',
  connectNulls = false,
  fillOpacity = 0.6,
  strokeWidth = 2,
  ...props
}) => {
  const { theme } = useTheme();
  const resolvedColor = color ? resolveColorToken(color, theme) : getAutoAssignedColor(theme);

  return (
    <RechartsArea
      type={type}
      connectNulls={connectNulls}
      fill={resolvedColor}
      stroke={resolvedColor}
      fillOpacity={fillOpacity}
      strokeWidth={strokeWidth}
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

// Custom ChartTooltip component
export const ChartTooltip: React.FC<TooltipProps> = (props) => {
  return <Tooltip {...props} />;
}; 