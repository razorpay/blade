import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type {
  ChartAreaProps,
  ChartAreaWrapperProps,
  ChartColorGradientProps,
  ChartColorGradientData,
} from './types';
import { componentIds } from './componentIds';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';

const Area: React.FC<ChartAreaProps> = ({
  color,
  type = 'linear',
  connectNulls = false,
  showLegend = true,
  stackId = 1,
  dot = false,
  activeDot = true,
  _index,
  _colorTheme,
  _totalAreas,
  dataKey,
  name,
  ...props
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({
    colorTheme: _colorTheme,
    chartName: 'area',
    chartDataIndicators: _totalAreas,
  });
  const colorToken = getIn(theme.colors, color ?? themeColors[_index ?? 0]);
  const animationBegin = theme.motion.delay.gentle;
  const animationDuration = theme.motion.duration.xgentle;

  return (
    <RechartsArea
      {...props}
      fill={`url(#color-${_index}-${dataKey})`}
      dataKey={dataKey}
      name={name}
      stroke={colorToken}
      fillOpacity={0.5}
      type={type}
      connectNulls={connectNulls}
      legendType={showLegend ? 'rect' : 'none'}
      strokeWidth={1.5}
      dot={dot}
      stackId={stackId}
      activeDot={activeDot}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
    />
  );
};

const ChartArea = assignWithoutSideEffects(Area, {
  componentId: componentIds.ChartArea,
});

const ChartColorGradient: React.FC<ChartColorGradientProps> = ({
  index,
  color,
  totalAreaChartChildren,
  id,
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({
    colorTheme: 'categorical',
    chartName: 'area',
    chartDataIndicators: totalAreaChartChildren,
  });

  const colorToken = getIn(theme.colors, color ?? themeColors[index]);

  return (
    <linearGradient id={id} key={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={colorToken} stopOpacity={0.8} />
      <stop offset="95%" stopColor={colorToken} stopOpacity={0} />
    </linearGradient>
  );
};

// Main components
const ChartAreaWrapper: React.FC<ChartAreaWrapperProps & TestID & DataAnalyticsAttribute> = ({
  data,
  children,
  testID,
  colorTheme = 'categorical',
  ...restProps
}) => {
  const {
    modifiedChildren,
    AreaChartGraidentGradientData,
    totalAreaChartChildren,
  } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const AreaChartGraidentGradientData: ChartColorGradientData[] = [];

    // Count ChartLine components
    const totalAreas = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea,
    ).length;

    let AreaChartIndex = 0;
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea) {
        const AreaChartColor = child?.props?.color;
        //@ts-expect-error
        const AreaChartDataKey = child?.props?.dataKey;
        AreaChartGraidentGradientData.push({
          color: AreaChartColor,
          dataKey: AreaChartDataKey,
        });
        return React.cloneElement(child, {
          _index: AreaChartIndex++,
          _colorTheme: colorTheme,
          _totalAreas: totalAreas,
        } as Partial<ChartAreaProps>);
      }
      return child;
    });
    return {
      modifiedChildren,
      AreaChartGraidentGradientData,
      totalAreaChartChildren: AreaChartIndex,
    };
  }, [children, colorTheme]);

  return (
    <BaseBox
      {...metaAttribute({ name: 'chart-area-container', testID })}
      {...makeAnalyticsAttribute(restProps)}
      {...restProps}
      width="100%"
      height="100%"
    >
      <ResponsiveContainer>
        <RechartsAreaChart data={data}>
          <defs>
            {AreaChartGraidentGradientData.map(({ color, dataKey }, index) => (
              <ChartColorGradient
                key={`color-${index}-${dataKey}`}
                id={`color-${index}-${dataKey}`}
                index={index}
                color={color}
                totalAreaChartChildren={totalAreaChartChildren}
              />
            ))}
          </defs>

          {modifiedChildren}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </BaseBox>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
