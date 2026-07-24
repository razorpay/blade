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
import { monotoneInterpolate } from '../utils/nullBridgeUtils';
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
import { logger } from '~utils/logger';
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
// Gap between the primary tick baseline and the secondary tick baseline (own row).
const PRIMARY_TO_SECONDARY_GAP = 8;
// Horizontal breathing room reserved around each x-tick label.
const X_TICK_LABEL_GAP = 8;
// Line height between wrapped x-label rows.
const TICK_LINE_HEIGHT = TICK_FONT_SIZE + 2;
// Cap wrapped label rows so a very long label can't consume the whole chart.
const MAX_TICK_LABEL_LINES = 3;
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
  connectNullsStyle: 'solid' | 'dashed';
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
  layout?: 'horizontal' | 'vertical';
  align?: 'left' | 'right';
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
  yDomain?: [number | string, number | string];
  yTickFormatter?: (value: number) => string;
  yTickCount?: number;
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
      if (props.dataKey == null) return;
      slots.areas.push({
        dataKey: String(props.dataKey),
        name: props.name,
        color: props.color,
        stackId: props.stackId != null ? String(props.stackId) : '1',
        type: props.type ?? 'monotone',
        connectNulls: Boolean(props.connectNulls),
        connectNullsStyle: props.connectNullsStyle === 'dashed' ? 'dashed' : 'solid',
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
      if (Array.isArray(props.domain) && props.domain.length === 2) {
        slots.yDomain = [props.domain[0], props.domain[1]];
      }
      if (typeof props.tickFormatter === 'function') {
        slots.yTickFormatter = props.tickFormatter as (value: number) => string;
      }
      if (typeof props.tickCount === 'number') {
        slots.yTickCount = props.tickCount;
      }
    } else if (id === commonComponentIds.chartLegend) {
      const props = child.props as ChartLegendProps;
      slots.legend = {
        hasLegend: true,
        selectedDataKeys: props.selectedDataKeys,
        defaultSelectedDataKeys: props.defaultSelectedDataKeys,
        onSelectedDataKeysChange: props.onSelectedDataKeysChange,
        layout: props.layout,
        align: props.align,
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

const niceFloor = (raw: number): number => {
  if (raw >= 0) return 0;
  const abs = Math.abs(raw);
  const exponent = Math.floor(Math.log10(abs));
  const fraction = abs / 10 ** exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return -(niceFraction * 10 ** exponent);
};

/** Parse a chart cell to a finite number, or null when the value is missing/invalid. */
const toNullableNumber = (raw: unknown): number | null => {
  if (raw === null || raw === undefined) return null;
  const value = Number(raw);
  return Number.isNaN(value) || !isFinite(value) ? null : value;
};

const MISSING_TOOLTIP_VALUE = '—';

const formatYTick = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  return String(value);
};

/** Estimate rendered label width including a comfort gap, so ticks thin before they kiss. */
const estimateTickLabelWidth = (label: string, fontSize: number): number =>
  Math.max(1, label.length) * fontSize * 0.6 + X_TICK_LABEL_GAP;

/**
 * Word-wrap a label into lines that each fit `maxWidth`, so every category can be
 * shown without dropping labels (mirrors web wrapping). A word longer than a line
 * is hard-broken so it can never overflow its column and overlap a neighbour.
 * Beyond `MAX_TICK_LABEL_LINES` the last line is ellipsised to bound height.
 */
const wrapLabelToLines = (label: string, maxWidth: number, fontSize: number): string[] => {
  const text = String(label).trim();
  if (!text) return [''];
  if (maxWidth <= 0) return [text];

  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * 0.6)));
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  const flush = (): void => {
    if (current) {
      lines.push(current);
      current = '';
    }
  };

  words.forEach((word) => {
    let remaining = word;
    while (remaining.length > maxChars) {
      flush();
      lines.push(remaining.slice(0, maxChars));
      remaining = remaining.slice(maxChars);
    }
    if (!current) {
      current = remaining;
    } else if (current.length + 1 + remaining.length <= maxChars) {
      current = `${current} ${remaining}`;
    } else {
      flush();
      current = remaining;
    }
  });
  flush();

  if (lines.length > MAX_TICK_LABEL_LINES) {
    const kept = lines.slice(0, MAX_TICK_LABEL_LINES);
    const lastIndex = MAX_TICK_LABEL_LINES - 1;
    const last = kept[lastIndex];
    kept[lastIndex] = `${last.slice(0, Math.max(1, maxChars - 1))}…`;
    return kept;
  }
  return lines;
};

