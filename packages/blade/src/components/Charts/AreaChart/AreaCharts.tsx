import React from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import type { AreaProps as RechartAreaProps } from 'recharts';

import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import type { ChartColorCategories, ChartCategoricalEmphasis } from '~tokens/theme/theme';
import getIn from '~utils/lodashButBetter/get';

// BladeColorToken type for charts - only allows categorical chart colors for area charts
export type BladeColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

// Chart-specific interfaces based on user specifications
export interface AreaProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  connectNulls?: boolean;
  showLegend?: boolean;
  dataKey: string;
  name: string;
  stackId?: string | number;
  color?: BladeColorToken;
  dot?: RechartAreaProps['dot'];
  activeDot?: RechartAreaProps['activeDot'];
}

// TypeScript prop types
export type AreaChartProps = Omit<ComponentProps<typeof RechartsAreaChart>, 'margin'> &
  StyledPropsBlade & {
    children?: React.ReactNode;
  };

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

  return (
    <BaseBox {...styledProps} {...metaAttribute({ name: 'area-chart' })} width="100%" height="100%">
      <ResponsiveContainer>
        <StyledAreaChart {...props} theme={theme} margin={defaultMargin}>
          {children}
        </StyledAreaChart>
      </ResponsiveContainer>
    </BaseBox>
  );
};

export const Area: React.FC<AreaProps> = ({
  color,
  type = 'monotone',
  connectNulls = false,
  showLegend = true,
  stackId = 1,
  dot = false,
  activeDot = false,
  ...props
}) => {
  const { theme } = useTheme();
  const colorToken = color ? getIn(theme.colors, color) : undefined;

  return (
    <RechartsArea
      {...props}
      fill={colorToken}
      stroke={colorToken}
      fillOpacity={0.09}
      type={type}
      connectNulls={connectNulls}
      legendType={showLegend ? 'rect' : 'none'}
      strokeWidth={3}
      dot={dot}
      stackId={stackId}
      activeDot={activeDot}
    />
  );
};
