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
import {
  componentId as commonComponentIds,
  REFERENCE_BAND_DEFAULT_NAME,
} from '../CommonChartComponents/tokens';
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
  BAR_RANGE_DEFAULT_NAME,
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
      hasReferenceBand,
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
    // The band layer finds this series' bars by className, and the bound series by their own
    // classNames. All three are derived from the dataKey, which recharts types as
    // `string | number | ((obj) => any)` — only a string can be sanitized into a className, so a
    // numeric or function dataKey opts out of the band rather than throwing on `.replace`.
    const seriesKey = typeof dataKey === 'string' ? dataKey : null;
    const hasRange = Boolean(seriesKey && rangeLowerDataKey && rangeUpperDataKey);

    const updateHoveredBar = useCallback(
      (bar: { dataKey: string; index: number } | null) => {
        if (!hide) {
          setHoveredBar?.(bar);
        }
      },
      [hide, setHoveredBar],
    );

    // Per-series hover only means something when there is a band to reveal. Left ungated it would
    // change the hover behaviour of every bar chart already in production, and re-render the
    // wrapper on every bar hover, for no visible benefit.
    const isSeriesHoverEnabled = Boolean(hasReferenceBand && seriesKey);

    const isOtherSeriesHovered =
      isSeriesHoverEnabled && typeof hoveredDataKey === 'string' && hoveredDataKey !== seriesKey;

    const boundSeries = hasRange ? (
      <>
        <RechartsLine
          key={`band-${seriesKey}-lower`}
          className={perLineBandClass(seriesKey!, 'lower')}
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
          key={`band-${seriesKey}-upper`}
          className={perLineBandClass(seriesKey!, 'upper')}
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
          className={seriesKey ? barSeriesClass(seriesKey) : undefined}
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
          onMouseEnter={
            isSeriesHoverEnabled
              ? (_data: unknown, barIndex: number) =>
                  updateHoveredBar({ dataKey: seriesKey!, index: barIndex })
              : undefined
          }
          onMouseLeave={isSeriesHoverEnabled ? () => updateHoveredBar(null) : undefined}
          shape={(props: unknown) => {
            const { fill, x, y, width, height, index: barIndex } = props as RechartsShapeProps;
            // Two independent fades meet here: which category is hovered (activeIndex) and which
            // series is hovered (hoveredDataKey).
            //
            // They are combined with `min`, not multiplied. A bar is either de-emphasised or it
            // isn't — being de-emphasised on both axes at once shouldn't compound, which would put
            // it at 0.2 * 0.2 = 0.04 and render it effectively invisible.
            const categoryOpacity = isNumber(activeIndex)
              ? barIndex === activeIndex
                ? 1
                : NON_HOVERED_SERIES_OPACITY
              : 1;
            const seriesOpacity = isOtherSeriesHovered ? NON_HOVERED_SERIES_OPACITY : 1;
            const fillOpacity = Math.min(categoryOpacity, seriesOpacity);
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

  const { hasReferenceBand, renderReferenceBands, referenceBandLegendInfos } = useBarReferenceBand({
    children,
    data,
    containerRef,
    dataColorMapping,
    hoveredDataKey,
    hoveredBarIndex,
    selectedDataKeys,
    layout,
  });

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
          // Defaulted here, not left to the tooltip's own fallback: the legend reads this name
          // through the band layer and the tooltip reads it through `rangeMap`, so an undefined
          // name would leave the same band labelled differently in the two places.
          rangeName: props.name ?? REFERENCE_BAND_DEFAULT_NAME,
        };
        return;
      }

      if (id === componentIds.chartBar) {
        const props = child.props as ChartBarProps;
        // Keyed by dataKey, so only a string one can take part — see `seriesKey` in _ChartBar.
        const dataKey = typeof props.dataKey === 'string' ? props.dataKey : null;
        if (!dataKey) return;
        barDataKeys.push(dataKey);
        if (props.rangeLowerDataKey && props.rangeUpperDataKey) {
          map[dataKey] = {
            rangeLowerDataKey: props.rangeLowerDataKey,
            rangeUpperDataKey: props.rangeUpperDataKey,
            // Same default the legend applies — see the standalone band above.
            rangeName: props.rangeName ?? BAR_RANGE_DEFAULT_NAME,
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
      hasReferenceBand,
    }),
    [layout, activeIndex, colorTheme, totalBars, hoveredDataKey, hoveredBarIndex, hasReferenceBand],
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
        ref={containerRef}
        {...metaAttribute({ name: 'bar-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        <BarChartContext.Provider value={barChartContextValue}>
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
        </BarChartContext.Provider>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export { ChartBarWrapper, ChartBar };
export type { ChartBarProps, ChartBarWrapperProps };