/**
 * Pick x-tick indices that do not overlap. The fit check is anchor-aware: the
 * first tick is start-anchored (extends fully to its right), the last tick is
 * end-anchored (extends fully to its left), and every inner tick is centered.
 * Prefers keeping first + last when both fit, then greedily fills the middle.
 */
const selectNonOverlappingXTickIndices = (
  pointCount: number,
  widths: number[],
  xForIndex: (index: number) => number,
  forcedStep?: number,
): number[] => {
  if (pointCount <= 0) return [];
  if (pointCount === 1) return [0];

  const rightExtent = (i: number): number => xForIndex(i) + (i === 0 ? widths[i] : widths[i] / 2);
  const leftExtent = (i: number): number =>
    xForIndex(i) - (i === pointCount - 1 ? widths[i] : widths[i] / 2);
  const fitsAfter = (prev: number, next: number): boolean => leftExtent(next) >= rightExtent(prev);

  if (forcedStep !== undefined) {
    const step = Math.max(1, forcedStep);
    const indices: number[] = [];
    for (let i = 0; i < pointCount; i += step) {
      indices.push(i);
    }
    const last = pointCount - 1;
    if (indices[indices.length - 1] !== last && fitsAfter(indices[indices.length - 1], last)) {
      indices.push(last);
    }
    return indices;
  }

  const first = 0;
  const last = pointCount - 1;
  const firstLastFit = fitsAfter(first, last);
  const selected: number[] = [first];

  if (firstLastFit) {
    let prev = first;
    for (let i = 1; i < last; i++) {
      if (fitsAfter(prev, i) && fitsAfter(i, last)) {
        selected.push(i);
        prev = i;
      }
    }
    selected.push(last);
    return selected;
  }

  let prev = first;
  for (let i = 1; i < pointCount; i++) {
    if (fitsAfter(prev, i)) {
      selected.push(i);
      prev = i;
    }
  }
  return selected;
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

// Dash pattern used for the line drawn across null points on a dashed bridge.
const NULL_BRIDGE_DASHARRAY = '5 5';

type AreaSeriesProps = {
  points: SeriesPoint[];
  type: CurveType;
  connectNulls: boolean;
  connectNullsStyle: 'solid' | 'dashed';
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
  connectNullsStyle,
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

  // The area is always split at null points so there's never a fill under the no-data stretch. When
  // a bridge is requested, a stroke-only line is drawn across each gap — solid or dashed per
  // `connectNullsStyle`.
  const isDashedBridge = connectNulls && connectNullsStyle === 'dashed';

  const segments: SeriesPoint[][] = [];
  {
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

  // For a bridge, draw a stroke-only line across each interior gap, densely sampled onto the
  // monotone spline through all real points so it follows the same curve as the flanking area line.
  const bridgePaths: string[] = [];
  if (connectNulls && segments.length > 1) {
    const definedTop = points.filter((p) => !p.isNull);
    const xs = definedTop.map((p) => p.x);
    const ys = definedTop.map((p) => p.yTop);
    for (let i = 0; i < segments.length - 1; i++) {
      const from = segments[i][segments[i].length - 1];
      const to = segments[i + 1][0];
      const sampleCount = Math.max(2, Math.round(Math.abs(to.x - from.x) / 3));
      let bridgeD = `M ${from.x} ${from.yTop}`;
      for (let step = 1; step <= sampleCount; step++) {
        const t = step / sampleCount;
        const x = from.x + (to.x - from.x) * t;
        const y = monotoneInterpolate(xs, ys, x);
        bridgeD += ` L ${x} ${y}`;
      }
      bridgePaths.push(bridgeD);
    }
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
              <AnimatedPath d={fillD} fill={`url(#${gradientId})`} animatedProps={animatedProps} />
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

      {bridgePaths.map((bridgeD, bridgeIndex) => (
        <Path
          key={`null-bridge-${bridgeIndex}`}
          testID="area-null-bridge"
          d={bridgeD}
          stroke={strokeColor}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={isDashedBridge ? NULL_BRIDGE_DASHARRAY : undefined}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

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

  const yAxisWarnedRef = useRef(false);
  useEffect(() => {
    if (!__DEV__) return;
    if (slots.hasYAxis && !yAxisWarnedRef.current) {
      const unsupported: string[] = [];
      if (slots.yDomain && !slots.yDomain.every((v) => isNumber(Number(v)))) {
        unsupported.push('domain (non-numeric)');
      }
      if (unsupported.length > 0) {
        yAxisWarnedRef.current = true;
        logger({
          type: 'warn',
          moduleName: 'ChartAreaWrapper',
          message: `ChartYAxis prop(s) [${unsupported.join(
            ', ',
          )}] are not fully supported on native. Supported: label, domain (numeric), tickFormatter, tickCount.`,
        });
      }
    }
  }, [slots.hasYAxis, slots.yDomain]);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'area',
    chartDataIndicators: allAreas.length,
  });

  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: Record<string, { colorToken?: ChartColorToken; isCustomColor: boolean }> = {};
    allAreas.forEach((area) => {
      mapping[area.dataKey] = {
        colorToken: area.color,
        isCustomColor: Boolean(area.color),
      };
    });
    assignDataColorMapping(mapping, themeColors);
    return mapping as DataColorMapping;
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
    () => allAreas.filter((area) => !area.hide && selectedKeys.includes(area.dataKey)),
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

  const { dataMax, dataMin } = useMemo(() => {
    if (!data.length) return { dataMax: 0, dataMin: 0 };
    let max = 0;
    let min = 0;
    data.forEach((row) => {
      stackGroups.forEach((group) => {
        const sum = group.areas.reduce((acc, area) => acc + (Number(row[area.dataKey]) || 0), 0);
        if (sum > max) max = sum;
        if (sum < min) min = sum;
      });
    });
    return { dataMax: max, dataMin: min };
  }, [data, stackGroups]);

  const yMax = slots.yDomain ? Number(slots.yDomain[1]) : niceCeil(dataMax);
  const yMin = slots.yDomain ? Number(slots.yDomain[0]) : dataMin < 0 ? niceFloor(dataMin) : 0;
  const yRange = yMax - yMin;
  const yTickCount = slots.yTickCount ?? Y_TICK_COUNT;
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = 0; i <= yTickCount; i++) {
      ticks.push(yMin + (yRange / yTickCount) * i);
    }
    return ticks;
  }, [yMin, yRange, yTickCount]);

  const showAxes = slots.hasXAxis || slots.hasYAxis;
  const hasSecondaryXLabels = Boolean(slots.xSecondaryDataKey);
  // Secondary labels need their own row even when there is no axis title.
  const secondaryRowHeight = hasSecondaryXLabels
    ? SECONDARY_LABEL_FONT_SIZE + PRIMARY_TO_SECONDARY_GAP
    : 0;
  const xAxisTitleHeight = slots.xLabel ? AXIS_LABEL_FONT_SIZE + X_AXIS_TITLE_GAP : 0;

  const count = data.length;
  // Width available under one x-tick before it collides with its neighbour. Left/
  // right padding is fixed (PLOT_PADDING), so this is stable regardless of the
  // wrap-driven bottom padding computed just below.
  const plotWidthForLabels = Math.max(0, size.width - PLOT_PADDING.left - PLOT_PADDING.right);
  const columnWidth = count > 1 ? plotWidthForLabels / (count - 1) : plotWidthForLabels;

  // Resolve every x-label up front so we can measure density and wrap long labels
  // across lines instead of dropping them — matches web.
  const xLabels = useMemo(() => {
    return data.map((row, index) => {
      const rawLabel = slots.xDataKey ? String(row[slots.xDataKey] ?? '') : String(index);
      return slots.xTickFormatter ? slots.xTickFormatter(rawLabel, index) : rawLabel;
    });
  }, [data, slots.xDataKey, slots.xTickFormatter]);

  // Wrap each label to fit its column so all categories can be shown at once.
  // Budget ~60% of a column per label: the first/last ticks are edge-anchored, so
  // their full width sits to one side of their point and must clear the centered
  // neighbour (needs widestLine <= ~2/3 of a column). Wrapping to this budget keeps
  // every category visible instead of thinning some out. When a column is too tight
  // to wrap usefully (budget <= 0) we fall back to the raw label + density thinning.
  const xLabelLines = useMemo(() => {
    const maxWidth = Math.max(0, columnWidth * 0.6 - X_TICK_LABEL_GAP);
    return xLabels.map((label) => wrapLabelToLines(label, maxWidth, TICK_FONT_SIZE));
  }, [xLabels, columnWidth]);

  const maxXLabelLines = useMemo(
    () => xLabelLines.reduce((max, lines) => Math.max(max, lines.length), 1),
    [xLabelLines],
  );

  const primaryLabelRowHeight = maxXLabelLines * TICK_LINE_HEIGHT;
  const padding = showAxes
    ? {
        ...PLOT_PADDING,
        bottom: Math.max(
          PLOT_PADDING.bottom,
          primaryLabelRowHeight + 4 + secondaryRowHeight + xAxisTitleHeight + 4,
        ),
      }
    : { top: 0, right: 0, bottom: 0, left: 0 };

  const plotWidth = Math.max(0, size.width - padding.left - padding.right);
  const plotHeight = Math.max(0, size.height - padding.top - padding.bottom);

  const pointStep = count > 1 ? plotWidth / (count - 1) : 0;
  const xAt = (i: number): number => (count > 1 ? i * pointStep : plotWidth / 2);
  const yAt = (value: number): number =>
    yRange > 0 ? plotHeight - ((value - yMin) / yRange) * plotHeight : plotHeight;

  // Visible tick indices: after wrapping, each label's effective width is its
  // widest line, so most fit and are shown. Thinning kicks in only when labels
  // would still overlap. An explicit `interval` still wins.
  const visibleXTickIndices = useMemo(() => {
    if (count <= 0) return [] as number[];
    const widths = xLabelLines.map((lines, index) => {
      const primaryWidth = lines.reduce(
        (max, line) => Math.max(max, estimateTickLabelWidth(line, TICK_FONT_SIZE)),
        0,
      );
      const secondary = secondaryLabelMap?.[index];
      const secondaryWidth =
        secondary !== undefined && secondary !== null
          ? estimateTickLabelWidth(String(secondary), SECONDARY_LABEL_FONT_SIZE)
          : 0;
      return Math.max(primaryWidth, secondaryWidth);
    });
    const forcedStep = slots.xInterval !== undefined ? Math.max(1, slots.xInterval + 1) : undefined;
    return selectNonOverlappingXTickIndices(count, widths, xAt, forcedStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- xAt is a stable closure over values already in deps
  }, [count, pointStep, plotWidth, xLabelLines, secondaryLabelMap, slots.xInterval]);

  const visibleXTickIndexSet = useMemo(() => new Set(visibleXTickIndices), [visibleXTickIndices]);

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
  }, [
    stackGroups,
    data,
    count,
    plotWidth,
    plotHeight,
    yMax,
    yMin,
    yRange,
    dataColorMapping,
    theme.colors,
  ]);

  // Fire the recharts-style left→right clip reveal when data/series change, and
  // once plotWidth is known after layout. Skip re-animating on pure resize.
  const revealProgress = useSharedValue(0);
  const lastRevealKeyRef = useRef<string | undefined>(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- revealProgress and theme.motion are stable refs
  useEffect(() => {
    if (count === 0 || plotWidth <= 0) {
      // Allow a fresh reveal after empty → loaded (or before first layout).
      if (count === 0) {
        lastRevealKeyRef.current = undefined;
      }
      return;
    }

    const revealKey = `${count}:${visibleAreas.length}`;
    if (lastRevealKeyRef.current === revealKey) {
      // Same data set; plotWidth may have changed via resize — stay fully revealed.
      revealProgress.value = 1;
      return;
    }

    lastRevealKeyRef.current = revealKey;
    revealProgress.value = 0;
    revealProgress.value = withDelay(
      getIn(theme.motion, 'delay.gentle'),
      withTiming(1, {
        duration: getIn(theme.motion, 'duration.xgentle'),
        easing: getIn(theme.motion, 'easing.entrance'),
      }),
    );
  }, [count, visibleAreas.length, plotWidth]);

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

  // Touch model:
  // - Do NOT claim responder on touch start, so parent ScrollViews can keep vertical scroll.
  // - Claim on move only after a clearly horizontal scrub past SCRUB_MOVE_THRESHOLD.
  // - Taps are handled via onTouchEnd (never become responder) — show/toggle tooltip.
  const touchStartActiveRef = React.useRef<number | undefined>(undefined);
  const touchStartIndexRef = React.useRef<number | undefined>(undefined);
  const touchMovedRef = React.useRef(false);
  const becameResponderRef = React.useRef(false);
  const touchStartLocationRef = React.useRef<{ x: number; y: number } | undefined>(undefined);
  const SCRUB_MOVE_THRESHOLD = 8;

  const handleTouchStart = (e: GestureResponderEvent): void => {
    if (count === 0) return;
    const next = indexAtX(e.nativeEvent.locationX);
    touchStartActiveRef.current = activeIndex;
    touchStartIndexRef.current = next;
    touchMovedRef.current = false;
    becameResponderRef.current = false;
    touchStartLocationRef.current = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
  };

  const handleScrubGrant = (e: GestureResponderEvent): void => {
    if (count === 0) return;
    becameResponderRef.current = true;
    touchMovedRef.current = true;
    setActiveIndex(indexAtX(e.nativeEvent.locationX));
  };

  const handleScrubMove = (e: GestureResponderEvent): void => {
    if (count === 0) return;
    touchMovedRef.current = true;
    setActiveIndex(indexAtX(e.nativeEvent.locationX));
  };

  const handleTouchEnd = (): void => {
    // Scrub path already updated selection via responder handlers — leave it.
    if (becameResponderRef.current || touchMovedRef.current) return;
    if (count === 0) return;
    // Tap: toggle off if re-tapping the already-active index, otherwise select.
    if (touchStartActiveRef.current === touchStartIndexRef.current) {
      setActiveIndex(undefined);
    } else {
      setActiveIndex(touchStartIndexRef.current);
    }
  };

  const handleScrubTerminate = (): void => {
    touchMovedRef.current = false;
    becameResponderRef.current = false;
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
      const rawValue = toNullableNumber(activeRow[area.dataKey]);
      const mappingEntry = dataColorMapping[area.dataKey];
      const isCustomColor = Boolean(mappingEntry?.isCustomColor);
      const swatchToken = isCustomColor
        ? getHighestColorInRange({ colorToken: mappingEntry.colorToken })
        : mappingEntry?.colorToken;
      const swatchColor = swatchToken ? getIn(theme.colors, swatchToken) : tickColor;
      let displayValue = rawValue === null ? MISSING_TOOLTIP_VALUE : String(rawValue);
      let label = area.name ?? area.dataKey;
      const formatter = slots.tooltipFormatter;
      if (formatter) {
        // Recharts' formatter signature is (value, name, item, index, payload)
        // => string | [value, name]. Honor either shape on native.
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = (formatter as any)(
            rawValue ?? undefined,
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
        {...restProps}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <View
          testID={testID ? `${testID}-scrub-surface` : 'chart-area-scrub-surface'}
          style={{ flex: 1, width: '100%' }}
          onLayout={onLayout}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          // Intentionally omit onStartShouldSetResponder (same as returning false): claiming
          // on start blocks parent ScrollViews. Capture horizontal scrubs on move instead.
          // Do not set `() => false` — @testing-library/react-native treats that as "events
          // disabled" and fireEvent('layout') would no-op in unit tests.
          onMoveShouldSetResponder={(e) => {
            if (count === 0) return false;
            const start = touchStartLocationRef.current;
            if (!start || !e?.nativeEvent) return false;
            const dx = Math.abs(e.nativeEvent.locationX - start.x);
            const dy = Math.abs(e.nativeEvent.locationY - start.y);
            return dx >= SCRUB_MOVE_THRESHOLD && dx > dy;
          }}
          onResponderGrant={handleScrubGrant}
          onResponderMove={handleScrubMove}
          onResponderTerminationRequest={() => true}
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
                          {slots.yTickFormatter ? slots.yTickFormatter(tick) : formatYTick(tick)}
                        </SvgText>
                      );
                    })}
                    {slots.yLabel ? (
                      <SvgText
                        x={-(PLOT_PADDING.left - AXIS_LABEL_FONT_SIZE - 4)}
                        y={plotHeight / 2}
                        fontSize={AXIS_LABEL_FONT_SIZE}
                        fill={tickColor}
                        textAnchor="middle"
                        transform={`rotate(-90, ${-(
                          PLOT_PADDING.left -
                          AXIS_LABEL_FONT_SIZE -
                          4
                        )}, ${plotHeight / 2})`}
                      >
                        {slots.yLabel}
                      </SvgText>
                    ) : null}
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
                      connectNullsStyle={area.connectNullsStyle}
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
                      ? `${line.label.slice(0, Math.floor((REF_LABEL_MAX_WIDTH - 16) / 6) - 1)}…`
                      : line.label;
                  if (line.orientation === 'horizontal') {
                    const value = Number(line.value);
                    if (value > yMax || value < yMin) return null;
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
                      if (!visibleXTickIndexSet.has(i)) return null;
                      const cx = xAt(i);
                      const lines = xLabelLines[i] ?? [''];
                      const secondary = secondaryLabelMap?.[i];
                      const primaryY = plotHeight + TICK_FONT_SIZE + 4;
                      // First/last anchor to their inner edge so wide labels don't
                      // spill off the canvas; inner ticks center.
                      const tickTextAnchor = i === 0 ? 'start' : i === count - 1 ? 'end' : 'middle';
                      // Secondary sits below the tallest possible primary block so it
                      // stays on one row across all ticks.
                      const secondaryY =
                        primaryY +
                        (maxXLabelLines - 1) * TICK_LINE_HEIGHT +
                        SECONDARY_LABEL_FONT_SIZE +
                        PRIMARY_TO_SECONDARY_GAP;
                      return (
                        <G key={`xtick-${i}`}>
                          {lines.map((line, lineIndex) => (
                            <SvgText
                              key={`xtick-${i}-line-${lineIndex}`}
                              x={cx}
                              y={primaryY + lineIndex * TICK_LINE_HEIGHT}
                              fontSize={TICK_FONT_SIZE}
                              fill={tickColor}
                              textAnchor={tickTextAnchor}
                            >
                              {line}
                            </SvgText>
                          ))}
                          {secondary !== undefined && secondary !== null ? (
                            <SvgText
                              x={cx}
                              y={secondaryY}
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
              flexDirection: slots.legend.layout === 'vertical' ? 'column' : 'row',
              flexWrap: slots.legend.layout === 'vertical' ? 'nowrap' : 'wrap',
              alignItems: slots.legend.layout === 'vertical' ? 'flex-start' : 'center',
              justifyContent:
                slots.legend.align === 'left'
                  ? 'flex-start'
                  : slots.legend.align === 'right'
                  ? 'flex-end'
                  : 'center',
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
