import React from 'react';
import type { ComponentProps } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import type { LineProps as RechartsLineProps } from 'recharts';
import { useChartsColorTheme } from '../utils';
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
  color?: BladeColorToken;
  strokeStyle?: 'dotted' | 'dashed' | 'solid';
  /**
   * @private
   */
  _index?: number; // Add this for internal use
  /**
   * @private
   */
  _colorTheme?: 'default' | 'informational';
}

// TypeScript prop types
export type LineChartProps = ComponentProps<typeof RechartsLineChart> & {
  colorTheme?: 'default' | 'informational';
};

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  color?: BladeColorToken;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelOffset?: number;
}

export const Line: React.FC<LineProps> = ({
  color,
  strokeStyle = 'solid',
  type = 'monotone',
  dot = false,
  activeDot = false,
  showLegend = true,
  _index,
  _colorTheme,
  ...props
}) => {
  const { theme } = useTheme();
  const colorIndex = useChartsColorTheme({ colorTheme: _colorTheme ?? 'default' });
  const colorToken = color ? getIn(theme.colors, color) : colorIndex[_index ?? 0];

  const strokeDasharray =
    strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

  const isLineDotted = strokeStyle === 'dashed';
  const animationBegin = isLineDotted
    ? theme.motion.delay.gentle + theme.motion.duration.xgentle
    : theme.motion.delay.gentle;
  const animationDuration = theme.motion.duration.xgentle;

  return (
    <RechartsLine
      stroke={colorToken}
      strokeWidth={3}
      strokeDasharray={strokeDasharray}
      type={type}
      activeDot={activeDot}
      dot={dot}
      legendType={showLegend ? 'line' : 'none'}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      {...props}
    />
  );
};

// Main components
export const LineChart: React.FC<LineChartProps> = ({
  children,
  colorTheme = 'default',
  ...props
}) => {
  const childrenWithIndex = React.useMemo(() => {
    let LineChartIndex = 0;
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Line) {
        return React.cloneElement(child, {
          _index: LineChartIndex++,
          _colorTheme: colorTheme,
        } as Partial<LineProps>);
      }
      return child;
    });
  }, [children, colorTheme]);

  return (
    <BaseBox {...metaAttribute({ name: 'line-chart' })} width="100%" height="100%">
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsLineChart {...props}>{childrenWithIndex}</RechartsLineChart>
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};
