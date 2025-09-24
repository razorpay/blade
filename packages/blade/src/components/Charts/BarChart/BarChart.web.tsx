import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
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
  MOTION_TRIGGERS,
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
  const controls = useAnimation();
  const [animationState, setAnimationState] = useState('idle');

  useEffect(() => {
    if (props.animationTrigger === MOTION_TRIGGERS.FADE_IN) {
      setAnimationState('fadingIn');
      void controls.start({
        fillOpacity: props.fillOpacity,
        transition: {
          duration: 0.01,
          ease: 'easeIn',
          delay: 0,
          onComplete: () => {
            setAnimationState('fadedIn');
            if (props.onFadeInComplete) props.onFadeInComplete();
          },
        },
      });
    } else if (props.animationTrigger === MOTION_TRIGGERS.FADE_OUT) {
      setAnimationState('fadingOut');
      void controls.start({
        fillOpacity: 0.2,
        transition: {
          duration: 0.3,
          ease: 'easeIn',
          onComplete: () => {
            setAnimationState('fadedOut');
            if (props.onFadeOutComplete) props.onFadeOutComplete();
          },
        },
      });
    } else if (props.animationTrigger === MOTION_TRIGGERS.RESET) {
      setAnimationState('resetting');
      void controls.start({
        fillOpacity: 1,
        transition: {
          duration: 0.2,
          ease: 'easeOut',
          onComplete: () => {
            setAnimationState('idle');
            if (props.onResetComplete) props.onResetComplete();
          },
        },
      });
    }
  }, [props.animationTrigger, props.fillOpacity, controls, props]);

  return (
    <LazyMotion features={domAnimation}>
      <m.rect
        {...props}
        animate={controls}
        initial={{
          fillOpacity: props.initialOpacity,
        }}
        style={{
          cursor: 'pointer',
          opacity: animationState === 'fadingOut' ? 0.8 : 1,
        }}
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
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animationEasing="linear"
      dataKey={dataKey}
      name={name}
      shape={(props: unknown) => {
        const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
        const fillOpacity = isNumber(activeIndex) ? (barIndex === activeIndex ? 1 : 0.2) : 1;
        const gap = DISTANCE_BETWEEN_STACKED_BARS;
        const isVertical = orientation === 'vertical';

        const getAnimationTrigger = (): string => {
          if (!isNumber(activeIndex)) return MOTION_TRIGGERS.RESET;
          if (barIndex === activeIndex) return MOTION_TRIGGERS.FADE_IN;
          return MOTION_TRIGGERS.FADE_OUT;
        };

        const getInitialOpacity = (): number => {
          const animationTrigger = getAnimationTrigger();
          if (isContainerHovered) {
            if (animationTrigger === MOTION_TRIGGERS.FADE_IN && isFirstActiveIndex) return 1;
            if (animationTrigger === MOTION_TRIGGERS.FADE_IN && !isFirstActiveIndex) return 0.2;
            if (animationTrigger === MOTION_TRIGGERS.FADE_OUT && isFirstActiveIndex) return 1;
            if (animationTrigger === MOTION_TRIGGERS.FADE_OUT && !isFirstActiveIndex) return 0.2;
            if (animationTrigger === MOTION_TRIGGERS.RESET && isHovered) return 0.2;
          }
          if (shouldPlayResetAnimation) {
            if (animationTrigger === MOTION_TRIGGERS.RESET) return 0.2;
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
              animationTrigger={getAnimationTrigger()}
              initialOpacity={getInitialOpacity()}
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
            animationTrigger={getAnimationTrigger()}
            initialOpacity={getInitialOpacity()}
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
  const [shouldPlayResetAnimation, setShouldPlayResetAnimation] = useState(false);
  const prevActiveIndex = useRef<number | undefined>(undefined);

  // Check if this is the first active index
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
