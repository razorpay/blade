import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useChartsColorTheme } from '../utils';
import { BarChartContext, useBarChartContext } from './BarChartContext';
import type { ChartBarProps, ChartBarWrapperProps, MotionRectProps } from './types';
import {
  BAR_CHART_CORNER_RADIUS,
  DISTANCE_BETWEEN_STACKED_BARS,
  componentIds,
  BAR_SIZE,
  DISTANCE_BETWEEN_BARS,
  DISTANCE_BETWEEN_CATEGORY_BARS,
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

const MotionRectangle = (props: MotionRectProps): React.ReactElement => {
  const { fillOpacity, barIndex, initialOpacity, ...restProps } = props;
  return (
    <LazyMotion features={domAnimation}>
      <m.rect
        layoutId={`bar-${barIndex}`}
        initial={{ fillOpacity: initialOpacity }}
        animate={{ fillOpacity }}
        transition={{
          fillOpacity: { duration: 0.3, ease: 'linear' },
          layout: { duration: 0.4 },
        }}
        {...restProps}
      />
    </LazyMotion>
  );
};

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
  ...rest
}) => {
  const { theme } = useTheme();
  const {
    orientation,
    activeIndex,
    colorTheme: _colorTheme,
    totalBars,
    isFirstActiveIndex,
    shouldPlayResetAnimation,
  } = useBarChartContext();
  const defaultColorArray = useChartsColorTheme({ colorTheme: _colorTheme ?? 'default' });
  const isContainerHovered = isNumber(activeIndex);
  const fill = color ? getIn(theme.colors, color) : defaultColorArray[_index];
  const isStacked = rest.stackId !== undefined;
  const animationBegin =
    isStacked && !isContainerHovered
      ? (theme.motion.duration.gentle / totalBars) * _index
      : theme.motion.duration.gentle;
  const animationDuration =
    isStacked && !isContainerHovered
      ? theme.motion.duration.gentle / totalBars
      : theme.motion.duration.gentle;

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
      shape={(props: unknown) => {
        const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
        const fillOpacity = isNumber(activeIndex) ? (barIndex === activeIndex ? 1 : 0.2) : 1;
        const gap = DISTANCE_BETWEEN_STACKED_BARS;
        const isVertical = orientation === 'vertical';

        const getInitialOpacity = (): number => {
          // If container is hovered and it is the first active index (then no need to animate. since the hovered bar will have opacity 1)
          // for non hovered bar opactiy will go from 1 to 0.2
          if (isContainerHovered && isFirstActiveIndex) {
            return 1;
          }
          // Now if any bar is changing opactiy that means user is hovering over the bar. it's opacity should go from 0.2 to 1.
          if (isContainerHovered && !isFirstActiveIndex) {
            return 0.2;
          }
          // In case of reset. the opacity should go from 0.2 to 1.
          if (shouldPlayResetAnimation) {
            return 0.2;
          }

          return 1;
        };

        if (isVertical) {
          return (
            <MotionRectangle
              fill={fill}
              x={x + gap / 2}
              y={y}
              width={width - gap}
              height={height}
              rx={BAR_CHART_CORNER_RADIUS}
              ry={BAR_CHART_CORNER_RADIUS}
              fillOpacity={fillOpacity}
              initialOpacity={getInitialOpacity()}
              barIndex={barIndex}
            />
          );
        }
        return (
          <MotionRectangle
            fill={fill}
            x={x}
            y={y + gap / 2}
            width={width}
            height={height > gap ? height - gap : 0}
            rx={BAR_CHART_CORNER_RADIUS}
            ry={BAR_CHART_CORNER_RADIUS}
            fillOpacity={fillOpacity}
            initialOpacity={getInitialOpacity()}
            barIndex={barIndex}
          />
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
  colorTheme = 'default',
  orientation = 'horizontal',
  testID,
  data = [],
  ...restProps
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  // Whether to play the reset animation. We play reset animation when user is hovering over the bar chart and then moves the mouse away.
  const [shouldPlayResetAnimation, setShouldPlayResetAnimation] = useState(false);
  const prevActiveIndex = useRef<number | undefined>(undefined);

  // Check if this is the first active index (user is hovering over bar chart for the first time)
  // We need this to determine the initial opacity of the bar.
  const isFirstActiveIndex = isNumber(activeIndex) && prevActiveIndex.current === undefined;

  // Update previous activeIndex
  useEffect(() => {
    prevActiveIndex.current = activeIndex;
  }, [activeIndex]);

  const { barChartModifiedChildrens, totalBars } = React.useMemo(() => {
    let BarChartIndex = 0;
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.chartBar) {
        return React.cloneElement(child, {
          _index: BarChartIndex++,
        } as Partial<ChartBarProps>);
      }
      return child;
    });

    return {
      barChartModifiedChildrens: modifiedChildren,
      totalBars: BarChartIndex,
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
          orientation,
          activeIndex,
          isFirstActiveIndex,
          shouldPlayResetAnimation,
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
              if (isNumber(prevActiveIndex.current) && !state?.activeIndex) {
                setShouldPlayResetAnimation(true);
                setTimeout(() => {
                  setShouldPlayResetAnimation(false);
                }, 1000);
              }
              setActiveIndex(state?.activeIndex ? Number(state?.activeIndex) : undefined);
            }}
            layout={orientation}
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
