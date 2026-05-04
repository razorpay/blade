import React, { useMemo, useState } from 'react';
import { Svg, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { BarChartContext } from './BarChartContext';
import { componentIds, BAR_CHART_CORNER_RADIUS } from './tokens';
import type { ChartBarProps, ChartBarWrapperProps } from './types';
import { useChartsColorTheme, assignDataColorMapping, getHighestColorInRange } from '../utils';
import {
  CommonChartComponentsContext,
  componentId as commonComponentIds,
} from '../CommonChartComponents';
import type { DataColorMapping, ChartXAxisProps, ChartYAxisProps } from '../CommonChartComponents';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const PLOT_PADDING = { top: 16, right: 16, bottom: 32, left: 40 };
const Y_TICK_COUNT = 4;
const LEGEND_HEIGHT = 28;
const LEGEND_DOT_SIZE = 10;
const TICK_FONT_SIZE = 10;
const AXIS_LABEL_FONT_SIZE = 11;
const SECONDARY_LABEL_FONT_SIZE = 9;

type ChildSlots = {
  bars: { dataKey: string; name?: string; color?: string; stackId?: string; hide?: boolean }[];
  hasXAxis: boolean;
  xDataKey?: string;
  xSecondaryDataKey?: string;
  xTickFormatter?: (value: string, index: number) => string;
  xInterval?: number;
  xLabel?: string;
  hasYAxis: boolean;
  yLabel?: string;
  hasLegend: boolean;
  hasGrid: boolean;
};

const readChildSlots = (children: React.ReactNode): ChildSlots => {
  const slots: ChildSlots = {
    bars: [],
    hasXAxis: false,
    hasYAxis: false,
    hasLegend: false,
    hasGrid: false,
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const id = getComponentId(child);
    if (id === componentIds.chartBar) {
      const props = child.props as ChartBarProps;
      slots.bars.push({
        dataKey: props.dataKey as string,
        name: props.name as string | undefined,
        color: props.color,
        stackId: props.stackId as string | undefined,
        hide: props.hide,
      });
    } else if (id === commonComponentIds.chartXAxis) {
      const props = child.props as ChartXAxisProps;
      slots.hasXAxis = true;
      slots.xDataKey = props.dataKey;
      slots.xSecondaryDataKey = props.secondaryDataKey;
      slots.xTickFormatter = props.tickFormatter;
      slots.xInterval = props.interval;
      slots.xLabel = props.label;
    } else if (id === commonComponentIds.chartYAxis) {
      const props = child.props as ChartYAxisProps;
      slots.hasYAxis = true;
      slots.yLabel = props.label;
    } else if (id === commonComponentIds.chartLegend) {
      slots.hasLegend = true;
    } else if (id === commonComponentIds.chartCartesianGrid) {
      slots.hasGrid = true;
    }
  });

  return slots;
};

const niceCeil = (raw: number): number => {
  if (raw <= 0) return 1;
  const exponent = Math.floor(Math.log10(raw));
  const fraction = raw / 10 ** exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * 10 ** exponent;
};

const formatYTick = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  return String(value);
};

const _ChartBar = (_props: ChartBarProps): React.ReactElement | null => {
  return null;
};

/**
 * ChartBar
 *
 * Marker component declaring a bar series inside ChartBarWrapper.
 * On native this component renders nothing on its own — ChartBarWrapper
 * reads its props (`dataKey`, `name`, `color`, `stackId`) and renders the bars.
 */
const ChartBar = assignWithoutSideEffects(_ChartBar, {
  componentId: componentIds.chartBar,
});

