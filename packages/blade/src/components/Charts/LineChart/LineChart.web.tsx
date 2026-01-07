import React, { useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents';
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

const getLineOpacity = (hoveredDataKey: string | null, currentDataKey: string): number => {
  if (hoveredDataKey === null) return 1;
  if (hoveredDataKey === currentDataKey) return 1;
  return 0.2;
};

const getLineStrokeWidth = (hoveredDataKey: string | null, currentDataKey: string): number => {
  if (hoveredDataKey === null) return 1.5;
  if (hoveredDataKey === currentDataKey) return 3.5;
  return 1.5;
};

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
  _hoveredDataKey,
  _setHoveredDataKey,
  dataKey,
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

  const opacity = getLineOpacity(_hoveredDataKey ?? null, String(dataKey));
  const strokeWidth = getLineStrokeWidth(_hoveredDataKey ?? null, String(dataKey));

  // Pass onMouseEnter to activeDot so hovering the circle also highlights the line
  const activeDotProps = activeDot
    ? {
        onMouseEnter: () => _setHoveredDataKey?.(String(dataKey)),
      }
    : false;

  return (
    <RechartsLine
      dataKey={dataKey}
      stroke={colorToken}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      type={type}
      activeDot={activeDotProps}
      dot={dot}
      legendType={showLegend ? 'line' : 'none'}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={opacity}
      onMouseEnter={() => _setHoveredDataKey?.(String(dataKey))}
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
  const [hoveredDataKey, setHoveredDataKey] = useState<string | null>(null);
  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'line',
  });
  /**
   * We need to check child of CharLineWrapper. if they have any custom color we store that.
   * We need these mapping because colors of tooltip & legend is determine based on this
   *  recharts do provide a color but it is hex code and we need blade color token .
   */

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
          /**
           *  if we have custom color given by user we use that other wise we just
           *  assign theme colors to the dataColorMapping, in `assignDataColorMapping`
           */
          dataColorMapping[dataKey] = {
            colorToken: childColor,
            isCustomColor: Boolean(childColor),
          };
        }
        return React.cloneElement(child, {
          _index: LineChartIndex++,
          _colorTheme: colorTheme,
          _totalLines: totalLines,
          _hoveredDataKey: hoveredDataKey,
          _setHoveredDataKey: setHoveredDataKey,
        } as Partial<ChartLineProps>);
      }
      return child;
    });
    assignDataColorMapping(dataColorMapping, themeColors);

    return { dataColorMapping, lineChartModifiedChildrens, totalLines };
  }, [children, colorTheme, themeColors, hoveredDataKey]);

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
          <RechartsLineChart
            data={data}
            onMouseMove={(state) => {
              // Clear highlight when tooltip is not active (mouse in empty area)
              if (!state?.isTooltipActive) {
                setHoveredDataKey(null);
              }
            }}
            onMouseLeave={() => setHoveredDataKey(null)}
          >
            {lineChartModifiedChildrens}
          </RechartsLineChart>
        </RechartsResponsiveContainer>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartLine, ChartLineWrapper };
