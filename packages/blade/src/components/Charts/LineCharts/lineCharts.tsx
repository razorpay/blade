import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import { LineChart as RechartsLineChart, Line as RechartsLine } from 'recharts';
import type { LineProps as RechartsLineProps } from 'recharts';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
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
  showLegend?: boolean;
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
  dot = false,
  activeDot = false,
  showLegend = true,
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
      activeDot={activeDot}
      dot={dot}
      legendType={showLegend ? 'line' : 'none'}
      {...props}
    />
  );
};
