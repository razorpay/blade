import React, { useState, useMemo, useEffect, isValidElement, cloneElement } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { animate } from 'framer-motion';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type {
  DataColorMapping,
  SecondaryLabelMap,
  ChartXAxisProps,
} from '../CommonChartComponents/types';
import { componentId as commonComponentIds } from '../CommonChartComponents/tokens';
import type { ChartLineProps, ChartLineWrapperProps } from './types';
import { componentIds } from './componentIds';
import { LineChartContext, useLineChartContext } from './LineChartContext';
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
  hide,
  dataKey,
  ...props
}) => {
  const { theme } = useTheme();
  const { hoveredDataKey, setHoveredDataKey } = useLineChartContext();

  const themeColors = useChartsColorTheme({
    colorTheme: _colorTheme,
    chartName: 'line',
    chartDataIndicators: _totalLines,
  });

  const isOtherLineHovered = hoveredDataKey !== null && hoveredDataKey !== dataKey;
  const colorToken = getIn(theme.colors, color ?? themeColors[_index ?? 0]);

  const strokeDasharray =
    strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

  const isLineDotted = strokeStyle === 'dashed';
  const animationBegin = isLineDotted
    ? theme.motion.delay.gentle + theme.motion.duration.xgentle
    : theme.motion.delay.gentle;
  const animationDuration = theme.motion.duration.xgentle;

  // Animated opacity using framer-motion
  const targetOpacity = isOtherLineHovered ? 0.2 : 1;
  const [animatedOpacity, setAnimatedOpacity] = useState(targetOpacity);

  useEffect(() => {
    const controls = animate(animatedOpacity, targetOpacity, {
      duration: 0.5,
      ease: 'easeInOut',
      onUpdate: (latest) => setAnimatedOpacity(latest),
    });

    return () => controls.stop();
  }, [targetOpacity]);

  // activeDot config with hover handlers
  const activeDotConfig = activeDot
    ? {
        onMouseEnter: () => !hide && setHoveredDataKey?.(dataKey as string),
        onMouseLeave: () => !hide && setHoveredDataKey?.(null),
      }
    : false;

  return (
    <>
      <RechartsLine
        key={`line-${dataKey}-background`}
        type="monotone"
        dataKey={dataKey}
        stroke="transparent"
        strokeWidth={15}
        dot={false}
        activeDot={false}
        onMouseEnter={() => !hide && setHoveredDataKey?.(dataKey as string)}
        onMouseLeave={() => !hide && setHoveredDataKey?.(null)}
        connectNulls
        legendType="none"
        tooltipType="none"
        hide={hide}
      />
      <RechartsLine
        key={`line-${dataKey}-main`}
        stroke={colorToken}
        strokeWidth={1.5}
        strokeDasharray={strokeDasharray}
        type={type}
        dataKey={dataKey}
        activeDot={isOtherLineHovered ? false : activeDotConfig}
        dot={dot}
        legendType={showLegend ? 'line' : 'none'}
        animationBegin={animationBegin}
        animationDuration={animationDuration}
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseEnter={() => !hide && setHoveredDataKey?.(dataKey as string)}
        onMouseLeave={() => !hide && setHoveredDataKey?.(null)}
        hide={hide}
        // Animated opacity using framer-motion
        strokeOpacity={animatedOpacity}
        isAnimationActive={true}
        {...props}
      />
    </>
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

  // State to track which line is currently hovered
  const [hoveredDataKey, setHoveredDataKey] = useState<string | null>(null);
  const [selectedDataKeys, setSelectedDataKeys] = useState<string[] | undefined>(undefined);

  /**
   * We need to check child of CharLineWrapper. if they have any custom color we store that.
   * We need these mapping because colors of tooltip & legend is determine based on this
   *  recharts do provide a color but it is hex code and we need blade color token .
   */

  const { dataColorMapping, lineChartModifiedChildrens, secondaryDataKey } = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};
    // Count ChartLine components
    const totalLines = childrenArray.filter(
      (child): child is React.ReactElement =>
        isValidElement(child) && getComponentId(child) === componentIds.ChartLine,
    ).length;

    // Find ChartXAxis and extract secondaryDataKey
    let secondaryDataKey: string | undefined;
    for (const child of childrenArray) {
      if (React.isValidElement(child) && getComponentId(child) === commonComponentIds.chartXAxis) {
        secondaryDataKey = (child.props as ChartXAxisProps)?.secondaryDataKey;
        break;
      }
    }

    let LineChartIndex = 0;
    const lineChartModifiedChildrens = React.Children.map(children, (child) => {
      if (isValidElement(child) && getComponentId(child) === componentIds.ChartLine) {
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
        // Pass hide prop based on whether this line's dataKey is NOT in selectedDataKeys
        // If selectedDataKeys is undefined, show all lines (default behavior)
        return cloneElement(child, {
          _index: LineChartIndex++,
          _colorTheme: colorTheme,
          _totaLine: totalLines,
          hide: selectedDataKeys ? !selectedDataKeys.includes(dataKey) : false,
        } as Partial<ChartLineProps>);
      }
      return child;
    });
    assignDataColorMapping(dataColorMapping, themeColors);

    return { dataColorMapping, lineChartModifiedChildrens, totalLines, secondaryDataKey };
  }, [children, colorTheme, themeColors, selectedDataKeys]);

  // Build secondary label map internally from ChartXAxis's secondaryDataKey prop
  const secondaryLabelMap = useMemo<SecondaryLabelMap | undefined>(() => {
    if (!secondaryDataKey || !data) return undefined;
    const map: SecondaryLabelMap = {};
    data.forEach((item, index) => {
      map[index] = item[secondaryDataKey] as string | number | undefined;
    });
    return map;
  }, [data, secondaryDataKey]);

  // Memoize context values to prevent unnecessary re-renders of consumers
  const lineChartContextValue = useMemo(
    () => ({ hoveredDataKey, setHoveredDataKey }),
    [hoveredDataKey],
  );

  const commonChartContextValue = useMemo(
    () => ({
      chartName: 'line' as const,
      dataColorMapping,
      selectedDataKeys,
      setSelectedDataKeys,
      secondaryLabelMap,
      dataLength: data?.length,
    }),
    [dataColorMapping, selectedDataKeys, secondaryLabelMap, data?.length],
  );

  return (
    <LineChartContext.Provider value={lineChartContextValue}>
      <CommonChartComponentsContext.Provider value={commonChartContextValue}>
        <BaseBox
          {...metaAttribute({ name: 'line-chart', testID })}
          {...makeAnalyticsAttribute(restProps)}
          width="100%"
          height="100%"
          {...restProps}
        >
          <RechartsResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} onMouseLeave={() => setHoveredDataKey(null)}>
              {lineChartModifiedChildrens}
            </RechartsLineChart>
          </RechartsResponsiveContainer>
        </BaseBox>
      </CommonChartComponentsContext.Provider>
    </LineChartContext.Provider>
  );
};

export { ChartLine, ChartLineWrapper };
