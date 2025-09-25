import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import { BarChartContext, useBarChartContext } from './BarChartContext';
import type { ChartBarProps, ChartBarWrapperProps } from './types';
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
  const { layout, activeIndex, colorTheme: _colorTheme, totalBars } = useBarChartContext();
  const defaultColorArray = useChartsColorTheme({ colorTheme: _colorTheme ?? 'default' });
  const fill = color ? getIn(theme.colors, color) : defaultColorArray[_index];
  const isStacked = rest.stackId !== undefined;
  const animationBegin = isStacked
    ? (theme.motion.duration.gentle / totalBars) * _index
    : theme.motion.duration.gentle;
  const animationDuration = isStacked
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
        const isVertical = layout === 'vertical';

        if (isVertical) {
          return (
            <rect
              fill={fill}
              x={x + gap / 2}
              y={y}
              width={width - gap}
              height={height}
              rx={BAR_CHART_CORNER_RADIUS}
              ry={BAR_CHART_CORNER_RADIUS}
              fillOpacity={fillOpacity}
            />
          );
        }
        return (
          <rect
            fill={fill}
            x={x}
            y={y + gap / 2}
            width={width}
            height={height > gap ? height - gap : 0}
            rx={BAR_CHART_CORNER_RADIUS}
            ry={BAR_CHART_CORNER_RADIUS}
            fillOpacity={fillOpacity}
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
  colorTheme = 'categorical',
  layout = 'horizontal',
  testID,
  data = [],
  ...restProps
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

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
