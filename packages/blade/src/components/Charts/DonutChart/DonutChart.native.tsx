import React, { isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { cancelAnimation, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  useChartsColorTheme,
  getHighestColorInRange,
  sanitizeString,
  assignDataColorMapping,
  isSequentialColor,
  totalChartColors,
} from '../utils';
import { componentId as commonChartComponentId } from '../CommonChartComponents/tokens';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type {
  ChartLegendProps,
  ChartTooltipProps,
  DataColorMapping,
} from '../CommonChartComponents';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
  Layout,
  Align,
} from '../CommonChartComponents/types';
import { AnimatedDonutSlice } from './AnimatedDonutSlice.native';
import type {
  ChartDonutWrapperProps,
  ChartDonutProps,
  ChartDonutCellProps,
  Content,
  ChartRadius,
} from './types';
import { RADIUS_MAPPING, BASE_CONTAINER_SIZE, START_AND_END_ANGLES, componentId } from './tokens';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { useControllableState } from '~utils/useControllable';
import getIn from '~utils/lodashButBetter/get';
import { castNativeType, makeMotionTime } from '~utils';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';

type CellSlot = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type LegendSlot = {
  selectedDataKeys?: string[];
  defaultSelectedDataKeys?: string[];
  onSelectedDataKeysChange?: ChartLegendProps['onSelectedDataKeysChange'];
  layout: Layout;
  align: Align;
};

type DonutSlot = {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: ChartDonutProps['nameKey'];
  cx: ChartDonutProps['cx'];
  cy: ChartDonutProps['cy'];
  radius: ChartRadius;
  colorTheme: NonNullable<ChartDonutProps['colorTheme']>;
  type: NonNullable<ChartDonutProps['type']>;
  cells: CellSlot[];
};

type DonutSlots = {
  donut?: DonutSlot;
  hasLegend: boolean;
  legend?: LegendSlot;
  hasTooltip: boolean;
  tooltipFormatter?: NonNullable<ChartTooltipProps['formatter']>;
};

const PADDING_ANGLE = 1.5;
const STROKE_RING_WIDTH = 0.75;
const LEGEND_SWATCH_SIZE = 12;
const TOOLTIP_WIDTH = 160;

/**
 * Gets the item name from a data row based on `nameKey`.
 * `nameKey` can be a string (property key) or a function (called with the item).
 * Replicated verbatim from the web DonutChart so native slice names match.
 */
const getItemName = (
  item: Record<string, unknown> | undefined,
  nameKey: ChartDonutProps['nameKey'],
): unknown => {
  if (!item) return undefined;
  if (!nameKey) return item.name;
  if (typeof nameKey === 'function') return nameKey(item);
  return item[nameKey as string];
};

/**
 * Scales a base pixel radius to the measured container size, capped at the base
 * value. Replicated from the web DonutChart (`getScaledRadius`).
 */
const getScaledRadius = (
  baseRadius: number,
  containerSize: number,
  baseContainerSize: number,
): number => {
  if (containerSize <= 0) return baseRadius;
  const scaleFactor = Math.min(containerSize / baseContainerSize, 1);
  return Math.round(baseRadius * scaleFactor);
};

/**
 * Resolves the legend swatch color token for a donut key. Mirrors the web
 * `getChartColor` (CommonChartComponents.web.tsx) so native legend swatches use
 * the same highest-intensity accent color as the web legend (not the lighter
 * slice-fill token).
 */
const getLegendColorToken = (
  mapped: DataColorMapping[string] | undefined,
  totalKeys: number,
): ChartsCategoricalColorToken | ChartSequentialColorToken | undefined => {
  if (!mapped) return undefined;
  const mappedColor = mapped.colorToken;
  if (mappedColor && isSequentialColor(mappedColor)) {
    return mappedColor;
  }
  if (!mappedColor) return undefined;
  return getHighestColorInRange({
    colorToken: mappedColor,
    followIntensityMapping: mapped.isCustomColor || totalKeys > totalChartColors,
  });
};

