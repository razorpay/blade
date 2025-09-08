import React, { useState } from 'react';
import type { ComponentProps } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import { BarChartContext, useBarChartContext } from './BarChartContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';
import getIn from '~utils/lodashButBetter/get';
import type {
  ChartColorCategories,
  ChartCategoricalEmphasis,
  ChartSequentialEmphasis,
} from '~tokens/theme/theme';
import isNumber from '~utils/lodashButBetter/isNumber';
import { throwBladeError } from '~utils/logger';

// Color token that allows both categorical and sequential chart colors
export type BladeColorToken =
  | `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`
  | `chart.background.sequential.${Exclude<
      ChartColorCategories,
      'gray'
    >}.${keyof ChartSequentialEmphasis}`;

export interface BarProps
  extends Omit<
    ComponentProps<typeof RechartsBar>,
    'fill' | 'dataKey' | 'name' | 'label' | 'activeBar'
  > {
  dataKey: string;
  name?: string; // default to dataKey
  color?: BladeColorToken;
  stackId?: string;
  activeBar?: React.ReactElement | boolean;
  label?: React.ReactElement | boolean;
  /*
   * @private
   */
  _index?: number;
}

export type BarChartProps = Omit<ComponentProps<typeof RechartsBarChart>, 'margin'> & {
  children?: React.ReactNode;
  colorTheme?: 'default' | 'informational';
};

const DEFAULT_MARGIN = { top: 16, right: 16, bottom: 16, left: 16 };
const MAX_BARS = 10;

export type RechartsShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  index: number;
};

// Arbitrary sequential limit per palette (can be tuned later with design)
const BAR_CHART_CORNER_RADIUS = 2;
const DISTANCE_BETWEEN_STACKED_BARS = 2;

// Bar component - resolves Blade color tokens to actual colors
export const Bar: React.FC<BarProps> = ({
  color,
  name,
  dataKey,
  activeBar = false,
  label = false,
  _index = 0,
  ...rest
}) => {
  const { theme } = useTheme();
  const { layout, activeIndex, colorTheme, totalBars } = useBarChartContext();
  const defaultColorArray = useChartsColorTheme({ colorTheme });
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
      dataKey={dataKey}
      name={name ?? dataKey}
      fill={fill}
      legendType="rect"
      activeBar={activeBar}
      label={label}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      // https://github.com/recharts/recharts/issues/2244#issuecomment-2288572842
      shape={(props: unknown) => {
        const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
        const fillOpacity = isNumber(activeIndex) ? (barIndex === activeIndex ? 1 : 0.4) : 1;
        const gap = DISTANCE_BETWEEN_STACKED_BARS;
        // Check if this is a vertical layout (bars going up/down)
        const isVertical = layout === 'vertical';

        if (isVertical) {
          // For vertical bars: x and y stay the same, but width/height are swapped
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
            height={height - gap}
            rx={BAR_CHART_CORNER_RADIUS}
            ry={BAR_CHART_CORNER_RADIUS}
            fillOpacity={fillOpacity}
          />
        );
      }}
    />
  );
};

// BarChart wrapper with default margin, auto-color assignment, and max bars guard
export const BarChart: React.FC<BarChartProps> = ({
  children,
  colorTheme = 'default',
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const { barChartModifiedChildrens, totalBars } = React.useMemo(() => {
    let BarChartIndex = 0;
    const modifiedChildren = React.Children.map(children, (child) => {
      if (__DEV__ && BarChartIndex >= MAX_BARS) {
        throwBladeError({
          message: `Too many bars configured. Maximum allowed is ${MAX_BARS}.`,
          moduleName: 'BarChart',
        });
      }
      if (React.isValidElement(child) && child.type === Bar) {
        return React.cloneElement(child, {
          _index: BarChartIndex++,
        } as Partial<BarProps>);
      }
      return child;
    });

    return {
      barChartModifiedChildrens: modifiedChildren,
      totalBars: BarChartIndex,
    };
  }, [children]);
  return (
    <BaseBox {...metaAttribute({ name: 'bar-chart' })} width="100%" height="100%">
      <BarChartContext.Provider
        value={{ layout: props.layout, activeIndex, colorTheme, totalBars }}
      >
        <RechartsResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            {...props}
            margin={DEFAULT_MARGIN}
            barSize={49}
            barGap={2}
            barCategoryGap={2}
            onMouseMove={(state) => {
              setActiveIndex(state?.activeIndex ? Number(state?.activeIndex) : undefined);
            }}
          >
            {barChartModifiedChildrens}
          </RechartsBarChart>
        </RechartsResponsiveContainer>
      </BarChartContext.Provider>
    </BaseBox>
  );
};
