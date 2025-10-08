import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type { ChartLineProps, ChartLineWrapperProps } from './types';
import { componentIds } from './componentIds';
import { metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const Line: React.FC<ChartLineProps> = ({
  color,
  strokeStyle = 'solid',
  type = 'monotone',
  dot = false,
  activeDot = true,
  showLegend = true,
  _index,
  _colorTheme,
  _totalLines,
  ...props
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({
    colorTheme: _colorTheme,
    chartName: 'line',
    chartDataIndicators: _totalLines,
  });
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

const ChartLine = assignWithoutSideEffects(Line, {
  componentId: componentIds.ChartLine,
});

// Main components
const ChartLineWrapper: React.FC<ChartLineWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'default',
  testID,
  data,
  ...restProps
}) => {
  const lineChartModifiedChildrens = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    // Count ChartLine components
    const totalLines = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.ChartLine,
    ).length;

    let LineChartIndex = 0;
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartLine) {
        return React.cloneElement(child, {
          _index: LineChartIndex++,
          _colorTheme: colorTheme,
          _totaLine: totalLines,
        } as Partial<ChartLineProps>);
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
      {...restProps}
    >
      <RechartsResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>{lineChartModifiedChildrens}</RechartsLineChart>
      </RechartsResponsiveContainer>
    </BaseBox>
  );
};

export { ChartLine, ChartLineWrapper };
