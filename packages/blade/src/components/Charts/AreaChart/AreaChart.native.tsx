import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Svg,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
  Line,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';
import { Pressable, View } from 'react-native';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useChartsColorTheme, assignDataColorMapping, getHighestColorInRange } from '../utils';
import {
  CommonChartComponentsContext,
  componentId as commonComponentIds,
} from '../CommonChartComponents';
import type {
  DataColorMapping,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartReferenceLineProps,
  ChartTooltipProps,
  ChartLegendProps,
} from '../CommonChartComponents';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import { componentIds } from './componentIds';
import type { ChartAreaProps, ChartAreaWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { useControllableState } from '~utils/useControllable';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';

// Plot padding is in raw SVG pixels because react-native-svg works in pixel
// space; it does not consume Blade's spacing tokens directly. Mirrors BarChart.
const PLOT_PADDING = { top: 16, right: 16, bottom: 32, left: 40 };
const Y_TICK_COUNT = 4;
const TICK_FONT_SIZE = 10;
const AXIS_LABEL_FONT_SIZE = 11;
const SECONDARY_LABEL_FONT_SIZE = 10;
const X_AXIS_TITLE_GAP = 6;
// Area-specific tokens.
const STROKE_WIDTH = 1.5;
const AREA_FILL_OPACITY = 0.5;
// While scrubbing, the whole set of areas is slightly dimmed so the active
// cursor column (line + active dots) becomes the visual focus — the closest
// touch analog to recharts' pointer-hover emphasis.
const AREA_FILL_OPACITY_DIMMED = 0.3;
const DOT_RADIUS = 3;
const ACTIVE_DOT_RADIUS = 4.5;
const LEGEND_SWATCH_SIZE = 12;
const TOOLTIP_WIDTH = 180;

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Module-level counter yields stable, collision-free ids for gradient/clip defs
// across multiple chart instances on the same screen without relying on the
// async `useId` (which is null on the first native render).
let uniqueChartCounter = 0;

type ChartColorToken = ChartsCategoricalColorToken | ChartSequentialColorToken;

type CurveType = NonNullable<ChartAreaProps['type']>;

type AreaSlot = {
  dataKey: string;
  name?: string;
  color?: ChartColorToken;
  stackId: string;
  type: CurveType;
  connectNulls: boolean;
  hide?: boolean;
  showLegend: boolean;
  dot: boolean;
  activeDot: boolean;
};

type ReferenceLineSlot = {
  orientation: 'horizontal' | 'vertical';
  value: number | string;
  label?: string;
};

type LegendSlot = {
  hasLegend: boolean;
  selectedDataKeys?: string[];
  defaultSelectedDataKeys?: string[];
  onSelectedDataKeysChange?: ChartLegendProps['onSelectedDataKeysChange'];
};

type TooltipFormatter = NonNullable<ChartTooltipProps['formatter']>;

type ChildSlots = {
  areas: AreaSlot[];
  hasXAxis: boolean;
  xDataKey?: string;
  xSecondaryDataKey?: string;
  xTickFormatter?: (value: string, index: number) => string;
  xInterval?: number;
  xLabel?: string;
  hasYAxis: boolean;
  yLabel?: string;
  hasGrid: boolean;
  legend: LegendSlot;
  referenceLines: ReferenceLineSlot[];
  hasTooltip: boolean;
  tooltipFormatter?: TooltipFormatter;
};

const readChildSlots = (children: React.ReactNode): ChildSlots => {
  const slots: ChildSlots = {
    areas: [],
    hasXAxis: false,
    hasYAxis: false,
    hasGrid: false,
    legend: { hasLegend: false },
    referenceLines: [],
    hasTooltip: false,
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const id = getComponentId(child);
    if (id === componentIds.ChartArea) {
      const props = child.props as ChartAreaProps;
      slots.areas.push({
        dataKey: props.dataKey as string,
        name: props.name,
        color: props.color,
        stackId: props.stackId != null ? String(props.stackId) : '1',
        type: props.type ?? 'monotone',
        connectNulls: Boolean(props.connectNulls),
        hide: props.hide,
        showLegend: props.showLegend !== false,
        dot: Boolean(props.dot),
        activeDot: props.activeDot !== false,
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
      const props = child.props as ChartLegendProps;
      slots.legend = {
        hasLegend: true,
        selectedDataKeys: props.selectedDataKeys,
        defaultSelectedDataKeys: props.defaultSelectedDataKeys,
        onSelectedDataKeysChange: props.onSelectedDataKeysChange,
      };
    } else if (id === commonComponentIds.chartCartesianGrid) {
      slots.hasGrid = true;
    } else if (id === commonComponentIds.chartTooltip) {
      slots.hasTooltip = true;
      const props = child.props as ChartTooltipProps;
      if (typeof props.formatter === 'function') {
        slots.tooltipFormatter = props.formatter;
      }
    } else if (id === commonComponentIds.chartReferenceLine) {
      const props = child.props as ChartReferenceLineProps;
      // Web supports BOTH horizontal (numeric `y`) and vertical (category `x`)
      // reference lines — native renders both at full parity.
      if (typeof props.y === 'number') {
        slots.referenceLines.push({
          orientation: 'horizontal',
          value: props.y,
          label: typeof props.label === 'string' ? props.label : undefined,
        });
      } else if (props.x !== undefined && props.x !== null) {
        slots.referenceLines.push({
          orientation: 'vertical',
          value: props.x,
          label: typeof props.label === 'string' ? props.label : undefined,
        });
      }
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

type Point = { x: number; y: number };

// Fritsch–Carlson monotone cubic interpolation, emitting SVG `C` segments.
// Assumes the path is already positioned at pts[0] (caller emits the `M`).
const buildMonotone = (pts: Point[]): string => {
  const n = pts.length;
  if (n < 2) return '';
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1] - xs[i];
    delta.push(dx === 0 ? 0 : (ys[i + 1] - ys[i]) / dx);
  }
  const m: number[] = new Array(n).fill(0);
  m[0] = delta[0];
  m[n - 1] = delta[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      m[i] = 0;
    } else {
      m[i] = (delta[i - 1] + delta[i]) / 2;
    }
  }
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / delta[i];
      const b = m[i + 1] / delta[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * delta[i];
        m[i + 1] = t * b * delta[i];
      }
    }
  }
  let d = '';
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1] - xs[i];
    const cp1x = xs[i] + dx / 3;
    const cp1y = ys[i] + (m[i] * dx) / 3;
    const cp2x = xs[i + 1] - dx / 3;
    const cp2y = ys[i + 1] - (m[i + 1] * dx) / 3;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${xs[i + 1]} ${ys[i + 1]}`;
  }
  return d.trim();
};

// Returns the path commands drawing through pts[1..], assuming the pen is
// already at pts[0]. The caller prefixes the `M`/`L` for pts[0].
const buildCurve = (pts: Point[], type: CurveType): string => {
  const n = pts.length;
  if (n < 2) return '';
  if (type === 'monotone') return buildMonotone(pts);

  const commands: string[] = [];
  for (let i = 1; i < n; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    if (type === 'linear') {
      commands.push(`L ${curr.x} ${curr.y}`);
    } else if (type === 'stepAfter') {
      commands.push(`L ${curr.x} ${prev.y}`);
      commands.push(`L ${curr.x} ${curr.y}`);
    } else if (type === 'stepBefore') {
      commands.push(`L ${prev.x} ${curr.y}`);
      commands.push(`L ${curr.x} ${curr.y}`);
    } else {
      // 'step' — transition at the midpoint between adjacent points.
      const mid = (prev.x + curr.x) / 2;
      commands.push(`L ${mid} ${prev.y}`);
      commands.push(`L ${mid} ${curr.y}`);
      commands.push(`L ${curr.x} ${curr.y}`);
    }
  }
  return commands.join(' ');
};

type SeriesPoint = { x: number; yTop: number; yBase: number; isNull: boolean };

type AreaSeriesProps = {
  points: SeriesPoint[];
  type: CurveType;
  connectNulls: boolean;
  gradientId: string;
  strokeColor: string;
  dotColor: string;
  showDot: boolean;
  showActiveDot: boolean;
  activeIndex?: number;
  scrubProgress: SharedValue<number>;
  activeRingColor: string;
};

const AreaSeries = ({
  points,
  type,
  connectNulls,
  gradientId,
  strokeColor,
  dotColor,
  showDot,
  showActiveDot,
  activeIndex,
  scrubProgress,
  activeRingColor,
}: AreaSeriesProps): React.ReactElement => {
  const animatedProps = useAnimatedProps(() => ({
    fillOpacity:
      AREA_FILL_OPACITY - scrubProgress.value * (AREA_FILL_OPACITY - AREA_FILL_OPACITY_DIMMED),
  }));

  // Split into contiguous segments. When connectNulls is true, null points are
  // bridged (removed) so the series draws as one continuous shape.
  const segments: SeriesPoint[][] = [];
  if (connectNulls) {
    const nonNull = points.filter((p) => !p.isNull);
    if (nonNull.length) segments.push(nonNull);
  } else {
    let current: SeriesPoint[] = [];
    points.forEach((p) => {
      if (p.isNull) {
        if (current.length) segments.push(current);
        current = [];
      } else {
        current.push(p);
      }
    });
    if (current.length) segments.push(current);
  }

  return (
    <G>
      {segments.map((segment, segIndex) => {
        if (segment.length === 0) return null;
        const topPts = segment.map((p) => ({ x: p.x, y: p.yTop }));
        const basePts = segment.map((p) => ({ x: p.x, y: p.yBase }));
        const reversedBase = [...basePts].reverse();

        const strokeD = `M ${topPts[0].x} ${topPts[0].y} ${buildCurve(topPts, type)}`.trim();

        let fillD = '';
        if (segment.length >= 2) {
          fillD =
            `M ${topPts[0].x} ${topPts[0].y} ${buildCurve(topPts, type)} ` +
            `L ${reversedBase[0].x} ${reversedBase[0].y} ${buildCurve(reversedBase, type)} Z`;
        }

        return (
          <G key={`segment-${segIndex}`}>
            {fillD ? (
              <AnimatedPath
                d={fillD}
                fill={`url(#${gradientId})`}
                animatedProps={animatedProps}
              />
            ) : null}
            <Path
              d={strokeD}
              stroke={strokeColor}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinejoin="round"
            />
          </G>
        );
      })}

      {showDot
        ? points.map((p, idx) =>
            p.isNull ? null : (
              <Circle key={`dot-${idx}`} cx={p.x} cy={p.yTop} r={DOT_RADIUS} fill={strokeColor} />
            ),
          )
        : null}

      {showActiveDot &&
      activeIndex !== undefined &&
      points[activeIndex] &&
      !points[activeIndex].isNull ? (
        <Circle
          cx={points[activeIndex].x}
          cy={points[activeIndex].yTop}
          r={ACTIVE_DOT_RADIUS}
          fill={dotColor}
          stroke={activeRingColor}
          strokeWidth={2}
        />
      ) : null}
    </G>
  );
};