const ChartBarWrapper: React.FC<ChartBarWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'categorical',
  layout = 'horizontal',
  data = [],
  testID,
  ...restProps
}) => {
  const { theme } = useTheme();
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  const slots = useMemo(() => readChildSlots(children), [children]);
  const visibleBars = slots.bars.filter((b) => !b.hide);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'bar',
    chartDataIndicators: visibleBars.length,
  });

  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    visibleBars.forEach((bar) => {
      mapping[bar.dataKey] = {
        colorToken: bar.color as DataColorMapping[string]['colorToken'],
        isCustomColor: Boolean(bar.color),
      };
    });
    assignDataColorMapping(mapping, themeColors);
    return mapping;
  }, [visibleBars, themeColors]);

  const secondaryLabelMap = useMemo(() => {
    if (!slots.xSecondaryDataKey || !data?.length) return undefined;
    const map: Record<number, string | number | undefined> = {};
    data.forEach((row, index) => {
      map[index] = row[slots.xSecondaryDataKey as string] as string | number | undefined;
    });
    return map;
  }, [data, slots.xSecondaryDataKey]);

  const stackGroups = useMemo(() => {
    const groupOrder: string[] = [];
    const map = new Map<string, typeof visibleBars>();
    visibleBars.forEach((bar) => {
      const key = bar.stackId ?? `__solo__${bar.dataKey}`;
      if (!map.has(key)) {
        map.set(key, []);
        groupOrder.push(key);
      }
      map.get(key)!.push(bar);
    });
    return groupOrder.map((key) => ({ key, bars: map.get(key)! }));
  }, [visibleBars]);

  const dataMax = useMemo(() => {
    if (!data.length) return 0;
    let max = 0;
    data.forEach((row) => {
      stackGroups.forEach((group) => {
        const sum = group.bars.reduce((acc, bar) => acc + (Number(row[bar.dataKey]) || 0), 0);
        if (sum > max) max = sum;
      });
    });
    return max;
  }, [data, stackGroups]);

  const yMax = niceCeil(dataMax);
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = 0; i <= Y_TICK_COUNT; i++) {
      ticks.push((yMax / Y_TICK_COUNT) * i);
    }
    return ticks;
  }, [yMax]);

  const showAxes = slots.hasXAxis || slots.hasYAxis;
  const padding = showAxes ? PLOT_PADDING : { top: 0, right: 0, bottom: 0, left: 0 };
  const legendH = slots.hasLegend ? LEGEND_HEIGHT : 0;

  const plotWidth = Math.max(0, size.width - padding.left - padding.right);
  const plotHeight = Math.max(0, size.height - padding.top - padding.bottom - legendH);

  const groupCount = data.length;
  const barsPerGroup = stackGroups.length;
  const groupSlot = groupCount > 0 ? plotWidth / groupCount : 0;
  const groupInnerPadding = Math.min(8, groupSlot * 0.2);
  const groupContentWidth = Math.max(0, groupSlot - groupInnerPadding * 2);
  const barWidth = barsPerGroup > 0 ? groupContentWidth / barsPerGroup : 0;

  const xLabelStep = Math.max(1, (slots.xInterval ?? 0) + 1);

  const tickColor = getIn(theme.colors, 'surface.text.gray.muted');
  const axisLineColor = getIn(theme.colors, 'surface.border.gray.muted');
  const gridColor = getIn(theme.colors, 'surface.border.gray.subtle');

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'bar',
        dataColorMapping,
        secondaryLabelMap,
        dataLength: data?.length,
      }}
    >
      <BarChartContext.Provider
        value={{
          layout,
          activeIndex: undefined,
          colorTheme,
          totalBars: visibleBars.length,
        }}
      >
        <BaseBox
          {...metaAttribute({ name: 'bar-chart', testID })}
          {...makeAnalyticsAttribute(restProps)}
          width="100%"
          height="100%"
          {...restProps}
        >
          <View style={{ flex: 1, width: '100%' }} onLayout={onLayout}>
            {size.width > 0 && size.height > 0 ? (
              <Svg width={size.width} height={size.height}>
                <G x={padding.left} y={padding.top}>
                  {slots.hasGrid &&
                    yTicks.map((tick, idx) => {
                      const y = plotHeight - (tick / yMax) * plotHeight;
                      return (
                        <Line
                          key={`grid-${idx}`}
                          x1={0}
                          x2={plotWidth}
                          y1={y}
                          y2={y}
                          stroke={gridColor}
                          strokeWidth={1}
                        />
                      );
                    })}

                  {slots.hasYAxis && (
                    <>
                      <Line
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={plotHeight}
                        stroke={axisLineColor}
                        strokeWidth={1}
                      />
                      {yTicks.map((tick, idx) => {
                        const y = plotHeight - (tick / yMax) * plotHeight;
                        return (
                          <SvgText
                            key={`ytick-${idx}`}
                            x={-6}
                            y={y + TICK_FONT_SIZE / 3}
                            fontSize={TICK_FONT_SIZE}
                            fill={tickColor}
                            textAnchor="end"
                          >
                            {formatYTick(tick)}
                          </SvgText>
                        );
                      })}
                    </>
                  )}

                  {data.map((row, groupIndex) => {
                    const groupX = groupIndex * groupSlot + groupInnerPadding;
                    return (
                      <G key={`group-${groupIndex}`} x={groupX}>
                        {stackGroups.map((stack, stackIndex) => {
                          let stackBaseValue = 0;
                          return stack.bars.map((bar, barInStackIndex) => {
                            const value = Number(row[bar.dataKey]) || 0;
                            const valueAtTop = stackBaseValue + value;
                            const yTop = plotHeight - (valueAtTop / yMax) * plotHeight;
                            const yBottom = plotHeight - (stackBaseValue / yMax) * plotHeight;
                            const barHeight = Math.max(0, yBottom - yTop);
                            const x = stackIndex * barWidth;
                            const fillToken =
                              dataColorMapping[bar.dataKey]?.colorToken ?? bar.color;
                            const fill = fillToken ? getIn(theme.colors, fillToken) : tickColor;
                            const accentToken = getHighestColorInRange({
                              colorToken: fillToken,
                              followIntensityMapping: Boolean(
                                dataColorMapping[bar.dataKey]?.isCustomColor,
                              ),
                            });
                            const accentFill = accentToken
                              ? getIn(theme.colors, accentToken)
                              : fill;
                            stackBaseValue = valueAtTop;
                            if (!isNumber(value) || barHeight <= 0) return null;
                            return (
                              <G key={`bar-${groupIndex}-${stackIndex}-${barInStackIndex}`}>
                                <Rect
                                  x={x}
                                  y={yTop}
                                  width={barWidth}
                                  height={barHeight}
                                  rx={BAR_CHART_CORNER_RADIUS}
                                  ry={BAR_CHART_CORNER_RADIUS}
                                  fill={fill}
                                />
                                {barInStackIndex === stack.bars.length - 1 && barHeight > 2 ? (
                                  <Rect
                                    x={x}
                                    y={yTop}
                                    width={barWidth}
                                    height={1.5}
                                    fill={accentFill}
                                  />
                                ) : null}
                              </G>
                            );
                          });
                        })}
                      </G>
                    );
                  })}

                  {slots.hasXAxis && (
                    <>
                      <Line
                        x1={0}
                        x2={plotWidth}
                        y1={plotHeight}
                        y2={plotHeight}
                        stroke={axisLineColor}
                        strokeWidth={1}
                      />
                      {data.map((row, groupIndex) => {
                        if (groupIndex % xLabelStep !== 0) return null;
                        const cx = groupIndex * groupSlot + groupSlot / 2;
                        const rawLabel = slots.xDataKey
                          ? String(row[slots.xDataKey] ?? '')
                          : String(groupIndex);
                        const label = slots.xTickFormatter
                          ? slots.xTickFormatter(rawLabel, groupIndex)
                          : rawLabel;
                        const secondary = secondaryLabelMap?.[groupIndex];
                        return (
                          <G key={`xtick-${groupIndex}`}>
                            <SvgText
                              x={cx}
                              y={plotHeight + TICK_FONT_SIZE + 4}
                              fontSize={TICK_FONT_SIZE}
                              fill={tickColor}
                              textAnchor="middle"
                            >
                              {label}
                            </SvgText>
                            {secondary !== undefined && secondary !== null ? (
                              <SvgText
                                x={cx}
                                y={plotHeight + TICK_FONT_SIZE + 4 + SECONDARY_LABEL_FONT_SIZE + 2}
                                fontSize={SECONDARY_LABEL_FONT_SIZE}
                                fill={tickColor}
                                textAnchor="middle"
                              >
                                {String(secondary)}
                              </SvgText>
                            ) : null}
                          </G>
                        );
                      })}
                    </>
                  )}

                  {slots.xLabel ? (
                    <SvgText
                      x={plotWidth / 2}
                      y={plotHeight + padding.bottom - 4}
                      fontSize={AXIS_LABEL_FONT_SIZE}
                      fill={tickColor}
                      textAnchor="middle"
                    >
                      {slots.xLabel}
                    </SvgText>
                  ) : null}
                </G>

                {slots.hasLegend && (
                  <G x={padding.left} y={size.height - LEGEND_HEIGHT + 6}>
                    {visibleBars.map((bar, idx) => {
                      const fillToken = dataColorMapping[bar.dataKey]?.colorToken ?? bar.color;
                      const fill = fillToken ? getIn(theme.colors, fillToken) : tickColor;
                      const labelText = bar.name ?? bar.dataKey;
                      const stride = Math.max(80, plotWidth / Math.max(1, visibleBars.length));
                      const x = idx * stride;
                      return (
                        <G key={`legend-${bar.dataKey}`} x={x}>
                          <Rect
                            x={0}
                            y={0}
                            width={LEGEND_DOT_SIZE}
                            height={LEGEND_DOT_SIZE}
                            rx={2}
                            fill={fill}
                          />
                          <SvgText
                            x={LEGEND_DOT_SIZE + 6}
                            y={LEGEND_DOT_SIZE - 1}
                            fontSize={TICK_FONT_SIZE}
                            fill={tickColor}
                          >
                            {labelText}
                          </SvgText>
                        </G>
                      );
                    })}
                  </G>
                )}
              </Svg>
            ) : null}
          </View>
        </BaseBox>
      </BarChartContext.Provider>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartBarProps, ChartBarWrapperProps };
export { ChartBarWrapper, ChartBar };
