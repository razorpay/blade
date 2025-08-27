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
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

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
export interface LineProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  dot?:
    | boolean
    | { r?: number; fill?: string; stroke?: string; strokeWidth?: number; [key: string]: any };
  activeDot?:
    | boolean
    | { r?: number; fill?: string; stroke?: string; strokeWidth?: number; [key: string]: any };
  connectNulls?: boolean;
  legendType?: 'none' | 'line' | 'square' | 'diamond' | 'circle' | 'cross' | 'triangle' | 'wye';
  dataKey: string;
  name?: string;
  color?: BladeColorToken;
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
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
    let value: Record<string, any> = theme.colors;
    for (const part of parts) {
      value = value[part];
    }
    //@ts-expect-error
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
  dot = true,
  activeDot = true,
  ...props
}) => {
  const { theme } = useTheme();
  const resolvedColor = resolveColorToken(color, theme);

  const strokeDasharray =
    strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

  return (
    <RechartsLine
      stroke={resolvedColor}
      strokeWidth={3}
      strokeDasharray={strokeDasharray}
      type={type}
      activeDot={false}
      dot={false}
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

const CustomSquareLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px', // Adjust spacing between legend items
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
            {/* <span style={{ fontSize: '16px', color: '#333' }}>{entry.value}</span>{' '} */}
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

export const Legend: React.FC<LegendProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsLegend
      wrapperStyle={{
        fontFamily: theme.typography.fonts.family.text,
        fontSize: theme.typography.fonts.size[100],
        color: theme.colors.surface.text.gray.normal,
      }}
      content={<CustomSquareLegend />}
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