const parseCoordinate = (
  coord: ChartDonutProps['cx'],
  dimension: number,
  fallback: number,
): number => {
  if (typeof coord === 'number') return coord;
  if (typeof coord === 'string' && coord.trim().endsWith('%')) {
    const fraction = parseFloat(coord) / 100;
    if (!Number.isNaN(fraction)) return fraction * dimension;
  }
  return fallback;
};

const readChildSlots = (children: React.ReactNode): DonutSlots => {
  const slots: DonutSlots = {
    hasLegend: false,
    hasTooltip: false,
  };

  React.Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const id = getComponentId(child);

    if (id === componentId.chartDonut) {
      const props = child.props as ChartDonutProps;
      const cells: CellSlot[] = [];
      React.Children.forEach(props.children, (donutChild) => {
        if (isValidElement(donutChild) && getComponentId(donutChild) === componentId.cell) {
          cells.push({ color: (donutChild.props as ChartDonutCellProps).color });
        }
      });
      slots.donut = {
        data: Array.isArray(props.data) ? (props.data as Record<string, unknown>[]) : [],
        dataKey: (props.dataKey as string) ?? 'value',
        nameKey: props.nameKey,
        cx: props.cx ?? '50%',
        cy: props.cy ?? '50%',
        radius: props.radius ?? 'medium',
        colorTheme: props.colorTheme ?? 'categorical',
        type: props.type ?? 'circle',
        cells,
      };
    } else if (id === commonChartComponentId.chartLegend) {
      const props = child.props as ChartLegendProps;
      slots.hasLegend = true;
      slots.legend = {
        selectedDataKeys: props.selectedDataKeys,
        defaultSelectedDataKeys: props.defaultSelectedDataKeys,
        onSelectedDataKeysChange: props.onSelectedDataKeysChange,
        layout: props.layout ?? 'horizontal',
        align: props.align ?? 'right',
      };
    } else if (id === commonChartComponentId.chartTooltip) {
      slots.hasTooltip = true;
      const props = child.props as ChartTooltipProps;
      if (typeof props.formatter === 'function') {
        slots.tooltipFormatter = props.formatter;
      }
    }
  });

  return slots;
};

const _ChartDonut = (_props: ChartDonutProps): React.ReactElement | null => null;

/**
 * ChartDonut
 *
 * Marker component declaring the donut series inside ChartDonutWrapper.
 * On native it renders nothing — ChartDonutWrapper reads its props
 * (`data`, `dataKey`, `nameKey`, `radius`, `type`, cell colors) and draws the
 * slices with `react-native-svg`.
 */
const ChartDonut = assignWithoutSideEffects(_ChartDonut, {
  componentId: componentId.chartDonut,
});

const _ChartDonutCell = (_props: ChartDonutCellProps): React.ReactElement | null => null;

/**
 * ChartDonutCell
 *
 * Marker for a per-slice custom color. Read by ChartDonutWrapper via
 * `getComponentId`; renders nothing on its own.
 */
const ChartDonutCell = assignWithoutSideEffects(_ChartDonutCell, {
  componentId: componentId.cell,
});

