import React, { useState, useMemo, useId } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
  Customized as RechartsCustomized,
} from 'recharts';
import { getHighestColorInRange, useChartsColorTheme, assignDataColorMapping } from '../utils';
import { NULL_BRIDGE_DASHARRAY } from '../nullBridgeUtils';
import { useNullBridges } from '../useNullBridges';
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
  _gradientNamespace,
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

  // When connectNulls is true and the style is 'solid' (default), Recharts' built-in
  // connectNulls fills and strokes across nulls — preserving backward compatibility.
  // Only the 'dashed' style gaps the area and draws a separate dashed bridge line.
  const shouldConnectNulls = connectNulls && connectNullsStyle !== 'dashed';

  return (
    <RechartsArea
      {...props}
      fill={`url(#color-${_gradientNamespace}-${_index}-${dataKey})`}
      dataKey={dataKey}
      name={name}
      stroke={colorToken}
      fillOpacity={0.5}
      type={type}
      connectNulls={shouldConnectNulls}
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

  // Ordered ChartArea children (matching Recharts' render order) and which of them need a
  // dashed bridge line. Only 'dashed' bridges need a separate overlay path — 'solid' bridges
  // are handled by Recharts' built-in connectNulls on the area itself (backward compatible).
  const chartAreaOrder = useMemo(() => {
    const areas: Array<{ dataKey: string; bridge: 'none' | 'dashed' }> = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && getComponentId(child) === componentIds.ChartArea) {
        const childProps = child.props as ChartAreaProps;
        const dataKey = childProps.dataKey as string;
        if (dataKey) {
          const bridge: 'none' | 'dashed' =
            childProps.connectNulls === true && childProps.connectNullsStyle === 'dashed'
              ? 'dashed'
              : 'none';
          areas.push({ dataKey, bridge });
        }
      }
    });
    return areas;
  }, [children]);

  const hasBridge = chartAreaOrder.some((area) => area.bridge === 'dashed');

  /**
   * Bridges are drawn as curved paths derived from Recharts' own rendered geometry: after layout we
   * parse each visible area's top-line pixel anchors from its SVG path and densely sample the
   * monotone spline through them across each interior null run. This matches the flanking line's
   * curve exactly (Recharts v3 doesn't expose the axis scales to <Customized>) while spanning only
   * the no-data stretch, so nulls read as "no data" (no fill under the gap, just a bridge line —
   * solid or dashed) rather than a value.
   */
  const { containerRef, bridgePaths } = useNullBridges({
    data,
    chartSeriesOrder: chartAreaOrder,
    hasBridge,
    selectedDataKeys,
    curveSelector: '.recharts-area-curve',
  });

  const renderNullBridges = (): React.ReactElement | null => {
    if (bridgePaths.length === 0) return null;
    return (
      <g className="blade-null-bridge-layer">
        {bridgePaths.map(({ id, dataKey, d, stroke }) => {
          const isHidden = selectedDataKeys ? !selectedDataKeys.includes(dataKey) : false;
          if (isHidden) return null;
          return (
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
          );
        })}
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
              {hasBridge ? <RechartsCustomized component={renderNullBridges} /> : null}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
