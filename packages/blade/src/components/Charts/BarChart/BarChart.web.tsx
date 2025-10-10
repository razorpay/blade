import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useMotionValue, useMotionValueEvent } from 'framer-motion';
import { useChartsColorTheme, getHighestColorInSequence } from '../utils';
import { CommonChartComponentsContext, DEFAULT_COLOR } from '../CommonChartComponents';
import type { DataColorMapping } from '../CommonChartComponents';
import { BarChartContext, useBarChartContext } from './BarChartContext';
import type { ChartBarProps, ChartBarWrapperProps } from './types';
import {
  DISTANCE_BETWEEN_STACKED_BARS,
  componentIds,
  BAR_SIZE,
  DISTANCE_BETWEEN_BARS,
  DISTANCE_BETWEEN_CATEGORY_BARS,
  ANIMATION_TIME_OFFEST,
} from './tokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type RechartsShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  index: number;
};

// Bar component - resolves Blade color tokens to actual colors
const _ChartBar: React.FC<ChartBarProps> = ({
  color,
  name,
  dataKey,
  activeBar = false,
  label = false,
  showLegend = true,
  _index = 0,
  _totalbars,
  ...rest
}) => {
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const animationValue = useMotionValue(0);
  const { theme } = useTheme();
  const { layout, activeIndex, colorTheme: _colorTheme, totalBars } = useBarChartContext();
  const defaultColorArray = useChartsColorTheme({
    colorTheme: _colorTheme,
    chartName: 'bar',
    chartDataIndicators: _totalbars,
  });
  const fill = getIn(theme.colors, color ?? defaultColorArray[_index]);
  const strokeFill = getIn(
    theme.colors,
    getHighestColorInSequence({
      colorToken: color ?? defaultColorArray[_index],
      followIntensityMapping: Boolean(color),
    }),
  );
  useMotionValueEvent(animationValue, 'change', (latest) => {
    if (latest >= 1) {
      setAnimationsComplete(true);
    }
  });
  const isStacked = rest.stackId !== undefined;
  const animationBegin = isStacked
    ? (theme.motion.duration.gentle / totalBars) * _index
    : theme.motion.duration.gentle;
  const animationDuration = isStacked
    ? theme.motion.duration.gentle / totalBars
    : theme.motion.duration.gentle;
  const totalAnimationTime = theme.motion.duration.gentle + ANIMATION_TIME_OFFEST;

  useEffect(() => {
    const timer = setTimeout(() => {
      animationValue.set(1);
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [totalAnimationTime, animationValue]);

  return (
    <RechartsBar
      {...rest}
      fill={fill}
      legendType={showLegend ? 'rect' : 'none'}
      activeBar={activeBar}
      label={label}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      animationEasing="linear"
      dataKey={dataKey}
      name={name}
      onAnimationEndCapture={() => setAnimationsComplete(true)}
      shape={(props: unknown) => {
        const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
        const fillOpacity = isNumber(activeIndex) ? (barIndex === activeIndex ? 1 : 0.2) : 1;
        const gap = DISTANCE_BETWEEN_STACKED_BARS;
        const isVertical = layout === 'vertical';

        if (isVertical) {
          return (
            <>
              <rect
                fill={fill}
                x={x + gap / 1.5}
                y={y}
                width={width - gap}
                height={height}
                fillOpacity={fillOpacity}
              />
              {animationsComplete && (
                <rect
                  fill={strokeFill}
                  x={x + gap / 1.5 + (width - gap) - 1.5} // Position at the right end
                  y={y}
                  width={1.5}
                  height={height}
                  fillOpacity={fillOpacity}
                />
              )}
            </>
          );
        }
        return (
          <>
            <rect
              fill={fill}
              x={x}
              y={y + gap / 1.5}
              width={width}
              height={height > gap ? height - gap : 0}
              fillOpacity={fillOpacity}
            />
            {animationsComplete && (
              <rect
                fill={strokeFill}
                x={x}
                y={y + gap / 1.5}
                width={width}
                height={1.5}
                fillOpacity={fillOpacity}
              />
            )}
          </>
        );
      }}
    />
  );
};

const ChartBar = assignWithoutSideEffects(_ChartBar, {
  componentId: componentIds.chartBar,
});

// BarChart wrapper with default margin, auto-color assignment, and max bars guard
const ChartBarWrapper: React.FC<ChartBarWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'categorical',
  layout = 'horizontal',
  testID,
  data = [],
  ...restProps
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'bar',
  });

  const { barChartModifiedChildrens, totalBars, dataColorMapping } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};

    // Count ChartBar components
    const totalBars = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.chartBar,
    ).length;

    let BarChartIndex = 0;
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.chartBar) {
        const childColor = child?.props?.color;
        const dataKey = (child?.props as ChartBarProps)?.dataKey;
        if (dataKey && typeof dataKey === 'string') {
          dataColorMapping[dataKey] = childColor;
        }
        return React.cloneElement(child, {
          _index: BarChartIndex++,
          _totalbars: totalBars,
        } as Partial<ChartBarProps>);
      }
      return child;
    });
    /* check if dataColor mapping has only one key and if it does, we need to add the default color to the dataColorMapping if no color is provided. */
    if (
      Object.keys(dataColorMapping).length === 1 &&
      !dataColorMapping[Object.keys(dataColorMapping)[0]]
    ) {
      dataColorMapping[Object.keys(dataColorMapping)[0]] = DEFAULT_COLOR;
    }
    /* assigne theme colors to the dataColorMapping , if  no color is assigned. */
    Object.keys(dataColorMapping).forEach((key) => {
      if (!dataColorMapping[key]) {
        dataColorMapping[key] = themeColors[Object.keys(dataColorMapping).indexOf(key)];
      }
    });

    return {
      barChartModifiedChildrens: modifiedChildren,
      totalBars,
      dataColorMapping,
    };
  }, [children, themeColors]);

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'bar', dataColorMapping }}>
      <BaseBox
        {...metaAttribute({ name: 'bar-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        <BarChartContext.Provider
          value={{
            layout,
            activeIndex,
            colorTheme,
            totalBars,
          }}
        >
          <RechartsResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              barSize={BAR_SIZE}
              barGap={DISTANCE_BETWEEN_BARS}
              barCategoryGap={DISTANCE_BETWEEN_CATEGORY_BARS}
              onMouseMove={(state) => {
                setActiveIndex(state?.activeIndex ? Number(state?.activeIndex) : undefined);
              }}
              layout={layout}
              data={data}
            >
              {barChartModifiedChildrens}
            </RechartsBarChart>
          </RechartsResponsiveContainer>
        </BarChartContext.Provider>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartBarWrapper, ChartBar };
export type { ChartBarProps, ChartBarWrapperProps };
