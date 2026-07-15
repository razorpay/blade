import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Svg,
  Path,
  Line,
  Circle,
  Rect,
  Text as SvgText,
  G,
  ClipPath,
  Defs,
} from 'react-native-svg';
import { Pressable, View } from 'react-native';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import {
  CommonChartComponentsContext,
  componentId as commonComponentIds,
} from '../CommonChartComponents';
import type {
  ChartXAxisProps,
  ChartYAxisProps,
  ChartReferenceLineProps,
  ChartTooltipProps,
  ChartLegendProps,
  DataColorMapping,
} from '../CommonChartComponents';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import { componentIds } from './componentIds';
import { LineChartContext } from './LineChartContext';
import type { ChartLineProps, ChartLineWrapperProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import { logger } from '~utils/logger';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import { useControllableState } from '~utils/useControllable';

// Animated SVG primitives — reanimated drives the draw-in reveal (clip width)
// and the active/inactive dimming (strokeOpacity).
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Module-level counter yields stable, collision-free ids for clip defs
// across multiple chart instances on the same screen without relying on the
// async `useId` (which is null on the first native render).
let uniqueChartCounter = 0;

// Plot padding is in raw SVG pixels because react-native-svg works in pixel
// space; it does not consume Blade's spacing tokens directly.
const PLOT_PADDING = { top: 16, right: 16, bottom: 32, left: 40 };
const Y_TICK_COUNT = 4;
const LEGEND_DOT_SIZE = 10;
const TICK_FONT_SIZE = 10;
const AXIS_LABEL_FONT_SIZE = 11;
const SECONDARY_LABEL_FONT_SIZE = 10;
const X_AXIS_TITLE_GAP = 6;
// Gap between primary tick baseline and secondary tick baseline (own vertical row).
const PRIMARY_TO_SECONDARY_GAP = 8;
const X_TICK_LABEL_GAP = 8;
// Line height between wrapped x-label rows.
const TICK_LINE_HEIGHT = TICK_FONT_SIZE + 2;
// Cap wrapped label rows so a very long label can't consume the whole chart.
const MAX_TICK_LABEL_LINES = 3;
const LINE_STROKE_WIDTH = 1.5;
const DOT_RADIUS = 3;
const ACTIVE_DOT_OUTER_RADIUS = 6;
const ACTIVE_DOT_INNER_RADIUS = 3.5;
// Opacity applied to non-hovered lines — matches web hover dim (0.2).
const DIM_OPACITY = 0.2;

/** Fixed tooltip width so wrapped labels are measured in the first layout pass. */
const TOOLTIP_WIDTH = 160;
/** Right-aligned value column so all numbers line up in a column. */
const TOOLTIP_VALUE_WIDTH = 44;

/** Rough width of a rendered string (no gap) — used for wrapping decisions. */
const estimateTextWidth = (label: string, fontSize: number): number =>
  Math.max(1, label.length) * fontSize * 0.6;

/** Estimate rendered label width; slightly aggressive so long mobile ticks thin early. */
const estimateTickLabelWidth = (label: string, fontSize: number): number =>
  Math.max(1, label.length) * fontSize * 0.72 + X_TICK_LABEL_GAP;

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
    // Hard-break words wider than a full line.
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
 * Pick x-tick indices that do not overlap under middle-anchoring.
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
      // Leave room for the reserved last tick.
      if (fitsAfter(prev, i) && fitsAfter(i, last)) {
        selected.push(i);
        prev = i;
      }
    }
    selected.push(last);
    return selected;
  }

  // First+last cannot both fit — keep first and greedily pack the rest.
  let prev = first;
  for (let i = 1; i < pointCount; i++) {
    if (fitsAfter(prev, i)) {
      selected.push(i);
      prev = i;
    }
  }
  return selected;
};

type LineType = NonNullable<ChartLineProps['type']>;
type StrokeStyle = NonNullable<ChartLineProps['strokeStyle']>;

type LineSlot = {
  dataKey: string;
  name?: string;
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  strokeStyle: StrokeStyle;
  type: LineType;
  dot: boolean;
  activeDot: boolean;
  connectNulls: boolean;
  showLegend: boolean;
  hide?: boolean;
};

type ReferenceLineSlot = {
  y?: number;
  x?: string | number;
  label?: string;
};

type TooltipFormatter = NonNullable<ChartTooltipProps['formatter']>;

type LegendSlot = {
  layout?: ChartLegendProps['layout'];
  align?: ChartLegendProps['align'];
  selectedDataKeys?: string[];
  defaultSelectedDataKeys?: string[];
  onSelectedDataKeysChange?: ChartLegendProps['onSelectedDataKeysChange'];
};

type ChildSlots = {
  lines: LineSlot[];
  hasXAxis: boolean;
  xDataKey?: string;
  xSecondaryDataKey?: string;
  xTickFormatter?: (value: string, index: number) => string;
  xInterval?: number;
  xLabel?: string;
  hasYAxis: boolean;
  yLabel?: string;
  yTickFormatter?: ChartYAxisProps['tickFormatter'];
  yDomain?: [number | string, number | string];
  yTickCount?: number;
  hasLegend: boolean;
  legend: LegendSlot;
  hasGrid: boolean;
  referenceLines: ReferenceLineSlot[];
  hasTooltip: boolean;
  tooltipFormatter?: TooltipFormatter;
  /** Recharts Tooltip `filterNull` — defaults to true (omit null/undefined rows). */
  tooltipFilterNull: boolean;
};

