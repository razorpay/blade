import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import {
  XAxis as LineChartXAxis,
  YAxis as LineChartYAxis,
  CartesianGrid as LineChartCartesianGrid,
  ChartTooltip as LineChartChartTooltip,
  Legend as LineChartLegend,
  ResponsiveContainer as LineChartResponsiveContainer,
  ReferenceLine as LineChartReferenceLine,
} from '../BaseChartComponents';
import type {
  XAxisProps as LineChartXAxisProps,
  YAxisProps as LineChartYAxisProps,
  CartesianGridProps as LineChartCartesianGridProps,
  ChartTooltipProps as LineChartChartTooltipProps,
  LegendProps as LineChartLegendProps,
  ResponsiveContainerProps as LineChartResponsiveContainerProps,
  ReferenceLineProps as LineChartReferenceLineProps,
} from '../BaseChartComponents';
import type { LineProps, LineChartProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const Line: React.FC<LineProps> = ({
  color,
  strokeStyle = 'solid',
  type = 'monotone',
  dot = false,
  activeDot = true,
  showLegend = true,
  _index,
  _colorTheme,
  ...props
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({ colorTheme: _colorTheme ?? 'default' });
  const colorToken = color ? getIn(theme.colors, color) : themeColors[_index ?? 0];

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
const LineChart: React.FC<LineChartProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'default',
  testID,
  data,
  ...restProps
}) => {
  const lineChartModifiedChildrens = React.useMemo(() => {
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
    <BaseBox
      {...metaAttribute({ name: 'line-chart', testID })}
      {...makeAnalyticsAttribute(restProps)}
      width="100%"
      height="100%"
    >
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>{lineChartModifiedChildrens}</RechartsLineChart>
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};

export type {
  LineChartProps,
  LineProps,
  LineChartXAxisProps,
  LineChartYAxisProps,
  LineChartCartesianGridProps,
  LineChartChartTooltipProps,
  LineChartLegendProps,
  LineChartResponsiveContainerProps,
  LineChartReferenceLineProps,
};
export {
  LineChart,
  Line,
  LineChartXAxis,
  LineChartYAxis,
  LineChartCartesianGrid,
  LineChartChartTooltip,
  LineChartLegend,
  LineChartResponsiveContainer,
  LineChartReferenceLine,
};