const _ChartArea = (_props: ChartAreaProps): React.ReactElement | null => {
  return null;
};

/**
 * ChartArea
 *
 * Marker component declaring an area series inside ChartAreaWrapper.
 * On native this component renders nothing on its own — ChartAreaWrapper reads
 * its props (`dataKey`, `name`, `color`, `stackId`, `type`, `connectNulls`,
 * `dot`, `activeDot`, `showLegend`, `hide`) and renders the areas via
 * react-native-svg.
 */
const ChartArea = assignWithoutSideEffects(_ChartArea, {
  componentId: componentIds.ChartArea,
});

const ChartAreaWrapper: React.FC<ChartAreaWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'categorical',
  data = [],
  testID,
  ...restProps
}) => {
  const { theme, colorScheme } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const chartIdRef = useRef<string | undefined>(undefined);
  if (chartIdRef.current === undefined) {
    chartIdRef.current = `area-${uniqueChartCounter++}`;
  }
  const chartId = chartIdRef.current;

  const scrubProgress = useSharedValue(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- scrubProgress and theme.motion are stable refs
  useEffect(() => {
    scrubProgress.value = withTiming(activeIndex !== undefined ? 1 : 0, {
      duration: getIn(theme.motion, 'duration.quick'),
    });
  }, [activeIndex]);

  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  const slots = useMemo(() => readChildSlots(children), [children]);
  const allAreas = slots.areas;

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'area',
    chartDataIndicators: allAreas.length,
  });

  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    allAreas.forEach((area) => {
      mapping[area.dataKey] = {
        colorToken: area.color!,
        isCustomColor: Boolean(area.color),
      };
    });
    assignDataColorMapping(mapping, themeColors);
    return mapping;
  }, [allAreas, themeColors]);

  const allDataKeys = useMemo(() => Object.keys(dataColorMapping), [dataColorMapping]);

  // Interactive legend selection — controlled/uncontrolled via the exact hook
  // web's ChartLegend uses. The wrapper owns the logic because the native
  // ChartLegend marker renders nothing.
  const [selectedKeys, setSelectedKeys] = useControllableState<string[]>({
    value: slots.legend.selectedDataKeys,
    defaultValue: slots.legend.defaultSelectedDataKeys ?? allDataKeys,
  });

  const handleLegendToggle = (dataKey: string): void => {
    const next = selectedKeys.includes(dataKey)
      ? selectedKeys.filter((k) => k !== dataKey)
      : [...selectedKeys, dataKey];
    setSelectedKeys(() => next);
    slots.legend.onSelectedDataKeysChange?.({ dataKey, selectedKeysArray: next });
  };

  const visibleAreas = useMemo(
    () => allAreas.filter((area) => selectedKeys.includes(area.dataKey)),
    [allAreas, selectedKeys],
  );

  const secondaryLabelMap = useMemo(() => {
    if (!slots.xSecondaryDataKey || !data?.length) return undefined;
    const map: Record<number, string | number | undefined> = {};
    data.forEach((row, index) => {
      map[index] = row[slots.xSecondaryDataKey!] as string | number | undefined;
    });
    return map;
  }, [data, slots.xSecondaryDataKey]);

  // Group visible areas by stackId (recharts default stackId === 1 stacks all
  // areas that don't override it).
  const stackGroups = useMemo(() => {
    const groupOrder: string[] = [];
    const map = new Map<string, AreaSlot[]>();
    visibleAreas.forEach((area) => {
      const key = area.stackId;
      if (!map.has(key)) {
        map.set(key, []);
        groupOrder.push(key);
      }
      map.get(key)!.push(area);
    });
    return groupOrder.map((key) => ({ key, areas: map.get(key)! }));
  }, [visibleAreas]);

  const dataMax = useMemo(() => {
    if (!data.length) return 0;
    let max = 0;
    data.forEach((row) => {
      stackGroups.forEach((group) => {
        const sum = group.areas.reduce((acc, area) => acc + (Number(row[area.dataKey]) || 0), 0);
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
  const needsExtraBottomPad = Boolean(slots.xLabel && slots.xSecondaryDataKey);
  const padding = showAxes
    ? {
        ...PLOT_PADDING,
        bottom: needsExtraBottomPad
          ? PLOT_PADDING.bottom + SECONDARY_LABEL_FONT_SIZE + X_AXIS_TITLE_GAP
          : PLOT_PADDING.bottom,
      }
    : { top: 0, right: 0, bottom: 0, left: 0 };

  const plotWidth = Math.max(0, size.width - padding.left - padding.right);
  const plotHeight = Math.max(0, size.height - padding.top - padding.bottom);

  const count = data.length;
  const pointStep = count > 1 ? plotWidth / (count - 1) : 0;
  const xAt = (i: number): number => (count > 1 ? i * pointStep : plotWidth / 2);
  const yAt = (value: number): number =>
    yMax > 0 ? plotHeight - (value / yMax) * plotHeight : plotHeight;

  const xLabelStep = Math.max(1, (slots.xInterval ?? 0) + 1);

  const tickColor = getIn(theme.colors, 'surface.text.gray.muted');
  // Reference-line label text uses the NORMAL (darker) token to match web, which
  // renders the pill label with `surface.text.gray.normal`. Kept distinct from
  // `tickColor` so axis tick labels stay muted.
  const referenceLabelTextColor = getIn(theme.colors, 'surface.text.gray.normal');
  const axisLineColor = getIn(theme.colors, 'surface.border.gray.muted');
  const gridColor = getIn(theme.colors, 'surface.border.gray.subtle');
  const referenceColor = getIn(theme.colors, 'data.background.categorical.gray.intense');
  const referenceLabelFill = getIn(theme.colors, 'surface.background.gray.subtle');
  const referenceLabelStroke = getIn(theme.colors, 'surface.border.gray.muted');
  const cursorColor = getIn(theme.colors, 'surface.border.gray.normal');
  const activeRingColor = getIn(theme.colors, 'surface.background.gray.intense');

  // Per-visible-area point geometry with cumulative stacking baselines.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- xAt/yAt/chartId are stable closures derived from values already in deps
  const areaGeometries = useMemo(() => {
    const geometries: {
      area: AreaSlot;
      points: SeriesPoint[];
      gradientId: string;
      strokeColor: string;
    }[] = [];

    stackGroups.forEach((group) => {
      const runningBase = new Array(count).fill(0);
      group.areas.forEach((area) => {
        const points: SeriesPoint[] = data.map((row, i) => {
          const raw = row[area.dataKey];
          const isNull = raw === null || raw === undefined || !isNumber(Number(raw));
          const value = isNull ? 0 : Number(raw);
          const base = runningBase[i];
          const top = base + value;
          runningBase[i] += value;
          return {
            x: xAt(i),
            yTop: yAt(top),
            yBase: yAt(base),
            isNull,
          };
        });

        const mappingEntry = dataColorMapping[area.dataKey];
        const isCustomColor = Boolean(mappingEntry?.isCustomColor);
        const strokeToken = isCustomColor
          ? getHighestColorInRange({ colorToken: mappingEntry.colorToken })
          : mappingEntry?.colorToken;
        const strokeColor = strokeToken ? getIn(theme.colors, strokeToken) : tickColor;

        geometries.push({
          area,
          points,
          gradientId: `${chartId}-grad-${area.dataKey}`,
          strokeColor,
        });
      });
    });

    return geometries;
  }, [stackGroups, data, count, plotWidth, plotHeight, yMax, dataColorMapping, theme.colors]);

  // Fire the recharts-style left→right clip reveal on mount and whenever the
  // data or the visible-series set changes (recharts re-animates on data change).
  const revealProgress = useSharedValue(0);
  const hasAnimatedRef = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- revealProgress and theme.motion are stable refs; plotWidth intentionally excluded to avoid re-animating on resize
  useEffect(() => {
    if (hasAnimatedRef.current) {
      revealProgress.value = 1;
      return;
    }
    revealProgress.value = 0;
    revealProgress.value = withDelay(
      getIn(theme.motion, 'delay.gentle'),
      withTiming(1, {
        duration: getIn(theme.motion, 'duration.xgentle'),
        easing: getIn(theme.motion, 'easing.entrance'),
      }),
    );
    hasAnimatedRef.current = true;
  }, [count, visibleAreas.length]);

  const clipAnimatedProps = useAnimatedProps(() => ({
    width: revealProgress.value * plotWidth,
  }));

  const indexAtX = (localX: number): number | undefined => {
    if (count === 0) return undefined;
    const plotX = localX - padding.left;
    if (count === 1) return 0;
    if (pointStep === 0) return 0;
    const idx = Math.round(plotX / pointStep);
    return Math.min(count - 1, Math.max(0, idx));
  };

  // Selection persists after the finger lifts (parity with DonutChart): a tap on
  // the already-active point toggles it off, a tap/scrub elsewhere moves it, and a
  // drag scrubs. `onResponderRelease` decides between "toggle off" and "keep".
  const touchStartActiveRef = React.useRef<number | undefined>(undefined);
  const touchStartIndexRef = React.useRef<number | undefined>(undefined);
  const touchMovedRef = React.useRef(false);

  // Track the initial touch location so onMoveShouldSetResponder can apply a
  // horizontal movement threshold — this lets a parent ScrollView reclaim the
  // gesture for vertical scrolling when the user drags mostly vertically.
  const touchStartLocationRef = React.useRef<{ x: number; y: number } | undefined>(undefined);
  const SCRUB_MOVE_THRESHOLD = 8;

  const handleScrubStart = (e: GestureResponderEvent): void => {
    if (count === 0) return;
    const next = indexAtX(e.nativeEvent.locationX);
    touchStartActiveRef.current = activeIndex;
    touchStartIndexRef.current = next;
    touchMovedRef.current = false;
    touchStartLocationRef.current = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
    setActiveIndex(next);
  };

  const handleScrubMove = (e: GestureResponderEvent): void => {
    if (count === 0) return;
    touchMovedRef.current = true;
    setActiveIndex(indexAtX(e.nativeEvent.locationX));
  };

  const handleScrubEnd = (): void => {
    // Tap (no drag) on the point that was already active → toggle off; otherwise
    // leave the selection in place so the tooltip stays.
    if (!touchMovedRef.current && touchStartActiveRef.current === touchStartIndexRef.current) {
      setActiveIndex(undefined);
    }
  };

  const handleScrubTerminate = (): void => {
    touchMovedRef.current = false;
  };

  const activeRow = activeIndex !== undefined ? data[activeIndex] : undefined;
  const activeLabelRaw =
    activeRow && slots.xDataKey ? String(activeRow[slots.xDataKey] ?? activeIndex) : undefined;
  const activeLabel = activeLabelRaw
    ? slots.xTickFormatter
      ? slots.xTickFormatter(activeLabelRaw, activeIndex ?? 0)
      : activeLabelRaw
    : undefined;

  const tooltipRows = useMemo(() => {
    if (!activeRow) return [];
    return visibleAreas.map((area) => {
      const rawValue = Number(activeRow[area.dataKey]) || 0;
      const mappingEntry = dataColorMapping[area.dataKey];
      const isCustomColor = Boolean(mappingEntry?.isCustomColor);
      const swatchToken = isCustomColor
        ? getHighestColorInRange({ colorToken: mappingEntry.colorToken })
        : mappingEntry?.colorToken;
      const swatchColor = swatchToken ? getIn(theme.colors, swatchToken) : tickColor;
      let displayValue = String(rawValue);
      let label = area.name ?? area.dataKey;
      const formatter = slots.tooltipFormatter;
      if (formatter) {
        // Recharts' formatter signature is (value, name, item, index, payload)
        // => string | [value, name]. Honor either shape on native.
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = (formatter as any)(
            rawValue,
            area.dataKey,
            undefined,
            activeIndex,
            activeRow,
          );
          if (Array.isArray(formatted)) {
            if (formatted[0] !== undefined && formatted[0] !== null) {
              displayValue = String(formatted[0]);
            }
            if (formatted[1] !== undefined && formatted[1] !== null) {
              label = String(formatted[1]);
            }
          } else if (formatted !== undefined && formatted !== null) {
            displayValue = String(formatted);
          }
        } catch {
          // Formatter threw — fall back to the raw value silently.
        }
      }
      return { key: area.dataKey, color: swatchColor, displayValue, label };
    });
  }, [
    activeRow,
    visibleAreas,
    dataColorMapping,
    theme.colors,
    tickColor,
    slots.tooltipFormatter,
    activeIndex,
  ]);

  const legendAreas = allAreas.filter((area) => area.showLegend);

  const tooltipLeft = Math.max(
    padding.left,
    Math.min(
      Math.max(padding.left, size.width - TOOLTIP_WIDTH - padding.right),
      padding.left + xAt(activeIndex ?? 0) - TOOLTIP_WIDTH / 2,
    ),
  );

  return (
    <CommonChartComponentsContext.Provider
      value={{
        chartName: 'area',
        dataColorMapping,
        secondaryLabelMap,
        dataLength: data?.length,
        selectedDataKeys: selectedKeys,
        setSelectedDataKeys: (keys: string[]) => setSelectedKeys(() => keys),
      }}
    >
      <BaseBox
        {...metaAttribute({ name: 'chart-area-container', testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        {...restProps}
      >
        <View
          testID={testID ? `${testID}-scrub-surface` : 'chart-area-scrub-surface'}
          style={{ flex: 1, width: '100%' }}
          onLayout={onLayout}
          onStartShouldSetResponder={() => count > 0}
          onMoveShouldSetResponder={(e) => {
            if (count === 0) return false;
            const start = touchStartLocationRef.current;
            if (!start) return true;
            const dx = Math.abs(e.nativeEvent.locationX - start.x);
            const dy = Math.abs(e.nativeEvent.locationY - start.y);
            return dx >= SCRUB_MOVE_THRESHOLD && dx > dy;
          }}
          onResponderGrant={handleScrubStart}
          onResponderMove={handleScrubMove}
          onResponderRelease={handleScrubEnd}
          onResponderTerminate={handleScrubTerminate}
        >
          {data.length === 0 ? (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="spacing.6"
            >
              <Text size="small" color="surface.text.gray.muted">
                No data to display
              </Text>
            </Box>
          ) : size.width > 0 && size.height > 0 ? (
            <Svg width={size.width} height={size.height}>
              <Defs>
                {areaGeometries.map(({ area, gradientId }) => {
                  const mappingEntry = dataColorMapping[area.dataKey];
                  const gradientToken = getHighestColorInRange({
                    colorToken:
                      mappingEntry?.colorToken ?? 'data.background.categorical.blue.moderate',
                    followIntensityMapping: true,
                  });
                  const gradientColor = getIn(theme.colors, gradientToken);
                  return (
                    <LinearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <Stop
                        offset="5%"
                        stopColor={gradientColor}
                        stopOpacity={isDarkMode ? 0.28 : 1}
                      />
                      <Stop
                        offset="95%"
                        stopColor={gradientColor}
                        stopOpacity={isDarkMode ? 0.12 : 0.32}
                      />
                    </LinearGradient>
                  );
                })}
                <ClipPath id={`${chartId}-reveal`}>
                  <AnimatedRect
                    x={0}
                    y={0}
                    width={plotWidth}
                    height={plotHeight}
                    animatedProps={clipAnimatedProps}
                  />
                </ClipPath>
              </Defs>

              <G x={padding.left} y={padding.top}>
                {slots.hasGrid &&
                  yTicks.map((tick, idx) => {
                    const y = yAt(tick);
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
                      const y = yAt(tick);
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

                {/* All area shapes are revealed left→right by the animated clip. */}
                <G clipPath={`url(#${chartId}-reveal)`}>
                  {areaGeometries.map(({ area, points, gradientId, strokeColor }) => (
                    <AreaSeries
                      key={`area-${area.dataKey}`}
                      points={points}
                      type={area.type}
                      connectNulls={area.connectNulls}
                      gradientId={gradientId}
                      strokeColor={strokeColor}
                      dotColor={strokeColor}
                      showDot={area.dot}
                      showActiveDot={area.activeDot}
                      activeIndex={activeIndex}
                      scrubProgress={scrubProgress}
                      activeRingColor={activeRingColor}
                    />
                  ))}
                </G>

                {slots.referenceLines.map((line, idx) => {
                  const REF_LABEL_MAX_WIDTH = 200;
                  const chipWidth = line.label
                    ? Math.min(REF_LABEL_MAX_WIDTH, Math.max(40, line.label.length * 6 + 16))
                    : 0;
                  const chipHeight = 30;
                  const truncatedLabel =
                    line.label && line.label.length * 6 + 16 > REF_LABEL_MAX_WIDTH
                      ? line.label.slice(0, Math.floor((REF_LABEL_MAX_WIDTH - 16) / 6) - 1) + '…'
                      : line.label;
                  if (line.orientation === 'horizontal') {
                    const value = Number(line.value);
                    if (value > yMax || value < 0) return null;
                    const y = yAt(value);
                    return (
                      <G key={`refline-${idx}`}>
                        <Line
                          x1={0}
                          x2={plotWidth}
                          y1={y}
                          y2={y}
                          stroke={referenceColor}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                        {line.label ? (
                          <>
                            {/* Pill sits at the END of the line (right edge flush)
                                and is vertically centered on the line — matches web. */}
                            <Rect
                              x={plotWidth - chipWidth}
                              y={y - chipHeight / 2}
                              width={chipWidth}
                              height={chipHeight}
                              rx={theme.border.radius.medium}
                              fill={referenceLabelFill}
                              stroke={referenceLabelStroke}
                              strokeWidth={1}
                            />
                            <SvgText
                              x={plotWidth - chipWidth / 2}
                              y={y + TICK_FONT_SIZE / 3}
                              fontSize={TICK_FONT_SIZE}
                              fontWeight={theme.typography.fonts.weight.medium}
                              fill={referenceLabelTextColor}
                              textAnchor="middle"
                            >
                              {truncatedLabel}
                            </SvgText>
                          </>
                        ) : null}
                      </G>
                    );
                  }
                  // Vertical reference line — match by category value or index.
                  let matchIndex = data.findIndex(
                    (row) => slots.xDataKey && String(row[slots.xDataKey]) === String(line.value),
                  );
                  if (matchIndex < 0 && isNumber(Number(line.value))) {
                    const numeric = Number(line.value);
                    if (numeric >= 0 && numeric < count) matchIndex = numeric;
                  }
                  if (matchIndex < 0) return null;
                  const px = xAt(matchIndex);
                  return (
                    <G key={`refline-${idx}`}>
                      <Line
                        x1={px}
                        x2={px}
                        y1={0}
                        y2={plotHeight}
                        stroke={referenceColor}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                      {line.label ? (
                        <>
                          {/* Pill sits at the top END of the line, centered on the
                              line's x (clamped to the plot) — matches web. */}
                          <Rect
                            x={Math.max(0, Math.min(px - chipWidth / 2, plotWidth - chipWidth))}
                            y={0}
                            width={chipWidth}
                            height={chipHeight}
                            rx={theme.border.radius.medium}
                            fill={referenceLabelFill}
                            stroke={referenceLabelStroke}
                            strokeWidth={1}
                          />
                          <SvgText
                            x={
                              Math.max(0, Math.min(px - chipWidth / 2, plotWidth - chipWidth)) +
                              chipWidth / 2
                            }
                            y={chipHeight / 2 + TICK_FONT_SIZE / 3}
                            fontSize={TICK_FONT_SIZE}
                            fontWeight={theme.typography.fonts.weight.medium}
                            fill={referenceLabelTextColor}
                            textAnchor="middle"
                          >
                            {truncatedLabel}
                          </SvgText>
                        </>
                      ) : null}
                    </G>
                  );
                })}

                {/* Active cursor column (finger-scrub hover equivalent). */}
                {activeIndex !== undefined ? (
                  <Line
                    x1={xAt(activeIndex)}
                    x2={xAt(activeIndex)}
                    y1={0}
                    y2={plotHeight}
                    stroke={cursorColor}
                    strokeWidth={1}
                  />
                ) : null}

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
                    {data.map((row, i) => {
                      if (i % xLabelStep !== 0) return null;
                      const cx = xAt(i);
                      const rawLabel = slots.xDataKey
                        ? String(row[slots.xDataKey] ?? '')
                        : String(i);
                      const label = slots.xTickFormatter
                        ? slots.xTickFormatter(rawLabel, i)
                        : rawLabel;
                      const secondary = secondaryLabelMap?.[i];
                      const isLastVisibleTick = (() => {
                        for (let j = data.length - 1; j >= 0; j--) {
                          if (j % xLabelStep === 0) return j === i;
                        }
                        return false;
                      })();
                      const tickTextAnchor =
                        i === 0 ? 'start' : isLastVisibleTick ? 'end' : 'middle';
                      return (
                        <G key={`xtick-${i}`}>
                          <SvgText
                            x={cx}
                            y={plotHeight + TICK_FONT_SIZE + 4}
                            fontSize={TICK_FONT_SIZE}
                            fill={tickColor}
                            textAnchor={tickTextAnchor}
                          >
                            {label}
                          </SvgText>
                          {secondary !== undefined && secondary !== null ? (
                            <SvgText
                              x={cx}
                              y={plotHeight + TICK_FONT_SIZE + 4 + SECONDARY_LABEL_FONT_SIZE + 2}
                              fontSize={SECONDARY_LABEL_FONT_SIZE}
                              fill={tickColor}
                              textAnchor={tickTextAnchor}
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
            </Svg>
          ) : null}

          {slots.hasTooltip &&
          activeIndex !== undefined &&
          tooltipRows.length > 0 &&
          size.width > 0 ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: padding.top,
                left: tooltipLeft,
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
              }}
            >
              {activeLabel ? (
                <Box paddingBottom="spacing.2">
                  <Text size="small" weight="semibold" color="surface.text.staticWhite.normal">
                    {activeLabel}
                  </Text>
                </Box>
              ) : null}
              {tooltipRows.map((row) => (
                <Box
                  key={row.key}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  paddingY="spacing.1"
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: row.color,
                      marginRight: theme.spacing[2],
                    }}
                  />
                  <Box flex={1}>
                    <Text size="xsmall" color="surface.text.staticWhite.normal">
                      {row.label}
                    </Text>
                  </Box>
                  <Text size="xsmall" weight="semibold" color="surface.text.staticWhite.normal">
                    {row.displayValue}
                  </Text>
                </Box>
              ))}
            </View>
          ) : null}
        </View>

        {slots.legend.hasLegend && legendAreas.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: theme.spacing[2],
            }}
          >
            {legendAreas.map((area) => {
              const mappingEntry = dataColorMapping[area.dataKey];
              const swatchToken = mappingEntry?.isCustomColor
                ? getHighestColorInRange({ colorToken: mappingEntry.colorToken })
                : mappingEntry?.colorToken;
              const swatchColor = swatchToken ? getIn(theme.colors, swatchToken) : tickColor;
              const isSelected = selectedKeys.includes(area.dataKey);
              return (
                <Pressable
                  key={`legend-${area.dataKey}`}
                  onPress={() => handleLegendToggle(area.dataKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`${area.name ?? area.dataKey}, ${
                    isSelected ? 'selected' : 'deselected'
                  }`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: theme.spacing[3],
                    marginVertical: theme.spacing[1],
                    opacity: isSelected ? 1 : 0.4,
                  }}
                  {...metaAttribute({ name: `chart-legend-item-${area.dataKey}` })}
                >
                  <View
                    style={{
                      width: LEGEND_SWATCH_SIZE,
                      height: LEGEND_SWATCH_SIZE,
                      borderRadius: theme.border.radius['2xsmall'],
                      backgroundColor: swatchColor,
                      marginRight: theme.spacing[2],
                    }}
                  />
                  <Text
                    size="xsmall"
                    color="surface.text.gray.muted"
                    textDecorationLine={isSelected ? 'none' : 'line-through'}
                  >
                    {area.name ?? area.dataKey}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
