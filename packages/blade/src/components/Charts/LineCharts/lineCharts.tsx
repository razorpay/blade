import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  ReferenceLine as RechartsReferenceLine,
} from 'recharts';
import type { LineProps as RechartsLineProps } from 'recharts';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';
import type { ChartColorCategories, ChartCategoricalEmphasis } from '~tokens/theme/theme';
import getIn from '~utils/lodashButBetter/get';

// BladeColorToken type for charts - only allows categorical chart colors for line charts
export type BladeColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

// Chart-specific interfaces based on user specifications
export interface LineProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  dot?: RechartsLineProps['dot'];
  activeDot?: RechartsLineProps['activeDot'];
  connectNulls?: boolean;
  legendType?: 'none' | 'line' | 'square' | 'diamond' | 'circle' | 'cross' | 'triangle' | 'wye';
  dataKey: string;
  name?: string;
  color: BladeColorToken;
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
}

// TypeScript prop types
export type LineChartProps = Omit<ComponentProps<typeof RechartsLineChart>, 'margin'> &
  StyledPropsBlade & {
    children?: React.ReactNode;
  };

export type TooltipProps = ComponentProps<typeof RechartsTooltip>;
export type LegendProps = ComponentProps<typeof RechartsLegend>;
export type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  color?: BladeColorToken;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelOffset?: number;
}

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
      <StyledLineChart {...props} theme={theme} margin={defaultMargin}>
        {children}
      </StyledLineChart>
    </BaseBox>
  );
};

export const Line: React.FC<LineProps> = ({
  color,
  strokeStyle = 'solid',
  type = 'monotone',
  dot,
  activeDot,
  ...props
}) => {
  const { theme } = useTheme();
  const colorToken = getIn(theme.colors, color);

  const strokeDasharray =
    strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

  return (
    <RechartsLine
      stroke={colorToken}
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

const CustomSquareLegend = (props: {
  payload?: Array<{ value: string; color: string }>;
}): JSX.Element | null => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

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
        paddingTop: '16px',
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

const CustomReferenceLabel = ({
  viewBox,
  value,
}: {
  viewBox?: { x: number; y: number; width: number };
  value: string | undefined;
}): JSX.Element => {
  const { x, y, width } = viewBox ?? { x: 0, y: 0, width: 0 };
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
        {value}
      </text>
    </g>
  );
};

export const ReferenceLine: React.FC<ReferenceLineProps> = ({ color, label, ...props }) => {
  const { theme } = useTheme();

  return (
    <RechartsReferenceLine
      stroke={getIn(theme.colors, 'chart.background.categorical.gray.intense')}
      strokeWidth={2}
      strokeDasharray="4 4"
      label={<CustomReferenceLabel value={label} />}
      {...props}
    />
  );
};