const readChildSlots = (children: React.ReactNode): ChildSlots => {
  const slots: ChildSlots = {
    lines: [],
    hasXAxis: false,
    hasYAxis: false,
    hasLegend: false,
    legend: {},
    hasGrid: false,
    referenceLines: [],
    hasTooltip: false,
    // Match Recharts Tooltip default: null/undefined payload entries are omitted.
    tooltipFilterNull: true,
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const id = getComponentId(child);
    if (id === componentIds.ChartLine) {
      const props = child.props as ChartLineProps;
      slots.lines.push({
        dataKey: props.dataKey as string,
        name: props.name,
        color: props.color,
        strokeStyle: props.strokeStyle ?? 'solid',
        type: props.type ?? 'monotone',
        dot: Boolean(props.dot),
        activeDot: props.activeDot !== false,
        connectNulls: Boolean(props.connectNulls),
        showLegend: props.showLegend ?? true,
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
      if (Array.isArray(props.domain) && props.domain.length === 2) {
        slots.yDomain = [props.domain[0], props.domain[1]];
      }
      slots.yTickFormatter = props.tickFormatter;
      if (typeof props.tickCount === 'number') {
        slots.yTickCount = props.tickCount;
      }
    } else if (id === commonComponentIds.chartLegend) {
      const props = child.props as ChartLegendProps;
      slots.hasLegend = true;
      slots.legend = {
        layout: props.layout,
        align: props.align,
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
      if (props.filterNull !== undefined) {
        slots.tooltipFilterNull = Boolean(props.filterNull);
      }
    } else if (id === commonComponentIds.chartReferenceLine) {
      const props = child.props as ChartReferenceLineProps;
      // Native supports BOTH horizontal (numeric `y`) and vertical (`x`)
      // reference lines — full web parity.
      slots.referenceLines.push({
        y: typeof props.y === 'number' ? props.y : undefined,
        x: props.x,
        label: typeof props.label === 'string' ? props.label : undefined,
      });
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
  return -niceCeil(-raw);
};

/** Parse a chart cell to a finite number, or null when the value is missing/invalid. */
const toNullableNumber = (raw: unknown): number | null => {
  if (raw === null || raw === undefined) return null;
  const value = Number(raw);
  return Number.isNaN(value) || !isFinite(value) ? null : value;
};

/**
 * Resolve a (possibly nested) dataKey from a row — matches Recharts/lodash-get
 * semantics so keys like `metrics.sales` work on native.
 */
const getRowValue = (row: Record<string, unknown>, dataKey: string): unknown =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIn(row as any, dataKey as any);

const getSeriesNumber = (row: Record<string, unknown>, dataKey: string): number | null =>
  toNullableNumber(getRowValue(row, dataKey));

/** Y-domain max: nice-ceil positives; clamp all-negative/zero-max to 0; keep 1 for all-zero. */
const resolveYMax = (dataMax: number): number => {
  if (dataMax > 0) return niceCeil(dataMax);
  if (dataMax < 0) return 0;
  return 1;
};

const MISSING_TOOLTIP_VALUE = '—';

const formatYTick = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  return String(value);
};

type Point = { x: number; y: number };

const buildLinearPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  return `M ${points[0].x} ${points[0].y}${points
    .slice(1)
    .map((p) => ` L ${p.x} ${p.y}`)
    .join('')}`;
};

const buildStepPath = (points: Point[], variant: 'step' | 'stepAfter' | 'stepBefore'): string => {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    if (variant === 'stepBefore') {
      d += ` L ${prev.x} ${cur.y} L ${cur.x} ${cur.y}`;
    } else if (variant === 'stepAfter') {
      d += ` L ${cur.x} ${prev.y} L ${cur.x} ${cur.y}`;
    } else {
      // `step` — step at the midpoint between points (d3 curveStep behavior).
      const midX = (prev.x + cur.x) / 2;
      d += ` L ${midX} ${prev.y} L ${midX} ${cur.y} L ${cur.x} ${cur.y}`;
    }
  }
  return d;
};

// Monotone cubic interpolation (d3 monotoneX algorithm) — matches recharts'
// default `type="monotone"` curve.
const buildMonotonePath = (points: Point[]): string => {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M ${points[0].x} ${points[0].y}`;
  if (n === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  const dxs: number[] = [];
  const ms: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    dxs.push(dx);
    ms.push(dx === 0 ? 0 : dy / dx);
  }

  const tangents: number[] = [ms[0]];
  for (let i = 0; i < dxs.length - 1; i++) {
    const m = ms[i];
    const mNext = ms[i + 1];
    if (m * mNext <= 0) {
      tangents.push(0);
    } else {
      const dx = dxs[i];
      const dxNext = dxs[i + 1];
      const common = dx + dxNext;
      tangents.push((3 * common) / ((common + dxNext) / m + (common + dx) / mNext));
    }
  }
  tangents.push(ms[ms.length - 1]);

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = (p1.x - p0.x) / 3;
    d += ` C ${p0.x + dx} ${p0.y + dx * tangents[i]} ${p1.x - dx} ${p1.y - dx * tangents[i + 1]} ${
      p1.x
    } ${p1.y}`;
  }
  return d;
};

const buildPath = (points: Point[], type: LineType): string => {
  switch (type) {
    case 'linear':
      return buildLinearPath(points);
    case 'step':
    case 'stepAfter':
    case 'stepBefore':
      return buildStepPath(points, type);
    case 'monotone':
    default:
      return buildMonotonePath(points);
  }
};

const getStrokeDasharray = (strokeStyle: StrokeStyle): string | undefined =>
  strokeStyle === 'dashed' ? '5 5' : strokeStyle === 'dotted' ? '2 2' : undefined;

type LinePoint = { x: number; y: number; value: number | null };

// Split a line's points into contiguous non-null segments. When `connectNulls`
// is true all non-null points bridge into a single segment; otherwise gaps
// break the line into multiple sub-paths (never drawn across nulls).
const buildSegments = (points: LinePoint[], connectNulls: boolean): Point[][] => {
  const definedPoints = points.filter((p): p is Point & { value: number } => p.value !== null);
  if (connectNulls) {
    return definedPoints.length > 0 ? [definedPoints.map(({ x, y }) => ({ x, y }))] : [];
  }
  const segments: Point[][] = [];
  let current: Point[] = [];
  points.forEach((p) => {
    if (p.value === null) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    } else {
      current.push({ x: p.x, y: p.y });
    }
  });
  if (current.length > 0) segments.push(current);
  return segments;
};

type LineGeometry = {
  line: LineSlot;
  color: string;
  points: LinePoint[];
};

type LineSeriesProps = {
  geometry: LineGeometry;
  index: number;
  plotWidth: number;
  plotHeight: number;
  hoveredKey: string | null;
  dataSignature: string;
  chartId: string;
};

/**
 * Renders a single line series with its own reanimated draw-in reveal and
 * active/inactive dimming. Extracted so per-line hooks (`useSharedValue`,
 * `useAnimatedProps`, `useEffect`) are always called at a stable top level and
 * never inside a `.map()` loop.
 */
const LineSeries = ({
  geometry,
  index,
  plotWidth,
  plotHeight,
  hoveredKey,
  dataSignature,
  chartId,
}: LineSeriesProps): React.ReactElement => {
  const { theme } = useTheme();
  const { line, color, points } = geometry;

  const draw = useSharedValue(0);
  const dim = useSharedValue(1);

  const duration = getIn(theme.motion, 'duration.xgentle');
  const baseDelay = getIn(theme.motion, 'delay.gentle');
  // Web: dashed/dotted lines begin later (LineChart.web.tsx:64-67).
  const beginDelay = line.strokeStyle === 'dashed' ? baseDelay + duration : baseDelay;
  const drawEasing = getIn(theme.motion, 'easing.standard');
  const dimDuration = getIn(theme.motion, 'duration.gentle');

  useEffect(() => {
    draw.value = 0;
    draw.value = withDelay(beginDelay, withTiming(1, { duration, easing: drawEasing }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, beginDelay, dataSignature]);

  useEffect(() => {
    const isOther = hoveredKey !== null && hoveredKey !== line.dataKey;
    dim.value = withTiming(isOther ? DIM_OPACITY : 1, {
      duration: dimDuration,
      // Parity with framer-motion 'easeInOut'.
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredKey, line.dataKey, dimDuration]);

  const clipProps = useAnimatedProps(() => ({ width: Math.max(0, plotWidth * draw.value) }));
  const dimProps = useAnimatedProps(() => ({ strokeOpacity: dim.value }));

  const segments = useMemo(() => buildSegments(points, line.connectNulls), [
    points,
    line.connectNulls,
  ]);
  const dash = getStrokeDasharray(line.strokeStyle);
  const clipId = `line-${chartId}-reveal-${index}`;

  return (
    <G>
      <Defs>
        <ClipPath id={clipId}>
          <AnimatedRect x={0} y={0} height={plotHeight} animatedProps={clipProps} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        {segments.map((segment, segmentIndex) => (
          <AnimatedPath
            key={`segment-${segmentIndex}`}
            testID={`line-path-${line.dataKey}`}
            d={buildPath(segment, line.type)}
            stroke={color}
            strokeWidth={LINE_STROKE_WIDTH}
            strokeDasharray={dash}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animatedProps={dimProps}
          />
        ))}
        {line.dot
          ? points.map((p, pointIndex) =>
              p.value === null ? null : (
                <Circle key={`dot-${pointIndex}`} cx={p.x} cy={p.y} r={DOT_RADIUS} fill={color} />
              ),
            )
          : null}
      </G>
    </G>
  );
};

const _ChartLine = (_props: ChartLineProps): React.ReactElement | null => {
  return null;
};

/**
 * ChartLine
 *
 * Marker component declaring a line series inside ChartLineWrapper.
 * On native this renders nothing on its own — ChartLineWrapper reads its props
 * (`dataKey`, `name`, `color`, `type`, `strokeStyle`, ...) and renders the line.
 */
const ChartLine = assignWithoutSideEffects(_ChartLine, {
  componentId: componentIds.ChartLine,
});

const ChartLineWrapper: React.FC<ChartLineWrapperProps & TestID & DataAnalyticsAttribute> = ({
  children,
  colorTheme = 'categorical',
  testID,
  data = [],
  ...restProps
}) => {
  const { theme } = useTheme();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const chartIdRef = useRef<string | undefined>(undefined);
  if (chartIdRef.current === undefined) {
    chartIdRef.current = `line-${uniqueChartCounter++}`;
  }
  const chartId = chartIdRef.current;

  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  const slots = useMemo(() => readChildSlots(children), [children]);
  const allLines = slots.lines;

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
          moduleName: 'ChartLineWrapper',
          message: `ChartYAxis prop(s) [${unsupported.join(
            ', ',
          )}] are not fully supported on native. Supported: label, domain (numeric), tickFormatter, tickCount.`,
        });
      }
    }
  }, [slots.hasYAxis, slots.yDomain]);

  const themeColors = useChartsColorTheme({
    colorTheme,
    chartName: 'line',
    chartDataIndicators: allLines.length,
  });

  // Build the color mapping from ALL lines (not just visible) so hidden lines
  // keep their color/legend entry while toggled off (web parity).
  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: Record<
      string,
      {
        colorToken?: ChartsCategoricalColorToken | ChartSequentialColorToken;
        isCustomColor: boolean;
      }
    > = {};
    allLines.forEach((line) => {
      mapping[line.dataKey] = {
        colorToken: line.color,
        isCustomColor: Boolean(line.color),
      };
    });
    assignDataColorMapping(mapping, themeColors);
    return mapping as DataColorMapping;
  }, [allLines, themeColors]);

  const allDataKeys = useMemo(() => Object.keys(dataColorMapping), [dataColorMapping]);

  // Mirror web legend selection semantics exactly (controlled + uncontrolled).
  const [selectedKeys, setSelectedKeys] = useControllableState<string[]>({
    value: slots.legend.selectedDataKeys,
    defaultValue: slots.legend.defaultSelectedDataKeys ?? allDataKeys,
  });

  const hasUserInteractedRef = React.useRef(false);
  const isControlled = slots.legend.selectedDataKeys !== undefined;
  const shouldAutoSelectAllDataKeys =
    !isControlled && slots.legend.defaultSelectedDataKeys === undefined;

  // Uncontrolled auto-select-all — port of CommonChartComponents.web.tsx:712-724.
  useEffect(() => {
    if (!shouldAutoSelectAllDataKeys || hasUserInteractedRef.current || allDataKeys.length === 0) {
      return;
    }
    const isInSync =
      selectedKeys.length === allDataKeys.length &&
      allDataKeys.every((dataKey) => selectedKeys.includes(dataKey));
    if (!isInSync) {
      setSelectedKeys(() => [...allDataKeys], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDataKeys, selectedKeys, shouldAutoSelectAllDataKeys]);

  // Reset selection when the data keys fully change — port of web:728-736.
  useEffect(() => {
    if (allDataKeys.length > 0 && selectedKeys.length > 0) {
      const hasOverlap = selectedKeys.some((key) => allDataKeys.includes(key));
      if (!hasOverlap) {
        setSelectedKeys(() => [...allDataKeys]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDataKeys, selectedKeys]);

  const isVisible = (dataKey: string): boolean => selectedKeys.includes(dataKey);

  const toggleLegend = (dataKey: string): void => {
    hasUserInteractedRef.current = true;
    const next = selectedKeys.includes(dataKey)
      ? selectedKeys.filter((k) => k !== dataKey)
      : [...selectedKeys, dataKey];
    setSelectedKeys(() => next);
    slots.legend.onSelectedDataKeysChange?.({ dataKey, selectedKeysArray: next });
  };

  const visibleLines = useMemo(() => allLines.filter((l) => isVisible(l.dataKey) && !l.hide), [
    allLines,
    selectedKeys,
  ]);

  const secondaryLabelMap = useMemo(() => {
    if (!slots.xSecondaryDataKey || !data?.length) return undefined;
    const map: Record<number, string | number | undefined> = {};
    data.forEach((row, index) => {
      map[index] = getRowValue(row, slots.xSecondaryDataKey!) as string | number | undefined;
    });
    return map;
  }, [data, slots.xSecondaryDataKey]);

  const { dataMin, dataMax } = useMemo(() => {
    if (!data.length) return { dataMin: 0, dataMax: 0 };
    const linesForDomain = visibleLines.length ? visibleLines : allLines;
    let min = Infinity;
    let max = -Infinity;
    data.forEach((row) => {
      linesForDomain.forEach((line) => {
        // Skip null/undefined cells — Number(null) === 0 would otherwise pull the
        // domain to 0 and flatten sparse / connectNulls charts. Use path-aware
        // get so nested dataKeys like `metrics.sales` resolve (Recharts parity).
        const value = getSeriesNumber(row, line.dataKey);
        if (value === null) return;
        if (value < min) min = value;
        if (value > max) max = value;
      });
    });
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 0;
    return { dataMin: min, dataMax: max };
  }, [data, visibleLines, allLines]);

  const hasNegatives = dataMin < 0;
  const yMin = hasNegatives ? niceFloor(dataMin) : 0;
  const yMax = resolveYMax(dataMax);
  const yRange = yMax - yMin;
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = 0; i <= Y_TICK_COUNT; i++) {
      ticks.push(yMin + (yRange / Y_TICK_COUNT) * i);
    }
    return ticks;
  }, [yMin, yRange]);

  const showAxes = slots.hasXAxis || slots.hasYAxis;
  const hasSecondaryXLabels = Boolean(slots.xSecondaryDataKey);
  // Secondary labels need their own row even when there is no axis title.
  const secondaryRowHeight = hasSecondaryXLabels
    ? SECONDARY_LABEL_FONT_SIZE + PRIMARY_TO_SECONDARY_GAP
    : 0;
  const xAxisTitleHeight = slots.xLabel ? AXIS_LABEL_FONT_SIZE + X_AXIS_TITLE_GAP : 0;

  // Width available under one x-tick before it collides with its neighbour.
  // Left/right padding is fixed (PLOT_PADDING), so this is stable regardless of
  // the wrap-driven bottom padding computed just below.
  const plotWidthForLabels = Math.max(0, size.width - PLOT_PADDING.left - PLOT_PADDING.right);
  const pointCount = data.length;
  const columnWidth = pointCount > 1 ? plotWidthForLabels / (pointCount - 1) : plotWidthForLabels;

  // Resolve every x-label up front so we can measure density and (mobile) wrap
  // long labels across lines instead of dropping them — matches web.
  const xLabels = useMemo(() => {
    return data.map((row, index) => {
      const rawLabel = slots.xDataKey
        ? String(getRowValue(row, slots.xDataKey) ?? '')
        : String(index);
      return slots.xTickFormatter ? slots.xTickFormatter(rawLabel, index) : rawLabel;
    });
  }, [data, slots.xDataKey, slots.xTickFormatter]);

  // Wrap each label to fit its column so all categories can be shown at once.
  const xLabelLines = useMemo(() => {
    // Leave a small gutter so adjacent wrapped labels don't kiss.
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

  // Line points span the plot width over `n-1` intervals (NOT bar-style slots).
  const pointSpacing = pointCount > 1 ? plotWidth / (pointCount - 1) : 0;
  const xForIndex = (index: number): number =>
    pointCount > 1 ? index * pointSpacing : plotWidth / 2;

  // Visible tick indices: after wrapping, each label's effective width is its
  // widest line (<= column), so all fit and are shown. Thinning only kicks in
  // when even a single word overflows the column. Explicit `interval` still wins.
  const visibleXTickIndices = useMemo(() => {
    if (pointCount <= 0) return [] as number[];

    const widths = xLabelLines.map((lines, index) => {
      const primaryWidth = lines.reduce(
        (max, line) => Math.max(max, estimateTextWidth(line, TICK_FONT_SIZE)),
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

    return selectNonOverlappingXTickIndices(pointCount, widths, xForIndex, forcedStep);
  }, [pointCount, pointSpacing, plotWidth, xLabelLines, secondaryLabelMap, slots.xInterval]);

  const visibleXTickIndexSet = useMemo(() => new Set(visibleXTickIndices), [visibleXTickIndices]);

  const tickColor = getIn(theme.colors, 'surface.text.gray.muted');
  const axisLineColor = getIn(theme.colors, 'surface.border.gray.muted');
  const gridColor = getIn(theme.colors, 'surface.border.gray.subtle');

  const resolveColor = (
    dataKey: string,
    fallback?: ChartsCategoricalColorToken | ChartSequentialColorToken,
  ): string => {
    const token = dataColorMapping[dataKey]?.colorToken ?? fallback;
    return token ? getIn(theme.colors, token) : tickColor;
  };

  // Pixel geometry per visible line — shared by the line paths, the activeDot,
  // the scrub nearest-line lookup, and the tooltip.
  const lineGeometries = useMemo<LineGeometry[]>(() => {
    return visibleLines.map((line) => {
      const points: LinePoint[] = data.map((row, index) => {
        const value = getSeriesNumber(row, line.dataKey);
        return {
          x: xForIndex(index),
          y: value === null ? 0 : plotHeight - ((value - yMin) / yRange) * plotHeight,
          value,
        };
      });
      return { line, color: resolveColor(line.dataKey, line.color), points };
    });
  }, [visibleLines, data, plotWidth, plotHeight, yMin, yRange, dataColorMapping, theme.colors]);

  const dataSignature = useMemo(() => `${data.length}:${allDataKeys.join(',')}`, [
    data.length,
    allDataKeys,
  ]);

  // Map a touch's local coordinate to the nearest data index + line. Reproduces
  // every web hover side-effect (dim others + activeDot + tooltip + hoveredKey).
  // Map a touch to the nearest index + line and apply it. Returns the index so the
  // tap/scrub handlers can decide whether a release should toggle the selection off.
  const indexAtTouchX = (locationX: number): number | undefined => {
    if (pointCount === 0 || plotWidth <= 0) return undefined;
    const localX = locationX - padding.left;
    return pointCount > 1
      ? Math.min(pointCount - 1, Math.max(0, Math.round(localX / pointSpacing)))
      : 0;
  };

  const applyScrub = (e: GestureResponderEvent): number | undefined => {
    if (pointCount === 0 || plotWidth <= 0) return undefined;
    const localX = e.nativeEvent.locationX - padding.left;
    const localY = e.nativeEvent.locationY - padding.top;
    const index =
      pointCount > 1 ? Math.min(pointCount - 1, Math.max(0, Math.round(localX / pointSpacing))) : 0;
    setActiveIndex(index);

    // Nearest visible line at this index by vertical distance to the touch.
    let nearestKey: string | null = null;
    let nearestDist = Infinity;
    lineGeometries.forEach((geometry) => {
      const point = geometry.points[index];
      if (!point || point.value === null) return;
      const dist = Math.abs(point.y - localY);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestKey = geometry.line.dataKey;
      }
    });
    setHoveredKey(nearestKey);
    return index;
  };

  // Touch model (mirrors AreaChart.native.tsx):
  // - Do NOT claim responder on touch start, so parent ScrollViews can keep vertical scroll.
  // - Claim on move only after a clearly horizontal scrub past SCRUB_MOVE_THRESHOLD.
  // - Taps are handled via onTouchEnd (never become responder) — show/toggle tooltip.
  // Selection persists after the finger lifts (parity with DonutChart): a tap on
  // the already-active index toggles it off, a tap/scrub elsewhere moves it.
  const touchStartActiveRef = React.useRef<number | undefined>(undefined);
  const touchStartIndexRef = React.useRef<number | undefined>(undefined);
  const touchMovedRef = React.useRef(false);
  const becameResponderRef = React.useRef(false);
  const touchStartLocationRef = React.useRef<{ x: number; y: number } | undefined>(undefined);
  const SCRUB_MOVE_THRESHOLD = 8;

  const handleTouchStart = (e: GestureResponderEvent): void => {
    if (data.length === 0) return;
    touchStartActiveRef.current = activeIndex;
    touchStartIndexRef.current = indexAtTouchX(e.nativeEvent.locationX);
    touchMovedRef.current = false;
    becameResponderRef.current = false;
    touchStartLocationRef.current = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
  };

  const handleScrubStart = (e: GestureResponderEvent): void => {
    if (data.length === 0) return;
    becameResponderRef.current = true;
    touchMovedRef.current = true;
    applyScrub(e);
  };

  const handleScrubMove = (e: GestureResponderEvent): void => {
    touchMovedRef.current = true;
    applyScrub(e);
  };

  const handleTouchEnd = (): void => {
    if (becameResponderRef.current || touchMovedRef.current) return;
    if (data.length === 0) return;
    if (touchStartActiveRef.current === touchStartIndexRef.current) {
      setActiveIndex(undefined);
      setHoveredKey(null);
    } else if (touchStartIndexRef.current !== undefined) {
      setActiveIndex(touchStartIndexRef.current);
      const tapIndex = touchStartIndexRef.current;
      const tapY = touchStartLocationRef.current?.y;
      if (tapY !== undefined) {
        const localY = tapY - padding.top;
        let nearestKey: string | null = null;
        let nearestDist = Infinity;
        lineGeometries.forEach((geometry) => {
          const point = geometry.points[tapIndex];
          if (!point || point.value === null) return;
          const dist = Math.abs(point.y - localY);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestKey = geometry.line.dataKey;
          }
        });
        setHoveredKey(nearestKey);
      }
    }
  };

  const handleScrubTerminate = (): void => {
    becameResponderRef.current = false;
  };

  const activeRow = activeIndex !== undefined ? data[activeIndex] : undefined;
  const activeLabelRaw =
    activeRow && slots.xDataKey
      ? String(getRowValue(activeRow, slots.xDataKey) ?? activeIndex)
      : undefined;
  const activeLabel = activeLabelRaw
    ? slots.xTickFormatter
      ? slots.xTickFormatter(activeLabelRaw, activeIndex ?? 0)
      : activeLabelRaw
    : undefined;

  const tooltipRows = useMemo(() => {
    if (!activeRow) return [];
    const rows: Array<{ key: string; color: string; displayValue: string; label: string }> = [];
    visibleLines.forEach((line) => {
      const rawValue = getSeriesNumber(activeRow, line.dataKey);
      // Match Recharts Tooltip `filterNull` default (true): omit missing values.
      if (rawValue === null && slots.tooltipFilterNull) return;

      const color = resolveColor(line.dataKey, line.color);
      let displayValue = rawValue === null ? MISSING_TOOLTIP_VALUE : String(rawValue);
      let label = line.name ?? line.dataKey;
      const formatter = slots.tooltipFormatter;
      if (formatter) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = (formatter as any)(
            rawValue ?? undefined,
            line.dataKey,
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
      rows.push({ key: line.dataKey, color, displayValue, label });
    });
    return rows;
  }, [
    activeRow,
    visibleLines,
    dataColorMapping,
    theme.colors,
    slots.tooltipFormatter,
    slots.tooltipFilterNull,
    activeIndex,
  ]);

  // Lines eligible for a legend entry — include hidden ones so they can be
  // toggled back on (web parity).
  const legendLines = allLines.filter((line) => line.showLegend);

  const lineChartContextValue = useMemo(
    () => ({ hoveredDataKey: hoveredKey, setHoveredDataKey: setHoveredKey }),
    [hoveredKey],
  );

  const commonChartContextValue = useMemo(
    () => ({
      chartName: 'line' as const,
      dataColorMapping,
      selectedDataKeys: selectedKeys,
      setSelectedDataKeys: (keys: string[]) => setSelectedKeys(() => keys),
      secondaryLabelMap,
      dataLength: data?.length,
    }),
    [dataColorMapping, selectedKeys, secondaryLabelMap, data?.length],
  );

  const layoutTestID = testID ? `${testID}-layout` : undefined;

  return (
    <LineChartContext.Provider value={lineChartContextValue}>
      <CommonChartComponentsContext.Provider value={commonChartContextValue}>
        <BaseBox
          {...metaAttribute({ name: 'line-chart', testID })}
          {...makeAnalyticsAttribute(restProps)}
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          {...restProps}
        >
          {/* Single press-and-scrub surface — owns BOTH onLayout AND the touch
              responder, with the <Svg> as a DIRECT child (mirrors AreaChart). A
              nested responder view does not reliably receive touches on a real
              device, so layout + responder MUST live on the same view. */}
          <View
            testID={layoutTestID}
            // Absolute tooltip can grow taller than the plot; keep overflow visible
            // so the bubble is not clipped by the flex:1 scrub surface.
            style={{ flex: 1, width: '100%', overflow: 'visible' }}
            onLayout={onLayout}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            // Intentionally omit onStartShouldSetResponder (same as returning false): claiming
            // on start blocks parent ScrollViews. Capture horizontal scrubs on move instead.
            onMoveShouldSetResponder={(e) => {
              if (data.length === 0) return false;
              const start = touchStartLocationRef.current;
              if (!start || !e?.nativeEvent) return false;
              const dx = Math.abs(e.nativeEvent.locationX - start.x);
              const dy = Math.abs(e.nativeEvent.locationY - start.y);
              return dx >= SCRUB_MOVE_THRESHOLD && dx > dy;
            }}
            onResponderGrant={handleScrubStart}
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
              // `pointerEvents="none"` lets the touch fall through the SVG to the
              // single parent responder View so press-and-scrub reliably grants
              // on a real device (activeDot + tooltip + dimming).
              <Svg width={size.width} height={size.height} pointerEvents="none">
                <G x={padding.left} y={padding.top}>
                  {slots.hasGrid &&
                    yTicks.map((tick, idx) => {
                      const y = plotHeight - ((tick - yMin) / yRange) * plotHeight;
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
                        const y = plotHeight - ((tick - yMin) / yRange) * plotHeight;
                        return (
                          <SvgText
                            key={`ytick-${idx}`}
                            x={-6}
                            y={y + TICK_FONT_SIZE / 3}
                            fontSize={TICK_FONT_SIZE}
                            fill={tickColor}
                            textAnchor="end"
                          >
                            {slots.yTickFormatter
                              ? slots.yTickFormatter(tick, idx)
                              : formatYTick(tick)}
                          </SvgText>
                        );
                      })}
                      {slots.yLabel ? (
                        <SvgText
                          x={-(PLOT_PADDING.left - AXIS_LABEL_FONT_SIZE - 2)}
                          y={plotHeight / 2}
                          fontSize={AXIS_LABEL_FONT_SIZE}
                          fill={tickColor}
                          textAnchor="middle"
                          transform={`rotate(-90 ${-(
                            PLOT_PADDING.left -
                            AXIS_LABEL_FONT_SIZE -
                            2
                          )} ${plotHeight / 2})`}
                        >
                          {slots.yLabel}
                        </SvgText>
                      ) : null}
                    </>
                  )}

                  {lineGeometries.map((geometry, idx) => (
                    <LineSeries
                      key={`line-${geometry.line.dataKey}`}
                      geometry={geometry}
                      index={idx}
                      plotWidth={plotWidth}
                      plotHeight={plotHeight}
                      hoveredKey={hoveredKey}
                      dataSignature={dataSignature}
                      chartId={chartId}
                    />
                  ))}

                  {/* activeDot for the scrubbed line (recharts `activeDot`). */}
                  {activeIndex !== undefined && hoveredKey !== null
                    ? lineGeometries.map((geometry) => {
                        if (geometry.line.dataKey !== hoveredKey) return null;
                        if (!geometry.line.activeDot) return null;
                        const point = geometry.points[activeIndex];
                        if (!point || point.value === null) return null;
                        return (
                          <G key={`active-dot-${geometry.line.dataKey}`}>
                            <Circle
                              cx={point.x}
                              cy={point.y}
                              r={ACTIVE_DOT_OUTER_RADIUS}
                              fill={geometry.color}
                              fillOpacity={0.2}
                            />
                            <Circle
                              cx={point.x}
                              cy={point.y}
                              r={ACTIVE_DOT_INNER_RADIUS}
                              fill={geometry.color}
                              stroke={getIn(theme.colors, 'surface.background.gray.intense')}
                              strokeWidth={1.5}
                            />
                          </G>
                        );
                      })
                    : null}

                  {slots.referenceLines.map((refLine, idx) => {
                    const isVertical = refLine.x !== undefined && refLine.x !== null;
                    const stroke = getIn(theme.colors, 'data.background.categorical.gray.intense');
                    const chipFill = getIn(theme.colors, 'surface.background.gray.subtle');
                    const chipStroke = getIn(theme.colors, 'surface.border.gray.muted');
                    const chipTextColor = getIn(theme.colors, 'surface.text.gray.normal');
                    const chipWidth = refLine.label
                      ? Math.max(40, refLine.label.length * 6 + 16)
                      : 0;
                    const chipHeight = 20;

                    if (isVertical) {
                      // Resolve the x value to an index.
                      let index = -1;
                      if (slots.xDataKey) {
                        index = data.findIndex(
                          (row) => String(getRowValue(row, slots.xDataKey!)) === String(refLine.x),
                        );
                      }
                      if (index < 0 && isNumber(Number(refLine.x))) {
                        index = Number(refLine.x);
                      }
                      if (index < 0 || index > pointCount - 1) return null;
                      const x = xForIndex(index);
                      return (
                        <G key={`refline-${idx}`}>
                          <Line
                            x1={x}
                            x2={x}
                            y1={0}
                            y2={plotHeight}
                            stroke={stroke}
                            strokeWidth={2}
                            strokeDasharray="4 4"
                          />
                          {refLine.label ? (
                            <G>
                              <Rect
                                x={x - chipWidth / 2}
                                y={0}
                                width={chipWidth}
                                height={chipHeight}
                                rx={theme.border.radius.medium}
                                fill={chipFill}
                                stroke={chipStroke}
                                strokeWidth={1}
                              />
                              <SvgText
                                x={x}
                                y={chipHeight / 2 + TICK_FONT_SIZE / 3}
                                fontSize={TICK_FONT_SIZE}
                                fill={chipTextColor}
                                textAnchor="middle"
                              >
                                {refLine.label}
                              </SvgText>
                            </G>
                          ) : null}
                        </G>
                      );
                    }

                    // Horizontal (numeric y).
                    if (refLine.y === undefined || refLine.y > yMax || refLine.y < yMin)
                      return null;
                    const y = plotHeight - ((refLine.y - yMin) / yRange) * plotHeight;
                    return (
                      <G key={`refline-${idx}`}>
                        <Line
                          x1={0}
                          x2={plotWidth}
                          y1={y}
                          y2={y}
                          stroke={stroke}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                        {refLine.label ? (
                          <G>
                            {/* Pill sits at the END of the line (right edge flush)
                                and is vertically centered on the line — matches web. */}
                            <Rect
                              x={plotWidth - chipWidth}
                              y={y - chipHeight / 2}
                              width={chipWidth}
                              height={chipHeight}
                              rx={theme.border.radius.medium}
                              fill={chipFill}
                              stroke={chipStroke}
                              strokeWidth={1}
                            />
                            <SvgText
                              x={plotWidth - chipWidth / 2}
                              y={y + TICK_FONT_SIZE / 3}
                              fontSize={TICK_FONT_SIZE}
                              fill={chipTextColor}
                              textAnchor="middle"
                            >
                              {refLine.label}
                            </SvgText>
                          </G>
                        ) : null}
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
                      {data.map((row, index) => {
                        if (!visibleXTickIndexSet.has(index)) return null;
                        const cx = xForIndex(index);
                        const lines = xLabelLines[index] ?? [''];
                        const secondary = secondaryLabelMap?.[index];
                        const primaryY = plotHeight + TICK_FONT_SIZE + 4;
                        // First/last anchor to their inner edge so wide wrapped
                        // labels don't spill off the canvas; inner ticks center.
                        const anchor =
                          index === 0 ? 'start' : index === pointCount - 1 ? 'end' : 'middle';
                        // Secondary sits below the tallest possible primary block
                        // so it stays on one row across all ticks.
                        const secondaryY =
                          primaryY +
                          (maxXLabelLines - 1) * TICK_LINE_HEIGHT +
                          SECONDARY_LABEL_FONT_SIZE +
                          PRIMARY_TO_SECONDARY_GAP;
                        return (
                          <G key={`xtick-${index}`}>
                            {lines.map((line, lineIndex) => (
                              <SvgText
                                key={`xtick-${index}-line-${lineIndex}`}
                                x={cx}
                                y={primaryY + lineIndex * TICK_LINE_HEIGHT}
                                fontSize={TICK_FONT_SIZE}
                                fill={tickColor}
                                textAnchor={anchor}
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
                                textAnchor={anchor}
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
                  left: Math.max(
                    padding.left,
                    Math.min(
                      size.width - TOOLTIP_WIDTH - padding.right,
                      padding.left + xForIndex(activeIndex) - TOOLTIP_WIDTH / 2,
                    ),
                  ),
                  width: TOOLTIP_WIDTH,
                  backgroundColor: getIn(theme.colors, 'surface.icon.staticBlack.normal'),
                  borderRadius: theme.border.radius.large,
                  borderWidth: 1,
                  borderColor: getIn(theme.colors, 'surface.border.gray.muted'),
                  paddingHorizontal: theme.spacing[4],
                  paddingVertical: theme.spacing[4],
                  shadowColor: getIn(theme.colors, 'surface.icon.staticBlack.normal'),
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 4,
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
                  <View
                    key={row.key}
                    style={{
                      flexDirection: 'row',
                      // flex-start: wrapped labels must grow the row (center clipped them).
                      alignItems: 'flex-start',
                      paddingVertical: theme.spacing[1],
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        backgroundColor: row.color,
                        marginRight: theme.spacing[2],
                        marginTop: 3,
                      }}
                    />
                    <View style={{ flex: 1, marginRight: theme.spacing[2] }}>
                      <Text size="xsmall" color="surface.text.staticWhite.normal">
                        {row.label}
                      </Text>
                    </View>
                    <View style={{ width: TOOLTIP_VALUE_WIDTH }}>
                      <Text
                        size="xsmall"
                        weight="semibold"
                        color="surface.text.staticWhite.normal"
                        textAlign="right"
                      >
                        {row.displayValue}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          {/* Interactive legend — native Pressables (functionally identical to
              the web SVG legend: toggle show/hide, controllable, callback). */}
          {slots.hasLegend && legendLines.length > 0 ? (
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
                paddingTop: theme.spacing[3],
                paddingHorizontal: theme.spacing[3],
              }}
            >
              {legendLines.map((line) => {
                const selected = isVisible(line.dataKey);
                const swatchColor = selected
                  ? resolveColor(line.dataKey, line.color)
                  : getIn(theme.colors, 'surface.text.gray.muted');
                return (
                  <Pressable
                    key={`legend-${line.dataKey}`}
                    testID={`legend-${line.dataKey}`}
                    onPress={() => toggleLegend(line.dataKey)}
                    accessibilityRole="button"
                    accessibilityLabel={`${line.name ?? line.dataKey}, ${
                      selected ? 'selected' : 'deselected'
                    }`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      opacity: selected ? 1 : 0.5,
                      paddingVertical: theme.spacing[1],
                      paddingHorizontal: theme.spacing[2],
                    }}
                    {...metaAttribute({ name: `chart-legend-item-${line.dataKey}` })}
                  >
                    <View
                      style={{
                        width: LEGEND_DOT_SIZE,
                        height: LEGEND_DOT_SIZE,
                        borderRadius: theme.border.radius['2xsmall'],
                        backgroundColor: swatchColor,
                        marginRight: theme.spacing[2],
                      }}
                    />
                    <Text size="small" color="surface.text.gray.muted">
                      {line.name ?? line.dataKey}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </BaseBox>
      </CommonChartComponentsContext.Provider>
    </LineChartContext.Provider>
  );
};

export type { ChartLineProps, ChartLineWrapperProps };
export { ChartLineWrapper, ChartLine };