const ChartDonutWrapper = ({
  children,
  content,
  testID,
  ...restProps
}: ChartDonutWrapperProps & TestID & DataAnalyticsAttribute): React.ReactElement => {
  const { theme } = useTheme();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasUserInteractedRef = useRef(false);

  const slots = useMemo(() => readChildSlots(children), [children]);
  const donut = slots.donut;
  const donutData = useMemo(() => donut?.data ?? [], [donut]);
  const dataKey = donut?.dataKey ?? 'value';
  const nameKey = donut?.nameKey;
  const donutType = donut?.type ?? 'circle';
  const donutRadius = donut?.radius ?? 'medium';
  const colorTheme = donut?.colorTheme ?? 'categorical';

  const themeColors = useChartsColorTheme({ colorTheme, chartName: 'donut' });

  // Build the name → color mapping (mirrors web ChartDonutWrapper). Legend
  // entries and slice colors are derived from this so they stay in sync.
  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    if (!donut) return mapping;
    const cells = donut.cells;
    donutData.forEach((item, index) => {
      const itemName = getItemName(item, nameKey);
      if (itemName === undefined || itemName === null) return;
      const cellColor = cells[index]?.color;
      mapping[sanitizeString(itemName as string)] = {
        colorToken: cellColor ?? themeColors[index],
        isCustomColor: Boolean(cellColor),
      };
    });
    assignDataColorMapping(mapping, themeColors);
    return mapping;
  }, [donut, donutData, nameKey, themeColors]);

  const allDataKeys = useMemo(() => Object.keys(dataColorMapping), [dataColorMapping]);

  const legendControlledValue = slots.legend?.selectedDataKeys;
  const legendDefaultValue = slots.legend?.defaultSelectedDataKeys;
  const isControlled = legendControlledValue !== undefined;
  const shouldAutoSelectAllDataKeys = !isControlled && legendDefaultValue === undefined;

  const [selectedKeysArray, setSelectedKeysArray] = useControllableState<string[]>({
    value: legendControlledValue,
    defaultValue: legendDefaultValue ?? allDataKeys,
  });

  // Auto-select newly added keys until the user interacts (web parity).
  useEffect(() => {
    if (!shouldAutoSelectAllDataKeys || hasUserInteractedRef.current || allDataKeys.length === 0) {
      return;
    }
    const isSelectedStateInSync =
      selectedKeysArray.length === allDataKeys.length &&
      allDataKeys.every((key) => selectedKeysArray.includes(key));
    if (!isSelectedStateInSync) {
      setSelectedKeysArray(() => [...allDataKeys], true);
    }
  }, [allDataKeys, selectedKeysArray, setSelectedKeysArray, shouldAutoSelectAllDataKeys]);

  // Reset selection when the data keys change completely (e.g. nameKey change).
  useEffect(() => {
    if (allDataKeys.length > 0 && selectedKeysArray.length > 0) {
      const hasOverlap = selectedKeysArray.some((key) => allDataKeys.includes(key));
      if (!hasOverlap) {
        setSelectedKeysArray(() => [...allDataKeys]);
      }
    }
  }, [allDataKeys, selectedKeysArray, setSelectedKeysArray]);

  const handleToggle = (dataKeyToToggle: string): void => {
    hasUserInteractedRef.current = true;
    const newSelectedKeys = selectedKeysArray.includes(dataKeyToToggle)
      ? selectedKeysArray.filter((key) => key !== dataKeyToToggle)
      : [...selectedKeysArray, dataKeyToToggle];
    setSelectedKeysArray(() => newSelectedKeys);
    slots.legend?.onSelectedDataKeysChange?.({
      dataKey: dataKeyToToggle,
      selectedKeysArray: newSelectedKeys,
    });
  };

  // Filter data to the selected keys, preserving the original index so colors
  // remain stable across filtering (web `filteredToOriginalIndexMap`).
  const { filteredData, filteredToOriginalIndexMap } = useMemo(() => {
    const filtered: Record<string, unknown>[] = [];
    const indexMap: Record<number, number> = {};
    donutData.forEach((item, originalIdx) => {
      const itemName = getItemName(item, nameKey);
      const sanitized = sanitizeString(itemName as string);
      if (!slots.hasLegend || selectedKeysArray.includes(sanitized)) {
        indexMap[filtered.length] = originalIdx;
        filtered.push(item);
      }
    });
    return { filteredData: filtered, filteredToOriginalIndexMap: indexMap };
  }, [donutData, nameKey, selectedKeysArray, slots.hasLegend]);

  const total = useMemo(
    () =>
      filteredData.reduce((acc, item) => {
        const value = Number(item[dataKey]);
        return acc + (Number.isFinite(value) && value > 0 ? value : 0);
      }, 0),
    [filteredData, dataKey],
  );

  // Sweep-in draw progress, shared by every slice. Reset to 0 and animate to 1
  // whenever the rendered slice set changes (mount, data, filter, or type).
  const sweepProgress = useSharedValue(0);
  const motionDuration = castNativeType(makeMotionTime(getIn(theme.motion, 'duration.gentle')));
  const motionEasing = getIn(theme.motion, 'easing.standard');
  const sweepKey = `${filteredData.length}-${selectedKeysArray.join(',')}-${donutType}-${filteredData
    .map((d) => d[dataKey])
    .join(',')}`;

  useEffect(() => {
    sweepProgress.value = 0;
    setActiveIndex(null);
    sweepProgress.value = withTiming(1, { duration: motionDuration, easing: motionEasing });
    return () => {
      cancelAnimation(sweepProgress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sweepKey]);

  const onLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  const containerSize = Math.min(size.width, size.height);
  const outerRadius = getScaledRadius(
    RADIUS_MAPPING[donutRadius].outerRadius,
    containerSize,
    BASE_CONTAINER_SIZE[donutRadius],
  );
  const innerRadius = getScaledRadius(
    RADIUS_MAPPING[donutRadius].innerRadius,
    containerSize,
    BASE_CONTAINER_SIZE[donutRadius],
  );
  const strokeInnerRadius = outerRadius - STROKE_RING_WIDTH;
  const centerX = parseCoordinate(donut?.cx, size.width, size.width / 2);
  const centerY = parseCoordinate(donut?.cy, size.height, size.height / 2);

  const { startAngle, endAngle } = START_AND_END_ANGLES[donutType];

  // Compute the fixed [startAngle, endAngle] for every visible slice, including
  // the paddingAngle gaps between them.
  const slices = useMemo(() => {
    if (total <= 0 || filteredData.length === 0) return [];

    const spanMagnitude = Math.abs(endAngle - startAngle);
    const direction = endAngle >= startAngle ? 1 : -1;
    const isFullCircle = spanMagnitude >= 359.999;
    const sliceCount = filteredData.length;
    const gapCount = isFullCircle && sliceCount > 1 ? sliceCount : Math.max(0, sliceCount - 1);
    let totalPadding = PADDING_ANGLE * gapCount;
    if (totalPadding >= spanMagnitude) totalPadding = 0;
    const sliceableMagnitude = spanMagnitude - totalPadding;

    let cursor = startAngle;
    return filteredData.map((item, index) => {
      const rawValue = Number(item[dataKey]);
      const value = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
      const fraction = total > 0 ? value / total : 0;
      const sliceMagnitude = fraction * sliceableMagnitude;
      const sliceStart = cursor;
      const sliceEnd = cursor + direction * sliceMagnitude;
      cursor = sliceEnd;
      if (isFullCircle || index < sliceCount - 1) {
        cursor += direction * PADDING_ANGLE;
      }

      const originalIndex = filteredToOriginalIndexMap[index] ?? index;
      const cellColor = donut?.cells[originalIndex]?.color;
      const fillToken = cellColor ?? themeColors[originalIndex];
      const accentToken = getHighestColorInRange({
        colorToken: fillToken,
        followIntensityMapping: Boolean(cellColor),
      });

      return {
        startAngle: sliceStart,
        endAngle: sliceEnd,
        fill: getIn(theme.colors, fillToken) as string,
        accent: getIn(theme.colors, accentToken) as string,
        name: getItemName(item, nameKey),
        value,
        originalIndex,
      };
    });
  }, [
    total,
    filteredData,
    startAngle,
    endAngle,
    dataKey,
    filteredToOriginalIndexMap,
    donut,
    themeColors,
    nameKey,
    theme.colors,
  ]);

  const handleSlicePress = (index: number): void => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Clear any stale active highlight if the slice set shrinks below it.
  useEffect(() => {
    if (activeIndex !== null && activeIndex >= slices.length) {
      setActiveIndex(null);
    }
  }, [activeIndex, slices.length]);

  const isContentObject =
    Boolean(content) && typeof content === 'object' && !isValidElement(content);
  const contentAsObject = isContentObject ? (content as Content) : undefined;
  const hasCenterLabel = Boolean(contentAsObject && 'label' in contentAsObject);
  const hasCenterValue = Boolean(contentAsObject && 'value' in contentAsObject);
  const hasCenterContent = hasCenterLabel || hasCenterValue || isValidElement(content);

  const legendLayout = slots.legend?.layout ?? 'horizontal';
  const legendAlign = slots.legend?.align ?? 'right';

  const activeSlice = activeIndex !== null ? slices[activeIndex] : undefined;
  const tooltipInfo = useMemo(() => {
    if (!slots.hasTooltip || !activeSlice) return undefined;
    const rawLabel = activeSlice.name != null ? String(activeSlice.name) : '';
    let displayValue = String(activeSlice.value);
    let label = rawLabel;
    const formatter = slots.tooltipFormatter;
    if (formatter) {
      try {
        // Recharts formatter: (value, name, item, index, payload) => string | [value, name]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = (formatter as any)(
          activeSlice.value,
          rawLabel,
          undefined,
          activeIndex ?? 0,
          undefined,
        );
        if (Array.isArray(formatted)) {
          if (formatted[0] !== undefined && formatted[0] !== null)
            displayValue = String(formatted[0]);
          if (formatted[1] !== undefined && formatted[1] !== null) label = String(formatted[1]);
        } else if (formatted !== undefined && formatted !== null) {
          displayValue = String(formatted);
        }
      } catch {
        // Formatter threw — fall back to the raw value silently.
      }
    }
    return { label, displayValue, color: activeSlice.fill };
  }, [slots.hasTooltip, slots.tooltipFormatter, activeSlice, activeIndex]);

  // Position the tooltip near the active slice centroid, clamped to the chart.
  const tooltipPosition = useMemo(() => {
    if (!activeSlice || size.width <= 0) return undefined;
    const midAngle = (activeSlice.startAngle + activeSlice.endAngle) / 2;
    const midRadius = (innerRadius + outerRadius) / 2;
    const rad = (midAngle * Math.PI) / 180;
    const pointX = centerX + midRadius * Math.cos(rad);
    const pointY = centerY - midRadius * Math.sin(rad);
    const left = Math.max(0, Math.min(size.width - TOOLTIP_WIDTH, pointX - TOOLTIP_WIDTH / 2));
    const ESTIMATED_TOOLTIP_HEIGHT = 48;
    const top = Math.max(0, Math.min(size.height - ESTIMATED_TOOLTIP_HEIGHT, pointY));
    return { left, top };
  }, [activeSlice, size.width, size.height, innerRadius, outerRadius, centerX, centerY]);

  const legendNode = slots.hasLegend ? (
    <View
      style={{
        flexDirection: legendLayout === 'vertical' ? 'column' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: legendLayout === 'vertical' ? 'flex-start' : 'center',
        gap: theme.spacing[5],
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[3],
      }}
    >
      {allDataKeys.map((key) => {
        const isSelected = selectedKeysArray.includes(key);
        const colorToken = getLegendColorToken(dataColorMapping[key], allDataKeys.length);
        return (
          <Pressable
            key={key}
            onPress={() => handleToggle(key)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={key}
          >
            <View
              style={{
                width: LEGEND_SWATCH_SIZE,
                height: LEGEND_SWATCH_SIZE,
                borderRadius: theme.border.radius['2xsmall'],
                backgroundColor: colorToken
                  ? (getIn(theme.colors, colorToken) as string)
                  : undefined,
                opacity: isSelected ? 1 : 0.4,
                marginRight: theme.spacing[2],
              }}
            />
            <Text
              size="medium"
              color="surface.text.gray.muted"
              textDecorationLine={isSelected ? 'none' : 'line-through'}
            >
              {key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ) : null;

  const chartArea = (
    <View style={{ flex: 1 }} onLayout={onLayout} testID={testID ? `${testID}-canvas` : 'donut-chart-canvas'}>
      {size.width > 0 && size.height > 0 && slices.length > 0 ? (
        <Svg width={size.width} height={size.height}>
          <G>
            {slices.map((slice, index) => (
              <AnimatedDonutSlice
                key={`slice-${slice.originalIndex}-${index}`}
                cx={centerX}
                cy={centerY}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={slice.startAngle}
                endAngle={slice.endAngle}
                fill={slice.fill}
                sweepProgress={sweepProgress}
                isDimmed={activeIndex !== null && activeIndex !== index}
                onPress={() => handleSlicePress(index)}
                motionDuration={motionDuration}
                motionEasing={motionEasing}
              />
            ))}
          </G>
          {/* Accent outer ring — non-interactive, mirrors the web pointer-events:none Pie. */}
          <G pointerEvents="none">
            {slices.map((slice, index) => (
              <AnimatedDonutSlice
                key={`stroke-${slice.originalIndex}-${index}`}
                cx={centerX}
                cy={centerY}
                innerRadius={strokeInnerRadius}
                outerRadius={outerRadius}
                startAngle={slice.startAngle}
                endAngle={slice.endAngle}
                fill="transparent"
                stroke={slice.accent}
                strokeWidth={STROKE_RING_WIDTH}
                sweepProgress={sweepProgress}
                isDimmed={activeIndex !== null && activeIndex !== index}
                isInteractive={false}
                motionDuration={motionDuration}
                motionEasing={motionEasing}
              />
            ))}
          </G>
        </Svg>
      ) : null}

      {hasCenterContent && size.width > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isValidElement(content) ? (
            content
          ) : (
            <>
              {hasCenterLabel ? (
                <Text size="small" color="surface.text.gray.muted">
                  {contentAsObject?.label}
                </Text>
              ) : null}
              {hasCenterValue ? (
                <Text size="large" weight="semibold" color="surface.text.gray.normal">
                  {contentAsObject?.value}
                </Text>
              ) : null}
            </>
          )}
        </View>
      ) : null}

      {tooltipInfo && tooltipPosition ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: tooltipPosition.left,
            top: tooltipPosition.top,
            width: TOOLTIP_WIDTH,
            // Solid, fully-opaque surface — matches the web ChartTooltip
            // (surface.icon.staticBlack.normal). The previous
            // popup.background.gray.intense token is only 72% opaque, so the
            // chart showed through the tooltip on native.
            backgroundColor: theme.colors.surface.icon.staticBlack.normal,
            borderRadius: theme.border.radius.large,
            borderWidth: theme.border.width.thin,
            borderColor: theme.colors.surface.border.gray.muted,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[3],
            // elevation.highRaised parity (RN can't parse the web string).
            shadowColor: '#000',
            shadowOpacity: 0.24,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              backgroundColor: tooltipInfo.color,
              marginRight: theme.spacing[2],
            }}
          />
          <View style={{ flex: 1 }}>
            <Text size="xsmall" color="surface.text.staticWhite.normal">
              {tooltipInfo.label}
            </Text>
          </View>
          <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.normal">
            {tooltipInfo.displayValue}
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'donut',
        dataColorMapping,
        selectedDataKeys: selectedKeysArray,
        setSelectedDataKeys: (keys: string[]) => setSelectedKeysArray(() => keys),
      }}
    >
      <BaseBox
        {...metaAttribute({ name: 'donut-chart', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        {...restProps}
      >
        {donut && donutData.length > 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: legendLayout === 'vertical' ? 'row' : 'column',
            }}
          >
            {legendLayout === 'vertical' && legendAlign === 'left' ? legendNode : null}
            {chartArea}
            {legendLayout === 'vertical' && legendAlign === 'right' ? legendNode : null}
            {/* Horizontal legend always renders below the chart area on native.
                This is a deliberate simplification for mobile screens where
                left/right alignment of a wrapping horizontal legend is less
                useful than on desktop web. The legend container uses
                justifyContent: 'center' for visual balance. */}
            {legendLayout === 'horizontal' ? legendNode : null}
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text size="small" color="surface.text.gray.muted">
              No data to display
            </Text>
          </View>
        )}
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartDonutWrapperProps, ChartDonutProps, ChartDonutCellProps };
export { ChartDonutWrapper, ChartDonut, ChartDonutCell };
