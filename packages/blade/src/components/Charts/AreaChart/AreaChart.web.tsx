import React, { useState, useMemo, useRef, useLayoutEffect, useId } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
  Customized as RechartsCustomized,
} from 'recharts';
import { getHighestColorInRange, useChartsColorTheme, assignDataColorMapping } from '../utils';
import {
  getDefinedNumericPoints,
  getInteriorGaps,
  parsePathAnchors,
  buildBridgePathData,
} from '../LineChart/nullBridgeUtils';
import type {
  DataColorMapping,
  SecondaryLabelMap,
  ChartXAxisProps,
} from '../CommonChartComponents';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import { componentId as commonComponentIds } from '../CommonChartComponents/tokens';
import type { ChartAreaProps, ChartAreaWrapperProps, ChartColorGradientProps } from './types';
import { componentIds } from './componentIds';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';

// Dash pattern used for the line drawn across null points on a dashed bridge.
const NULL_BRIDGE_DASHARRAY = '5 5';

const Area: React.FC<ChartAreaProps> = ({
  color,
  type = 'monotone',
  connectNulls = false,
  connectNullsStyle = 'solid',
  showLegend = true,
  stackId = 1,
  dot = false,
  activeDot = true,
  _index,
  _colorTheme,
  _totalAreas,
  _gradientNamespace = '',
  dataKey,
  name,
  hide,
  ...props
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({
    colorTheme: _colorTheme,
    chartName: 'area',
    chartDataIndicators: _totalAreas,
  });
  const colorToken = getIn(
    theme.colors,
    color ? getHighestColorInRange({ colorToken: color }) : themeColors[_index ?? 0],
  );
  const animationBegin = theme.motion.delay.gentle;
  const animationDuration = theme.motion.duration.xgentle;

  // A solid bridge lets Recharts connect the area (fill + stroke) across nulls. A dashed bridge
  // keeps the area gapped (so there's no fill under the no-data stretch) and a separate dashed line
  // is drawn across the gap by NullBridgeLayer in the wrapper.
  const isSolidBridge = connectNulls && connectNullsStyle === 'solid';

  return (
    <RechartsArea
      {...props}
      fill={`url(#color-${_gradientNamespace}-${_index}-${dataKey})`}
      dataKey={dataKey}
      name={name}
      stroke={colorToken}
      fillOpacity={0.5}
      type={type}
      connectNulls={isSolidBridge}
      legendType={showLegend ? 'rect' : 'none'}
      strokeWidth={1.5}
      dot={dot}
      stackId={stackId}
      activeDot={activeDot}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
      hide={hide}
    />
  );
};

const ChartArea = assignWithoutSideEffects(Area, {
  componentId: componentIds.ChartArea,
});

const ChartColorGradient: React.FC<ChartColorGradientProps> = ({
  index,
  color,
  totalAreaChartChildren,
  id,
}) => {
  const { colorScheme, theme } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = useChartsColorTheme({
    colorTheme: 'categorical',
    chartName: 'area',
    chartDataIndicators: totalAreaChartChildren,
  });

  const colorToken = getIn(
    theme.colors,
    getHighestColorInRange({
      colorToken: color ?? themeColors[index],
      followIntensityMapping: true,
    }),
  );
  return (
    <linearGradient id={id} key={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={colorToken} stopOpacity={isDarkMode ? 0.28 : 1} />
      <stop offset="95%" stopColor={colorToken} stopOpacity={isDarkMode ? 0.12 : 0.32} />
    </linearGradient>
  );
};

// Main components
const ChartAreaWrapper: React.FC<ChartAreaWrapperProps & TestID & DataAnalyticsAttribute> = ({
  data,
  children,
  testID,
  colorTheme = 'categorical',
  ...restProps
}) => {
  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'area',
  });

  // Unique per-instance namespace for gradient ids. Without it, multiple AreaCharts on the same
  // page emit gradients with the same id (e.g. `color-0-uv`) and every area's `fill="url(#...)"`
  // resolves to the first one in the document, so all charts share (and can be washed out by) the
  // first chart's fill color. Colons from `useId` are stripped so the id stays `url()`-safe.
  const gradientNamespace = useId().replace(/[^a-zA-Z0-9]/g, '');

  // State to track which areas are currently selected (visible)
  const [selectedDataKeys, setSelectedDataKeys] = useState<string[] | undefined>(undefined);

  const {
    modifiedChildren,
    totalAreaChartChildren,
    dataColorMapping,
    secondaryDataKey,
  } = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const dataColorMapping: DataColorMapping = {};

    // Count ChartArea components
    const totalAreas = childrenArray.filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea,
    ).length;

    // Find ChartXAxis and extract secondaryDataKey
    let secondaryDataKey: string | undefined;
    for (const child of childrenArray) {
      if (React.isValidElement(child) && getComponentId(child) === commonComponentIds.chartXAxis) {
        secondaryDataKey = (child.props as ChartXAxisProps)?.secondaryDataKey;
        break;
      }
    }

    let AreaChartIndex = 0;
    /**
     * We need to check child of ChartAreaWrapper. if they have any custom color we store that.
     * We need these mapping because colors of tooltip & legend is determine based on this
     *  recharts do provide a color but it is hex code and we need blade color token .
     */
    const modifiedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea) {
        const childColor = child?.props?.color;
        const dataKey = (child?.props as ChartAreaProps)?.dataKey as string;
        if (dataKey) {
          //  assign  colors to the dataColorMapping, if no color is assigned  we assign color in `assignDataColorMapping`

          dataColorMapping[dataKey] = {
            colorToken: childColor,
            isCustomColor: Boolean(childColor),
          };
        }
        // Pass hide prop based on whether this area's dataKey is NOT in selectedDataKeys
        // If selectedDataKeys is undefined, show all areas (default behavior)
        return React.cloneElement(child, {
          _index: AreaChartIndex++,
          _colorTheme: colorTheme,
          _totalAreas: totalAreas,
          _gradientNamespace: gradientNamespace,
          hide: selectedDataKeys ? !selectedDataKeys.includes(dataKey) : false,
        } as Partial<ChartAreaProps>);
      }
      return child;
    });

    assignDataColorMapping(dataColorMapping, themeColors);
    return {
      modifiedChildren,
      totalAreaChartChildren: AreaChartIndex,
      dataColorMapping,
      secondaryDataKey,
    };
  }, [children, colorTheme, themeColors, selectedDataKeys, gradientNamespace]);

  // Build secondary label map internally from ChartXAxis's secondaryDataKey prop
  const secondaryLabelMap = React.useMemo<SecondaryLabelMap | undefined>(() => {
    if (!secondaryDataKey || !data) return undefined;
    const map: SecondaryLabelMap = {};
    data.forEach((item, index) => {
      map[index] = item[secondaryDataKey] as string | number | undefined;
    });
    return map;
  }, [data, secondaryDataKey]);

  // Ordered ChartArea children (matching Recharts' render order) and which of them bridge nulls with
  // a dashed line. Used to map each rendered area's top-line curve back to its dataKey.
  const chartAreaOrder = useMemo(() => {
    const areas: Array<{ dataKey: string; isDashedBridge: boolean }> = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea) {
        const childProps = child.props as ChartAreaProps;
        const dataKey = childProps.dataKey as string;
        if (dataKey) {
          areas.push({
            dataKey,
            isDashedBridge:
              childProps.connectNulls === true && childProps.connectNullsStyle === 'dashed',
          });
        }
      }
    });
    return areas;
  }, [children]);

  const hasDashedBridge = chartAreaOrder.some((area) => area.isDashedBridge);

  /**
   * The dashed bridges are drawn as curved paths derived from Recharts' own rendered geometry:
   * after layout we parse each visible area's top-line pixel anchors from its SVG path and densely
   * sample the monotone spline through them across each interior null run. This matches the solid
   * line's curve exactly (Recharts v3 doesn't expose the axis scales to <Customized>) while spanning
   * only the no-data stretch, so nulls read as "no data" (no fill, dashed line) rather than a value.
   */
  const containerRef = useRef<HTMLDivElement>(null);
  const [bridgePaths, setBridgePaths] = useState<Array<{ id: string; d: string; stroke: string }>>(
    [],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !hasDashedBridge) {
      setBridgePaths([]);
      return undefined;
    }

    const computeBridges = (): void => {
      const surface = container.querySelector('svg.recharts-surface');
      if (!surface) return;
      const visibleAreas = chartAreaOrder.filter((area) =>
        selectedDataKeys ? selectedDataKeys.includes(area.dataKey) : true,
      );
      // The top-line stroke of each area. Hidden areas render nothing, so the lists only line up
      // when their counts match.
      const topLineCurves = Array.from(
        surface.querySelectorAll<SVGPathElement>('.recharts-area-curve'),
      ).filter((curve) => {
        const stroke = (curve.getAttribute('stroke') ?? '').toLowerCase();
        return stroke !== '' && stroke !== 'transparent' && stroke !== 'none';
      });
      if (topLineCurves.length !== visibleAreas.length) return;

      const nextPaths: Array<{ id: string; d: string; stroke: string }> = [];
      visibleAreas.forEach((area, position) => {
        if (!area.isDashedBridge) return;
        const curve = topLineCurves[position];
        const stroke = curve.getAttribute('stroke') ?? '';
        const anchors = parsePathAnchors(curve.getAttribute('d') ?? '');
        const { indices } = getDefinedNumericPoints(data, area.dataKey);
        if (anchors.length !== indices.length) return;

        getInteriorGaps(indices).forEach(({ from, to }) => {
          nextPaths.push({
            id: `null-bridge-${area.dataKey}-${indices[from]}`,
            d: buildBridgePathData(anchors, from, to),
            stroke,
          });
        });
      });

      setBridgePaths((previous) => {
        const isSame =
          previous.length === nextPaths.length &&
          previous.every(
            (item, index) =>
              item.id === nextPaths[index].id &&
              item.d === nextPaths[index].d &&
              item.stroke === nextPaths[index].stroke,
          );
        return isSame ? previous : nextPaths;
      });
    };

    computeBridges();

    // The line geometry isn't available synchronously (ResponsiveContainer renders the chart in a
    // later commit) and keeps changing while the area's draw-in animation runs, so we recompute
    // whenever the chart's DOM or the line paths (`d`) mutate, and on resize.
    const cleanups: Array<() => void> = [];
    if (typeof MutationObserver !== 'undefined') {
      const mutationObserver = new MutationObserver(() => computeBridges());
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['d'],
      });
      cleanups.push(() => mutationObserver.disconnect());
    }
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => computeBridges());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [data, chartAreaOrder, hasDashedBridge, selectedDataKeys]);

  const renderNullBridges = (): React.ReactElement | null => {
    if (bridgePaths.length === 0) return null;
    return (
      <g className="blade-null-bridge-layer">
        {bridgePaths.map(({ id, d, stroke }) => (
          <path
            key={id}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeDasharray={NULL_BRIDGE_DASHARRAY}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    );
  };

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'area',
        dataColorMapping,
        secondaryLabelMap,
        dataLength: data?.length,
        selectedDataKeys,
        setSelectedDataKeys,
      }}
    >
      <BaseBox
        {...metaAttribute({ name: 'chart-area-container', testID })}
        {...makeAnalyticsAttribute(restProps)}
        {...restProps}
        width="100%"
        height="100%"
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer>
            <RechartsAreaChart data={data}>
              <defs>
                {Object.keys(dataColorMapping).map((dataKey, index) => (
                  <ChartColorGradient
                    key={`color-${gradientNamespace}-${index}-${dataKey}`}
                    id={`color-${gradientNamespace}-${index}-${dataKey}`}
                    index={index}
                    color={dataColorMapping[dataKey].colorToken}
                    totalAreaChartChildren={totalAreaChartChildren}
                  />
                ))}
              </defs>

              {modifiedChildren}
              {hasDashedBridge ? <RechartsCustomized component={renderNullBridges} /> : null}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
