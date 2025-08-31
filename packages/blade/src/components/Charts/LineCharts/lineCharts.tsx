import React from 'react';
import type { ComponentProps } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import type { LineProps as RechartsLineProps } from 'recharts';
import { useTheme } from '~components/BladeProvider';
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
export type LineChartProps = ComponentProps<typeof RechartsLineChart>;

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  color?: BladeColorToken;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelOffset?: number;
}

// Main components
export const LineChart: React.FC<LineChartProps> = ({ children, ...props }) => {
  return (
    <BaseBox {...metaAttribute({ name: 'line-chart' })} width="100%" height="100%">
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsLineChart {...props}>{children}</RechartsLineChart>
      </RechartsResponsiveContainer>
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
