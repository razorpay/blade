import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import { getHighestColorInRange, useChartsColorTheme, assignDataColorMapping } from '../utils';
import type { DataColorMapping } from '../CommonChartComponents';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type { ChartAreaProps, ChartAreaWrapperProps, ChartColorGradientProps } from './types';
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
  type = 'monotone',
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
  const colorToken = getIn(
    theme.colors,
    color ? getHighestColorInRange({ colorToken: color }) : themeColors[_index ?? 0],
  );
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
  const { colorScheme, theme } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = useChartsColorTheme({
    colorTheme: 'categorical',
    chartName: 'area',
    chartDataIndicators: totalAreaChartChildren,
  });

  const colorToken = getIn(
    theme.colors,
    getHighestColorInRange({
      colorToken: color ?? themeColors[index],
      followIntensityMapping: true,
    }),
  );
  return (
    <linearGradient id={id} key={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={colorToken} stopOpacity={isDarkMode ? 0.28 : 1} />
      <stop offset="95%" stopColor={colorToken} stopOpacity={isDarkMode ? 0.12 : 0.32} />
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
  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'area',
  });
  const { modifiedChildren, totalAreaChartChildren, dataColorMapping } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};

    // Count ChartLine components
    const totalAreas = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea,
    ).length;

    let AreaChartIndex = 0;
    /**
     * We need to check child of ChartAreaWrapper. if they have any custom color we store that.
     * We need these mapping because colors of tooltip & legend is determine based on this
     *  recharts do provide a color but it is hex code and we need blade color token .
     */
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea) {
        const childColor = child?.props?.color;
        const dataKey = (child?.props as ChartAreaProps)?.dataKey as string;
        if (dataKey) {
          //  assign  colors to the dataColorMapping, if no color is assigned  we assign color in `assignDataColorMapping`

          dataColorMapping[dataKey] = {
            colorToken: childColor,
            isCustomColor: Boolean(childColor),
          };
        }
        return React.cloneElement(child, {
          _index: AreaChartIndex++,
          _colorTheme: colorTheme,
          _totalAreas: totalAreas,
        } as Partial<ChartAreaProps>);
      }
      return child;
    });

    assignDataColorMapping(dataColorMapping, themeColors);
    return {
      modifiedChildren,
      totalAreaChartChildren: AreaChartIndex,
      dataColorMapping,
    };
  }, [children, colorTheme, themeColors]);

  return (
    <CommonChartComponentsContext.Provider
      value={{ chartName: 'area', dataColorMapping, chartData: data }}
    >
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
              {Object.keys(dataColorMapping).map((dataKey, index) => (
                <ChartColorGradient
                  key={`color-${index}-${dataKey}`}
                  id={`color-${index}-${dataKey}`}
                  index={index}
                  color={dataColorMapping[dataKey].colorToken}
                  totalAreaChartChildren={totalAreaChartChildren}
                />
              ))}
            </defs>

            {modifiedChildren}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
