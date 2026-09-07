import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  Line as RechartsLine,
  Customized as RechartsCustomized,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme, getHighestColorInRange, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type {
  DataColorMapping,
  SecondaryLabelMap,
  ChartXAxisProps,
} from '../CommonChartComponents';
import type { RangeMap, ChartReferenceBandProps } from '../CommonChartComponents/types';
import { componentId as commonComponentIds } from '../CommonChartComponents/tokens';
import { perLineBandClass } from '../utils/referenceBandUtils';
import { BarChartContext, useBarChartContext } from './BarChartContext';
import { useBarReferenceBand } from './useBarReferenceBand';
import type { ChartBarProps, ChartBarWrapperProps } from './types';
import {
  DISTANCE_BETWEEN_STACKED_BARS,
  componentIds,
  BAR_SIZE,
  DISTANCE_BETWEEN_BARS,
  DISTANCE_BETWEEN_CATEGORY_BARS,
  NON_HOVERED_SERIES_OPACITY,
  barSeriesClass,
} from './tokens';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import isNumber from '~utils/lodashButBetter/isNumber';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';

export type RechartsShapeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  index: number;
};

// Bar component - resolves Blade color tokens to actual colors
const _ChartBar: React.FC<ChartBarProps> = React.memo(
  ({
    color,
    name,
    dataKey,
    activeBar = false,
    label = false,
    showLegend = true,
    hide,
    _index = 0,
    // `rangeLowerDataKey` / `rangeUpperDataKey` drive this bar's invisible bound series below. The
    // remaining range-* props are consumed by ChartBarWrapper's band layer / tooltip / legend; they
    // must be destructured out here so they don't leak onto the underlying Recharts <Bar>.
    rangeLowerDataKey,
    rangeUpperDataKey,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    rangeName,
    rangeColor,
    showRangeLegend,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  }) => {
    const { theme } = useTheme();
    const {
      layout,
      activeIndex,
      colorTheme: _colorTheme,
      totalBars,
      hoveredDataKey,
      setHoveredBar,
    } = useBarChartContext();
    const defaultColorArray = useChartsColorTheme({
      colorTheme: _colorTheme,
      chartName: 'bar',
      chartDataIndicators: totalBars,
    });
    const fill = getIn(theme.colors, color ?? defaultColorArray[_index]);
    const strokeFill = getIn(
      theme.colors,
      getHighestColorInRange({
        colorToken: color ?? defaultColorArray[_index],
        followIntensityMapping: Boolean(color),
      }),
    );

    const animationBegin = theme.motion.duration.gentle;
    const animationDuration = theme.motion.duration.gentle;

    /**
     * We need to control the animation of the bar.
     * Recharts tries to animate bar when tooltip is hovered. we don't need that.
     * So we need to control the animation of the bar.
     * we currently need it for entry , exit and when a bar is hidden only.
     */

    const shouldAnimatedBar = useRef(true);

    useEffect(() => {
      shouldAnimatedBar.current = true;
    }, [hide]);

    // When this bar declares a range, render two invisible bound series so Recharts computes their
    // geometry and folds the range into the y-domain (otherwise a range taller than the bars would
    // be clipped). ChartBarWrapper's band layer reads these by className and fills between them.
    //
    // These are <Line>s rather than <Bar>s deliberately: Recharts allocates a slot per bar series
    // inside each category group, so two extra invisible bars would shrink and shift the real ones.
    const hasRange = Boolean(rangeLowerDataKey && rangeUpperDataKey);

    const updateHoveredBar = useCallback(
      (bar: { dataKey: string; index: number } | null) => {
        if (!hide) {
          setHoveredBar?.(bar);
        }
      },
      [hide, setHoveredBar],
    );

    const isOtherSeriesHovered =
      typeof hoveredDataKey === 'string' && hoveredDataKey !== (dataKey as string);

    const boundSeries = hasRange ? (
      <>
        <RechartsLine
          key={`band-${dataKey}-lower`}
          className={perLineBandClass(dataKey as string, 'lower')}
          dataKey={rangeLowerDataKey}
          stroke="transparent"
          strokeWidth={1}
          dot={false}
          activeDot={false}
          connectNulls
          legendType="none"
          tooltipType="none"
          isAnimationActive={false}
          hide={hide}
        />
        <RechartsLine
          key={`band-${dataKey}-upper`}
          className={perLineBandClass(dataKey as string, 'upper')}
          dataKey={rangeUpperDataKey}
          stroke="transparent"
          strokeWidth={1}
          dot={false}
          activeDot={false}
          connectNulls
          legendType="none"
          tooltipType="none"
          isAnimationActive={false}
          hide={hide}
        />
      </>
    ) : null;

    return (
      <>
        {boundSeries}
        <RechartsBar
          {...rest}
          className={barSeriesClass(dataKey as string)}
          fill={fill}
          legendType={showLegend ? 'rect' : 'none'}
          activeBar={activeBar}
          label={label}
          animationBegin={animationBegin}
          animationDuration={animationDuration}
          animationEasing="linear"
          dataKey={dataKey}
          name={name}
          key={`${dataKey}-${_index}-${name}`}
          hide={hide}
          isAnimationActive={shouldAnimatedBar.current}
          onAnimationStart={() => {
            shouldAnimatedBar.current = true;
          }}
          onAnimationEnd={() => {
            shouldAnimatedBar.current = false;
          }}
          onMouseEnter={(_data: unknown, barIndex: number) =>
            updateHoveredBar({ dataKey: dataKey as string, index: barIndex })
          }
          onMouseLeave={() => updateHoveredBar(null)}
          shape={(props: unknown) => {
            const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
            // Two independent fades compose here: which category is hovered (activeIndex) and which
            // series is hovered (hoveredDataKey).
            const categoryOpacity = isNumber(activeIndex)
              ? barIndex === activeIndex
                ? 1
                : NON_HOVERED_SERIES_OPACITY
              : 1;
            const fillOpacity =
              categoryOpacity * (isOtherSeriesHovered ? NON_HOVERED_SERIES_OPACITY : 1);
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
                  <rect
                    fill={strokeFill}
                    x={x + gap / 1.5 + (width - gap) - 1.5} // Position at the right end
                    y={y}
                    width={width > gap ? 1.5 : 0}
                    height={height}
                    fillOpacity={fillOpacity}
                  />
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
                <rect
                  fill={strokeFill}
                  x={x}
                  y={y + gap / 1.5}
                  width={width}
                  height={height > gap ? 1.5 : 0}
                  fillOpacity={fillOpacity}
                />
              </>
            );
          }}
        />
      </>
    );
  },
);

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

  // The hovered bar: its series (fades the others, decides which reference band is revealed) and
  // its category index (positions the shaded column).
  const [hoveredBar, setHoveredBar] = useState<{ dataKey: string; index: number } | null>(null);
  const hoveredDataKey = hoveredBar?.dataKey ?? null;
  const hoveredBarIndex = hoveredBar?.index ?? null;

  // State to track which bars are currently selected (visible)
  const [selectedDataKeys, setSelectedDataKeys] = useState<string[] | undefined>(undefined);

  // The band layer measures the rendered chart, so the container needs a ref.
  const containerRef = useRef<HTMLDivElement>(null);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'bar',
  });

  const {
    barChartModifiedChildrens,
    totalBars,
    dataColorMapping,
    secondaryDataKey,
  } = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};

    // Count ChartBar components
    const totalBars = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.chartBar,
    ).length;

    // Find ChartXAxis and extract secondaryDataKey
    let secondaryDataKey: string | undefined;
    for (const child of childrenArray) {
      if (React.isValidElement(child) && getComponentId(child) === commonComponentIds.chartXAxis) {
        secondaryDataKey = (child.props as ChartXAxisProps)?.secondaryDataKey;
        break;
      }
    }

    let BarChartIndex = 0;
    /**
     * We check to check child of ChartBarWrapper. if they have any custom color we store that.
     * We need these mapping because colors of tooltip & legend is determine based on this
     *  recharts do provide a color but it is hex code and we need blade color token .
     */
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.chartBar) {
        const childColor = child?.props?.color;
        const dataKey = (child?.props as ChartBarProps)?.dataKey as string;
        if (dataKey) {
          //  assign  colors to the dataColorMapping, if no color is assigned  we assign color in `assignDataColorMapping`
          dataColorMapping[dataKey] = {
            colorToken: childColor,
            isCustomColor: Boolean(childColor),
          };
        }
        // Pass hide prop based on whether this bar's dataKey is NOT in selectedDataKeys
        // If selectedDataKeys is undefined, show all bars (default behavior)
        return React.cloneElement(child, {
          _index: BarChartIndex++,
          hide: selectedDataKeys ? !selectedDataKeys.includes(dataKey) : false,
        } as Partial<ChartBarProps>);
      }
      return child;
    });
    assignDataColorMapping(dataColorMapping, themeColors);

    return {
      barChartModifiedChildrens: modifiedChildren,
      totalBars,
      dataColorMapping,
      secondaryDataKey,
    };
  }, [children, themeColors, selectedDataKeys]);

  // Build secondary label map internally from ChartXAxis's secondaryDataKey prop
  const secondaryLabelMap = React.useMemo<SecondaryLabelMap | undefined>(() => {
    if (!secondaryDataKey || !data) return undefined;
    const map: SecondaryLabelMap = {};
    data.forEach((item, index) => {
      map[index] = item[secondaryDataKey] as string | number | undefined;
    });
    return map;
  }, [data, secondaryDataKey]);

  const { hasReferenceBand, renderReferenceBands, referenceBandLegendInfos } = useBarReferenceBand(
    children,
    data,
    containerRef,
    dataColorMapping,
    hoveredDataKey,
    hoveredBarIndex,
    selectedDataKeys,
  );

  // Map of bar dataKey -> its range keys, so the shared tooltip can show the range alongside the
  // bar's own value. A bar's own `range*` props win; otherwise a standalone <ChartReferenceBand>
  // applies, since that band is the comparison range for every bar in the chart.
  const rangeMap = useMemo<RangeMap>(() => {
    const map: RangeMap = {};
    let chartLevelRange: RangeMap[string] | undefined;
    const barDataKeys: string[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const id = getComponentId(child);

      if (id === commonComponentIds.chartReferenceBand) {
        const props = child.props as ChartReferenceBandProps;
        chartLevelRange = {
          rangeLowerDataKey: props.lowerDataKey,
          rangeUpperDataKey: props.upperDataKey,
          rangeName: props.name,
        };
        return;
      }

      if (id === componentIds.chartBar) {
        const props = child.props as ChartBarProps;
        const dataKey = props.dataKey as string;
        if (!dataKey) return;
        barDataKeys.push(dataKey);
        if (props.rangeLowerDataKey && props.rangeUpperDataKey) {
          map[dataKey] = {
            rangeLowerDataKey: props.rangeLowerDataKey,
            rangeUpperDataKey: props.rangeUpperDataKey,
            rangeName: props.rangeName,
          };
        }
      }
    });

    if (chartLevelRange) {
      barDataKeys.forEach((dataKey) => {
        if (!map[dataKey]) map[dataKey] = chartLevelRange!;
      });
    }

    return map;
  }, [children]);

  const barChartContextValue = useMemo(
    () => ({
      layout,
      activeIndex,
      colorTheme,
      totalBars,
      hoveredDataKey,
      hoveredBarIndex,
      setHoveredBar,
    }),
    [layout, activeIndex, colorTheme, totalBars, hoveredDataKey, hoveredBarIndex],
  );

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'bar',
        dataColorMapping,
        secondaryLabelMap,
        dataLength: data?.length,
        selectedDataKeys,
        setSelectedDataKeys,
        referenceBands: referenceBandLegendInfos,
        rangeMap,
      }}
    >
      <BaseBox
        {...metaAttribute({ name: 'bar-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        <BarChartContext.Provider value={barChartContextValue}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                barSize={BAR_SIZE}
                barGap={DISTANCE_BETWEEN_BARS}
                barCategoryGap={DISTANCE_BETWEEN_CATEGORY_BARS}
                onMouseMove={(state) => {
                  setActiveIndex(state?.activeIndex ? Number(state?.activeIndex) : undefined);
                }}
                onMouseLeave={() => {
                  setActiveIndex(undefined);
                  setHoveredBar(null);
                }}
                layout={layout}
                data={data}
              >
                {/* Painted first so the shaded band sits behind the bars. */}
                {hasReferenceBand ? <RechartsCustomized component={renderReferenceBands} /> : null}
                {barChartModifiedChildrens}
              </RechartsBarChart>
            </RechartsResponsiveContainer>
          </div>
        </BarChartContext.Provider>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartBarWrapper, ChartBar };
export type { ChartBarProps, ChartBarWrapperProps };
