import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useMotionValue, useMotionValueEvent } from 'framer-motion';
import { useChartsColorTheme, getHighestColorInSequence } from '../utils';
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
    //@ts-expect-error
    getHighestColorInSequence(color ?? defaultColorArray[_index]),
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
  const totalAnimationTime = animationBegin + animationDuration + ANIMATION_TIME_OFFEST * totalBars;

  useEffect(() => {
    const timer = setTimeout(() => {
      animationValue.set(1);
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [totalAnimationTime, animationValue]);

  console.log('animationsComplete', animationsComplete);

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

  const { barChartModifiedChildrens, totalBars } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    // Count ChartBar components
    const totalBars = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.chartBar,
    ).length;

    let BarChartIndex = 0;
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.chartBar) {
        return React.cloneElement(child, {
          _index: BarChartIndex++,
          _totalbars: totalBars,
        } as Partial<ChartBarProps>);
      }
      return child;
    });

    return {
      barChartModifiedChildrens: modifiedChildren,
      totalBars,
    };
  }, [children]);

  return (
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
  );
};

export { ChartBarWrapper, ChartBar };
export type { ChartBarProps, ChartBarWrapperProps };
