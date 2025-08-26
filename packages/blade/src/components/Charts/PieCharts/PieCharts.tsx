import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  Label as RechartsLabel,
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

// Donut radius configurations
type DonutRadius = 'small' | 'medium' | 'large' | 'extraLarge' | 'none';
type CircleType = 'full' | 'half' | 'quarter';
type PaddingAngle = 'none' | 'small' | 'medium' | 'large' | 'extraLarge';

// Pie Chart specific interfaces
export interface PieProps extends Omit<ComponentProps<typeof RechartsPie>, 'innerRadius' | 'outerRadius' | 'startAngle' | 'endAngle' | 'paddingAngle'> {
  dataKey: string;
  nameKey?: string;
  data: { [key: string]: string | number }[];
  cx?: string | number;
  cy?: string | number;
  donutRadius?: DonutRadius;
  circleType?: CircleType;
  paddingAngle?: PaddingAngle;
  activeShape?: React.ReactElement | ((props: any) => React.ReactNode);
}

export interface CellProps extends ComponentProps<typeof RechartsCell> {
  fill?: BladeColorToken;
}

// Chart color tokens
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
    let value: Record<string, any> = theme.colors;
    for (const part of parts) {
      value = value[part];
    }
    return (value as string) || getChartColors(theme).primary;
  }
  
  return color;
};

// Helper functions for radius and angle calculations
const getDonutRadiusValues = (donutRadius: DonutRadius): { innerRadius: number; outerRadius: number } => {
  switch (donutRadius) {
    case 'small':
      return { innerRadius: 40, outerRadius: 80 };
    case 'medium':
      return { innerRadius: 50, outerRadius: 90 };
    case 'large':
      return { innerRadius: 60, outerRadius: 100 };
    case 'extraLarge':
      return { innerRadius: 70, outerRadius: 110 };
    case 'none':
    default:
      return { innerRadius: 0, outerRadius: 80 };
  }
};

const getCircleTypeAngles = (circleType: CircleType): { startAngle: number; endAngle: number } => {
  switch (circleType) {
    case 'half':
      return { startAngle: 180, endAngle: 0 };
    case 'quarter':
      return { startAngle: 270, endAngle: 0 };
    case 'full':
    default:
      return { startAngle: 0, endAngle: 360 };
  }
};

const getPaddingAngleValue = (paddingAngle: PaddingAngle): number => {
  switch (paddingAngle) {
    case 'small':
      return 1;
    case 'medium':
      return 2;
    case 'large':
      return 4;
    case 'extraLarge':
      return 6;
    case 'none':
    default:
      return 0;
  }
};

// TypeScript prop types
export type PieChartProps = ComponentProps<typeof RechartsPieChart> & StyledPropsBlade & {
  children?: React.ReactNode;
};

export type TooltipProps = ComponentProps<typeof RechartsTooltip>;
export type LegendProps = ComponentProps<typeof RechartsLegend>;
export type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;
export type LabelProps = ComponentProps<typeof RechartsLabel>;

// Styled wrapper for PieChart
const StyledPieChart = styled(RechartsPieChart)<{ theme: Theme }>`
  font-family: ${(props) => props.theme.typography.fonts.family.text};
`;

// Main components
export const PieChart: React.FC<PieChartProps> = ({ children, ...props }) => {
  const { theme } = useTheme();
  const styledProps = getStyledProps(props);

  return (
    <BaseBox {...styledProps} {...metaAttribute({ name: 'pie-chart' })}>
      <StyledPieChart theme={theme} {...props}>
        {children}
      </StyledPieChart>
    </BaseBox>
  );
};

export const Pie: React.FC<PieProps> = ({ 
  donutRadius = 'none',
  circleType = 'full',
  paddingAngle = 'none',
  cx = '50%',
  cy = '50%',
  ...props 
}) => {
  const radiusValues = getDonutRadiusValues(donutRadius);
  const angleValues = getCircleTypeAngles(circleType);
  const paddingValue = getPaddingAngleValue(paddingAngle);

  return (
    <RechartsPie
      cx={cx}
      cy={cy}
      innerRadius={radiusValues.innerRadius}
      outerRadius={radiusValues.outerRadius}
      startAngle={angleValues.startAngle}
      endAngle={angleValues.endAngle}
      paddingAngle={paddingValue}
      {...props}
    />
  );
};

export const Cell: React.FC<CellProps> = ({ fill, ...props }) => {
  const { theme } = useTheme();
  const resolvedColor = fill ? resolveColorToken(fill, theme) : undefined;
  
  return (
    <RechartsCell
      fill={resolvedColor}
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

export const Label: React.FC<LabelProps> = (props) => {
  const { theme } = useTheme();
  
  return (
    <RechartsLabel
      style={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[200],
        fill: theme.colors.surface.text.gray.normal,
        fontWeight: theme.typography.fonts.weight.semibold,
      }}
      {...props}
    />
  );
};

// Custom ChartTooltip component
export const ChartTooltip: React.FC<TooltipProps> = (props) => {
  return <Tooltip {...props} />;
};
