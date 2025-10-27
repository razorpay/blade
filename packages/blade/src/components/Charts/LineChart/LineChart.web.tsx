import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import { CommonChartComponentsContext, DEFAULT_COLOR } from '../CommonChartComponents';
import type { DataColorMapping } from '../CommonChartComponents/types';
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
  const colorToken = getIn(theme.colors, color ?? themeColors[_index ?? 0]);

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
      strokeWidth={1.5}
      strokeDasharray={strokeDasharray}
      type={type}
      activeDot={activeDot}
      dot={dot}
      legendType={showLegend ? 'line' : 'none'}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      strokeLinecap="round"
      strokeLinejoin="round"
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
  colorTheme = 'categorical',
  testID,
  data,
  ...restProps
}) => {
  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'line',
  });
  const { dataColorMapping, lineChartModifiedChildrens } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};
    // Count ChartLine components
    const totalLines = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.ChartLine,
    ).length;

    let LineChartIndex = 0;
    const lineChartModifiedChildrens = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartLine) {
        const childColor = child?.props?.color;
        const dataKey = (child?.props as ChartLineProps)?.dataKey as string;
        if (dataKey) {
          dataColorMapping[dataKey] = {
            colorToken: childColor,
            isCustomColor: Boolean(childColor),
          };
        }
        return React.cloneElement(child, {
          _index: LineChartIndex++,
          _colorTheme: colorTheme,
          _totaLine: totalLines,
        } as Partial<ChartLineProps>);
      }
      return child;
    });
    /* check if dataColor mapping has only one key and if it does, we need to add the default color to the dataColorMapping if no color is provided. */
    if (
      Object.keys(dataColorMapping).length === 1 &&
      !dataColorMapping[Object.keys(dataColorMapping)[0]]?.colorToken
    ) {
      dataColorMapping[Object.keys(dataColorMapping)[0]] = {
        colorToken: DEFAULT_COLOR,
        isCustomColor: false,
      };
    }
    /* assigne theme colors to the dataColorMapping , if  no color is assigned. */
    Object.keys(dataColorMapping).forEach((key) => {
      if (!dataColorMapping[key]?.colorToken) {
        dataColorMapping[key] = {
          colorToken: themeColors[Object.keys(dataColorMapping).indexOf(key)],
          isCustomColor: false,
        };
      }
    });

    return { dataColorMapping, lineChartModifiedChildrens, totalLines };
  }, [children, colorTheme, themeColors]);

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'line', dataColorMapping }}>
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
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartLine, ChartLineWrapper };
