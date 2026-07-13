import React, { useMemo, useState } from 'react';
import { Svg, G, Rect, Path, Text as SvgText, TSpan } from 'react-native-svg';
import { View, Pressable } from 'react-native';
import type { LayoutChangeEvent, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import type { EasingFn } from 'react-native-reanimated';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type { DataColorMapping, ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type {
  ChartSankeyWrapperProps,
  ChartSankeyProps,
  SankeyDataNode,
  SankeyDataLink,
} from './types';
import {
  componentIds,
  LABEL_CAP_HEIGHT_RATIO,
  LINK_DEFAULT_OPACITY,
  LINK_HOVER_OPACITY,
  LINK_DIMMED_OPACITY,
  NODE_DEFAULT_OPACITY,
  NODE_DIMMED_OPACITY,
  NODE_WIDTH,
  CHIP_MIN_WIDTH,
  CHIP_MAX_WIDTH,
  CHIP_VALUE_BUDGET,
  NODE_MIN_HEIGHT,
} from './tokens';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import getIn from '~utils/lodashButBetter/get';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';

// ─── Animated SVG shapes ──────────────────────────────────────────────────────
// react-native-svg primitives wrapped so react-native-reanimated can drive their
// opacity / fill-opacity — the parity replacement for the web CSS `transition`.
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// ─── Text width — high-fidelity Inter advance-width estimate ───────────────────
// RN has no synchronous canvas `measureText` (no DOM / canvas 2D context, and
// `onLayout`/`onTextLayout` are async/post-render). Node/chip layout must know
// label widths during the synchronous layout-compute pass, so we approximate with
// a per-character advance-width table for Inter (normalized to em = × fontSize).
// This is far closer than a single uniform factor; it ignores kerning pairs and
// sub-pixel hinting (a few px on long strings) which is imperceptible for chip
// sizing / wrap decisions.
const INTER_ADVANCE: Record<string, number> = {
  a: 0.55,
  b: 0.57,
  c: 0.51,
  d: 0.57,
  e: 0.55,
  f: 0.34,
  g: 0.57,
  h: 0.57,
  i: 0.24,
  j: 0.24,
  k: 0.51,
  l: 0.24,
  m: 0.87,
  n: 0.57,
  o: 0.58,
  p: 0.57,
  q: 0.57,
  r: 0.35,
  s: 0.5,
  t: 0.34,
  u: 0.57,
  v: 0.51,
  w: 0.75,
  x: 0.51,
  y: 0.51,
  z: 0.49,
  A: 0.66,
  B: 0.63,
  C: 0.66,
  D: 0.68,
  E: 0.6,
  F: 0.58,
  G: 0.7,
  H: 0.71,
  I: 0.28,
  J: 0.5,
  K: 0.63,
  L: 0.55,
  M: 0.86,
  N: 0.72,
  O: 0.74,
  P: 0.62,
  Q: 0.74,
  R: 0.65,
  S: 0.61,
  T: 0.6,
  U: 0.7,
  V: 0.65,
  W: 0.93,
  X: 0.64,
  Y: 0.62,
  Z: 0.61,
  '0': 0.57,
  '1': 0.57,
  '2': 0.57,
  '3': 0.57,
  '4': 0.57,
  '5': 0.57,
  '6': 0.57,
  '7': 0.57,
  '8': 0.57,
  '9': 0.57,
  ' ': 0.28,
  '.': 0.28,
  ',': 0.28,
  ':': 0.28,
  ';': 0.28,
  '(': 0.34,
  ')': 0.34,
  '%': 0.85,
  '/': 0.4,
  '-': 0.4,
  '+': 0.57,
  '₹': 0.57,
  '→': 0.9,
};
const INTER_DEFAULT_ADVANCE = 0.55;
// semibold glyphs render marginally wider than regular in Inter.
const SEMIBOLD_WIDTH_FACTOR = 1.045;

const estimateTextWidth = (text: string, fontSize: number, weight: number): number => {
  const factor = weight >= 600 ? SEMIBOLD_WIDTH_FACTOR : 1;
  let em = 0;
  for (const ch of text) {
    em += INTER_ADVANCE[ch] ?? INTER_DEFAULT_ADVANCE;
  }
  return em * fontSize * factor;
};

// ─── Indian number humanizer (private default for formatValue) ────────────────
// Truncates (never rounds up) to avoid overstating values. Ported verbatim from web.
const humanizeIndian = (value: number): string => {
  if (value >= 1_00_00_000) {
    const v = Math.floor((value / 1_00_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}Cr`;
  }
  if (value >= 1_00_000) {
    const v = Math.floor((value / 1_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}L`;
  }
  if (value >= 1_000) {
    const v = Math.floor((value / 1_000) * 10) / 10;
    return `${parseFloat(v.toFixed(1))}k`;
  }
  return String(value);
};

// ─── Sankey layout (reimplements recharts <Sankey>) ────────────────────────────

type RechartsLink = {
  source: number;
  target: number;
  value: number;
  _originalIndex: number;
};

type NodeLayout = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  depth: number;
};

type LinkLayout = {
  sourceIndex: number;
  targetIndex: number;
  value: number;
  originalIndex: number;
  d: string;
  // Centerline endpoints + thickness (plot coords) — used to hit-test taps against
  // the ribbon since RN has no SVG path point-containment API.
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  thickness: number;
};

type SankeyLayout = {
  nodeLayouts: NodeLayout[];
  linkLayouts: LinkLayout[];
  countPerDepth: number[];
};

const computeSankeyLayout = ({
  nodeCount,
  links,
  plotWidth,
  plotHeight,
  nodeWidth,
  nodePadding,
}: {
  nodeCount: number;
  links: RechartsLink[];
  plotWidth: number;
  plotHeight: number;
  nodeWidth: number;
  nodePadding: number;
}): SankeyLayout => {
  const empty: SankeyLayout = { nodeLayouts: [], linkLayouts: [], countPerDepth: [] };
  if (nodeCount === 0 || plotWidth <= 0 || plotHeight <= 0) return empty;

  // 1. Depth per node — BFS from roots (0 incoming), mirroring web nodeDepthInfo.
  const incoming = new Array<number>(nodeCount).fill(0);
  const outgoing: number[][] = Array.from({ length: nodeCount }, () => []);
  links.forEach((l) => {
    incoming[l.target] += 1;
    outgoing[l.source].push(l.target);
  });
  const depthOf = new Array<number>(nodeCount).fill(-1);
  const queue: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    if (incoming[i] === 0) {
      depthOf[i] = 0;
      queue.push(i);
    }
  }
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    const d = depthOf[id];
    outgoing[id].forEach((tid) => {
      if (depthOf[tid] === -1) {
        depthOf[tid] = d + 1;
        queue.push(tid);
      }
    });
  }
  // Nodes unreachable from any root (e.g. cycles) fall back to depth 0.
  for (let i = 0; i < nodeCount; i++) {
    if (depthOf[i] === -1) depthOf[i] = 0;
  }
  const maxDepth = depthOf.reduce((max, d) => Math.max(max, d), 0);

  // 2. Node value = max(Σ incoming, Σ outgoing); roots use outgoing (d3-sankey).
  const inSum = new Array<number>(nodeCount).fill(0);
  const outSum = new Array<number>(nodeCount).fill(0);
  links.forEach((l) => {
    inSum[l.target] += l.value;
    outSum[l.source] += l.value;
  });
  const nodeValue = new Array<number>(nodeCount)
    .fill(0)
    .map((_, i) => Math.max(inSum[i], outSum[i]));

  // 3. Columns per depth.
  const columns: number[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (let i = 0; i < nodeCount; i++) {
    columns[depthOf[i]].push(i);
  }
  const countPerDepth = columns.map((c) => c.length);

  // 4. Vertical scale ky — smallest ratio so the tallest column fits.
  let ky = Infinity;
  columns.forEach((col) => {
    const colSum = col.reduce((sum, i) => sum + nodeValue[i], 0);
    if (colSum <= 0) return;
    const avail = Math.max(0, plotHeight - nodePadding * (col.length - 1));
    ky = Math.min(ky, avail / colSum);
  });
  if (!Number.isFinite(ky) || ky < 0) ky = 0;

  // 5. Node rects — stack within a column, then center the block vertically.
  const xStep = maxDepth > 0 ? (plotWidth - nodeWidth) / maxDepth : 0;
  const nodeLayouts = new Array<NodeLayout>(nodeCount);
  columns.forEach((col, depth) => {
    const heights = col.map((i) => Math.max(NODE_MIN_HEIGHT, nodeValue[i] * ky));
    const totalH =
      heights.reduce((sum, h) => sum + h, 0) + nodePadding * Math.max(0, col.length - 1);
    let y = (plotHeight - totalH) / 2;
    col.forEach((i, k) => {
      nodeLayouts[i] = {
        index: i,
        x: depth * xStep,
        y,
        width: nodeWidth,
        height: heights[k],
        value: nodeValue[i],
        depth,
      };
      y += heights[k] + nodePadding;
    });
  });

  // 6. Link ribbons — cumulative per-node offsets, bezier path identical to web.
  const sourceOffset = new Array<number>(nodeCount).fill(0);
  const targetOffset = new Array<number>(nodeCount).fill(0);
  const linkLayouts = links.map((l) => {
    const s = nodeLayouts[l.source];
    const t = nodeLayouts[l.target];
    const linkWidth = l.value * ky;
    const sourceY = s.y + sourceOffset[l.source] + linkWidth / 2;
    const targetY = t.y + targetOffset[l.target] + linkWidth / 2;
    sourceOffset[l.source] += linkWidth;
    targetOffset[l.target] += linkWidth;
    const sourceX = s.x + nodeWidth;
    const targetX = t.x;
    const controlX = (sourceX + targetX) / 2;
    const d = `M${sourceX},${sourceY + linkWidth / 2} C${controlX},${sourceY + linkWidth / 2} ${controlX},${
      targetY + linkWidth / 2
    } ${targetX},${targetY + linkWidth / 2} L${targetX},${targetY - linkWidth / 2} C${controlX},${
      targetY - linkWidth / 2
    } ${controlX},${sourceY - linkWidth / 2} ${sourceX},${sourceY - linkWidth / 2} Z`;
    return {
      sourceIndex: l.source,
      targetIndex: l.target,
      value: l.value,
      originalIndex: l._originalIndex,
      d,
      sourceX,
      sourceY,
      targetX,
      targetY,
      thickness: linkWidth,
    };
  });

  return { nodeLayouts, linkLayouts, countPerDepth };
};

// Touch slop (plot px) widening node rects / ribbons so thin shapes stay tappable.
const HIT_SLOP = 8;

// ─── Ribbon hit-test ───────────────────────────────────────────────────────────
// RN has no SVG path point-containment, so sample the link's centerline cubic
// (the same bezier used to draw it: controls sit at the horizontal midpoint) and
// check whether the point falls within half the ribbon thickness of the nearest
// sample. `slop` widens thin ribbons so they stay tappable.
const isPointOnRibbon = (
  px: number,
  py: number,
  link: LinkLayout,
  slop: number,
): boolean => {
  const { sourceX, sourceY, targetX, targetY, thickness } = link;
  if (px < Math.min(sourceX, targetX) - slop || px > Math.max(sourceX, targetX) + slop) {
    return false;
  }
  const controlX = (sourceX + targetX) / 2;
  const halfBand = thickness / 2 + slop;
  const STEPS = 40;
  let bestDx = Infinity;
  let bestY = sourceY;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const mt = 1 - t;
    const x = mt * mt * mt * sourceX + 3 * mt * mt * t * controlX + 3 * mt * t * t * controlX + t * t * t * targetX;
    const y = mt * mt * mt * sourceY + 3 * mt * mt * t * sourceY + 3 * mt * t * t * targetY + t * t * t * targetY;
    const dx = Math.abs(x - px);
    if (dx < bestDx) {
      bestDx = dx;
      bestY = y;
    }
  }
  return Math.abs(py - bestY) <= halfBand;
};

// ─── Per-shape animated components ─────────────────────────────────────────────
// Node/link counts are dynamic, so hooks cannot loop — each shape owns its hooks.

type SankeyNodeShapeProps = {
  targetOpacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  children?: React.ReactNode;
};

const SankeyNodeShape = ({
  targetOpacity,
  x,
  y,
  width,
  height,
  fill,
  children,
}: SankeyNodeShapeProps): React.ReactElement => {
  const { theme } = useTheme();
  const opacity = useSharedValue(targetOpacity);
  const duration = theme.motion.duration.quick;
  const easing = (theme.motion.easing.standard as unknown) as EasingFn;

  React.useEffect(() => {
    opacity.value = withTiming(targetOpacity, { duration, easing });
    // opacity is a reanimated SharedValue (ref-like, stable identity) — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOpacity, duration, easing]);

  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }));

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Rect x={x} y={y} width={width} height={height} fill={fill} />
      {children}
    </AnimatedG>
  );
};

type SankeyLinkShapeProps = {
  targetOpacity: number;
  d: string;
  fill: string;
};

const SankeyLinkShape = ({
  targetOpacity,
  d,
  fill,
}: SankeyLinkShapeProps): React.ReactElement => {
  const { theme } = useTheme();
  const fillOpacity = useSharedValue(targetOpacity);
  const duration = theme.motion.duration.quick;
  const easing = (theme.motion.easing.standard as unknown) as EasingFn;

  React.useEffect(() => {
    fillOpacity.value = withTiming(targetOpacity, { duration, easing });
    // fillOpacity is a reanimated SharedValue (ref-like, stable identity) — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOpacity, duration, easing]);

  const animatedProps = useAnimatedProps(() => ({ fillOpacity: fillOpacity.value }));

  return <AnimatedPath animatedProps={animatedProps} d={d} fill={fill} />;
};

// ─── Node label rendering (ported from web renderChipLabel / renderPlainTextLabel) ──

type NodeLabelArgs = {
  chipX: number;
  chipY: number;
  chipW: number;
  chipH: number;
  nodeMidY: number;
  fontSize: number;
  fontFamily: string;
  labelNameColor: string;
  labelValueColor: string;
  chipBg: string;
  chipBorderColor: string;
  chipRadius: number;
  chipPadX: number;
  lineGap: number;
  borderThin: number;
  capHeightRatio: number;
  name: string;
  labelValue: string;
  shouldWrap: boolean;
  semibold: number;
  regular: number;
};

const renderChipLabel = ({
  chipX,
  chipY,
  chipW,
  chipH,
  fontSize,
  fontFamily,
  labelNameColor,
  labelValueColor,
  chipBg,
  chipBorderColor,
  chipRadius,
  chipPadX,
  lineGap,
  borderThin,
  capHeightRatio,
  name,
  labelValue,
  shouldWrap,
  semibold,
  regular,
}: NodeLabelArgs): React.ReactElement => {
  return (
    <G>
      <Rect
        x={chipX + borderThin / 2}
        y={chipY + borderThin / 2}
        width={chipW - borderThin}
        height={chipH - borderThin}
        fill={chipBg}
        rx={chipRadius}
        stroke={chipBorderColor}
        strokeWidth={borderThin}
      />
      {shouldWrap ? (
        <SvgText fontSize={fontSize} fontFamily={fontFamily}>
          <TSpan
            x={chipX + chipPadX}
            y={chipY + lineGap * 2 + (fontSize * (1 + capHeightRatio)) / 2}
            fontWeight={semibold}
            fill={labelNameColor}
          >
            {name}
          </TSpan>
          <TSpan
            x={chipX + chipPadX}
            y={chipY + lineGap * 2 + fontSize + lineGap + (fontSize * (1 + capHeightRatio)) / 2}
            fontWeight={regular}
            fill={labelValueColor}
          >
            {labelValue}
          </TSpan>
        </SvgText>
      ) : (
        <SvgText
          x={chipX + chipPadX}
          y={chipY + (chipH + fontSize * capHeightRatio) / 2}
          fontSize={fontSize}
          fontFamily={fontFamily}
        >
          <TSpan fontWeight={semibold} fill={labelNameColor}>
            {name}
          </TSpan>
          <TSpan fontWeight={regular} fill={labelValueColor} dx={lineGap}>
            {labelValue}
          </TSpan>
        </SvgText>
      )}
    </G>
  );
};

const renderPlainTextLabel = ({
  chipX,
  nodeMidY,
  fontSize,
  fontFamily,
  labelNameColor,
  labelValueColor,
  lineGap,
  capHeightRatio,
  name,
  labelValue,
  shouldWrap,
  semibold,
  regular,
}: NodeLabelArgs): React.ReactElement => {
  if (shouldWrap) {
    return (
      <SvgText fontSize={fontSize} fontFamily={fontFamily}>
        <TSpan
          x={chipX}
          y={nodeMidY - (fontSize + lineGap) / 2}
          fontWeight={semibold}
          fill={labelNameColor}
        >
          {name}
        </TSpan>
        <TSpan
          x={chipX}
          y={nodeMidY + (fontSize + lineGap) / 2}
          fontWeight={regular}
          fill={labelValueColor}
        >
          {labelValue}
        </TSpan>
      </SvgText>
    );
  }
  return (
    <SvgText
      x={chipX}
      y={nodeMidY + (fontSize * capHeightRatio) / 2}
      fontSize={fontSize}
      fontFamily={fontFamily}
    >
      <TSpan fontWeight={semibold} fill={labelNameColor}>
        {name}
      </TSpan>
      <TSpan fontWeight={regular} fill={labelValueColor} dx={lineGap}>
        {labelValue}
      </TSpan>
    </SvgText>
  );
};

// ─── ChartSankey (marker) ───────────────────────────────────────────────────────
// Renders nothing on its own — ChartSankeyWrapper reads its props and draws the SVG.
const _ChartSankey = (_props: ChartSankeyProps): React.ReactElement | null => null;

export const ChartSankey = assignWithoutSideEffects(_ChartSankey, {
  componentId: componentIds.ChartSankey,
});

// ─── Active (tap-to-select) state — parity replacement for web hover ────────────
// Touch has no hover. Rather than per-shape react-native-svg `onPress` (unreliable
// on nested/animated shapes — the completed tap frequently never fires), selection
// is driven by a single outer <Pressable> that hit-tests the touch location against
// the node rects and link ribbons — the same approach as BarChart.native. A tap on
// a node/link selects it (dim + tooltip persist); a tap on empty canvas clears it.
type ActiveState = { type: 'node' | 'link'; index: number } | null;

// ─── ChartSankeyWrapper (renderer) ──────────────────────────────────────────────

const _ChartSankeyWrapper = ({
  children,
  showTooltip = true,
  colorTheme = 'categorical',
  nodeColorOverride,
  linkColorOverride,
  testID,
  ...restProps
}: ChartSankeyWrapperProps & TestID & DataAnalyticsAttribute): React.ReactElement => {
  const { theme } = useTheme();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [active, setActive] = useState<ActiveState>(null);

  // Extract the single ChartSankey child's props.
  const sankeyChild = useMemo(
    () =>
      React.Children.toArray(children).find(
        (child) =>
          React.isValidElement(child) && getComponentId(child) === componentIds.ChartSankey,
      ) as React.ReactElement<ChartSankeyProps> | undefined,
    [children],
  );

  const {
    data = { nodes: [], links: [] },
    showLabels = true,
    showLabelChip = true,
    showPercentage = true,
    labelUnit,
    formatValue,
    onNodeClick,
    onLinkClick,
  } = sankeyChild?.props ?? {};

  // Categorical palette (gray.faint filtered out — near-white), mirrors web.
  const allColorTokens = useChartsColorTheme({ colorTheme });
  const defaultColorTokens = useMemo(
    () => allColorTokens.filter((t) => t !== 'data.background.categorical.gray.faint'),
    [allColorTokens],
  );

  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    data.nodes.forEach((node) => {
      const override = nodeColorOverride ?? node.color;
      mapping[node.id] = {
        colorToken: override as ChartsCategoricalColorToken,
        isCustomColor: Boolean(override),
      };
    });
    assignDataColorMapping(mapping, defaultColorTokens);
    return mapping;
  }, [data.nodes, nodeColorOverride, defaultColorTokens]);

  const resolveColor = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tokenPath: string): string => (getIn(theme.colors, tokenPath as any) as string) ?? tokenPath,
    [theme],
  );

  // ── Label / chip geometry (mirrors web) ──────────────────────────────────────
  const fontSize = theme.typography.fonts.size[75];
  const fontFamily = theme.typography.fonts.family.text;
  const semibold = theme.typography.fonts.weight.semibold;
  const regular = theme.typography.fonts.weight.regular;
  const CHIP_PAD_X = theme.spacing[3];
  const CHIP_H = theme.typography.fonts.size[75] + theme.spacing[3] * 2;
  const CHIP_GAP = theme.spacing[3];
  const nodePadding = theme.spacing[4];
  const lineGap = theme.spacing[2];
  const capHeightRatio = LABEL_CAP_HEIGHT_RATIO;
  const borderThin = theme.border.width.thin;

  const labelNameColor = theme.colors.surface.text.gray.normal;
  const labelValueColor = theme.colors.surface.text.gray.muted;
  const chipBg = theme.colors.surface.background.gray.intense;
  const chipBorderColor = theme.colors.interactive.border.gray.faded;
  const chipRadius = theme.border.radius.small;

  // ── Index links + drop dangling endpoints (mirror web rechartsLinks) ─────────
  const nodeIdToIndex = useMemo(() => new Map(data.nodes.map((n, i) => [n.id, i])), [data.nodes]);

  const rechartsLinks = useMemo<RechartsLink[]>(
    () =>
      data.links
        .map((l, i) => {
          const source = nodeIdToIndex.get(l.source);
          const target = nodeIdToIndex.get(l.target);
          if (source === undefined || target === undefined) return null;
          return { source, target, value: l.value, _originalIndex: i };
        })
        .filter((l): l is RechartsLink => l !== null),
    [data.links, nodeIdToIndex],
  );

  // ── Dynamic right margin — widest chip across all nodes (mirror web) ─────────
  const dynamicRightMargin = useMemo(() => {
    if (!showLabels) return theme.spacing[3];
    if (!showLabelChip) {
      const maxTextW = data.nodes.reduce((max, node) => {
        const nameW = estimateTextWidth(node.name, fontSize, semibold);
        return Math.max(max, nameW + theme.spacing[2] + CHIP_VALUE_BUDGET);
      }, 0);
      return Math.min(CHIP_MAX_WIDTH, maxTextW) + CHIP_GAP + theme.spacing[3];
    }
    const maxChipW = data.nodes.reduce((max, node) => {
      const nameW = estimateTextWidth(node.name, fontSize, semibold);
      const chipW = Math.min(
        CHIP_MAX_WIDTH,
        Math.max(CHIP_MIN_WIDTH, nameW + theme.spacing[2] + CHIP_VALUE_BUDGET + CHIP_PAD_X * 2),
      );
      return Math.max(max, chipW);
    }, 0);
    return maxChipW + CHIP_GAP + theme.spacing[3];
  }, [showLabels, showLabelChip, data.nodes, fontSize, semibold, theme, CHIP_PAD_X, CHIP_GAP]);

  // ── Total value = sum of outflows from root nodes (mirror web) ───────────────
  const totalValue = useMemo(() => {
    const targetIds = new Set(data.links.map((l) => l.target));
    return data.links.filter((l) => !targetIds.has(l.source)).reduce((sum, l) => sum + l.value, 0);
  }, [data.links]);

  // ── Plot rect + layout ───────────────────────────────────────────────────────
  const PADDING = {
    top: theme.spacing[3],
    bottom: theme.spacing[3],
    left: theme.spacing[3],
    right: dynamicRightMargin,
  };
  const plotWidth = Math.max(0, size.width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(0, size.height - PADDING.top - PADDING.bottom);

  const layout = useMemo(
    () =>
      computeSankeyLayout({
        nodeCount: data.nodes.length,
        links: rechartsLinks,
        plotWidth,
        plotHeight,
        nodeWidth: NODE_WIDTH,
        nodePadding,
      }),
    [data.nodes.length, rechartsLinks, plotWidth, plotHeight, nodePadding],
  );

  // ── Opacity helpers (ported verbatim from web, `active` instead of `hovered`) ─
  const getNodeOpacity = React.useCallback(
    (nodeIdx: number): number => {
      if (active === null) return NODE_DEFAULT_OPACITY;
      if (active.type === 'node' && active.index === nodeIdx) return NODE_DEFAULT_OPACITY;
      if (active.type === 'link') {
        const link = rechartsLinks[active.index];
        if (link && (link.source === nodeIdx || link.target === nodeIdx))
          return NODE_DEFAULT_OPACITY;
      }
      return NODE_DIMMED_OPACITY;
    },
    [active, rechartsLinks],
  );

  const getLinkOpacity = React.useCallback(
    (linkIdx: number): number => {
      if (active === null) return LINK_DEFAULT_OPACITY;
      if (active.type === 'link' && active.index === linkIdx) return LINK_HOVER_OPACITY;
      if (active.type === 'node') {
        const link = rechartsLinks[linkIdx];
        if (link && (link.source === active.index || link.target === active.index))
          return LINK_HOVER_OPACITY;
      }
      return LINK_DIMMED_OPACITY;
    },
    [active, rechartsLinks],
  );

  // ── Layout callback ──────────────────────────────────────────────────────────
  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) {
      setSize({ width, height });
    }
  };

  // ── Tooltip content + position for the active shape ──────────────────────────
  const tooltip = useMemo(() => {
    if (!showTooltip || active === null || size.width === 0) return null;
    const unitSuffix = labelUnit ? ` ${labelUnit}` : '';
    if (active.type === 'node') {
      const node = layout.nodeLayouts[active.index];
      const nodeData = data.nodes[active.index];
      if (!node || !nodeData) return null;
      return {
        content: `${nodeData.name}: ${node.value.toLocaleString()}${unitSuffix}`,
        centerX: PADDING.left + node.x + node.width / 2,
        centerY: PADDING.top + node.y + node.height / 2,
      };
    }
    const link = rechartsLinks[active.index];
    if (!link) return null;
    const sourceName = data.nodes[link.source]?.name ?? '';
    const targetName = data.nodes[link.target]?.name ?? '';
    const sourceNode = layout.nodeLayouts[link.source];
    const targetNode = layout.nodeLayouts[link.target];
    const centerX =
      sourceNode && targetNode
        ? PADDING.left + (sourceNode.x + sourceNode.width + targetNode.x) / 2
        : size.width / 2;
    const centerY =
      sourceNode && targetNode
        ? PADDING.top + (sourceNode.y + sourceNode.height / 2 + targetNode.y + targetNode.height / 2) / 2
        : size.height / 2;
    return {
      content: `${sourceName} → ${targetName}: ${link.value.toLocaleString()}${unitSuffix}`,
      centerX,
      centerY,
    };
  }, [showTooltip, active, size, labelUnit, layout, data.nodes, rechartsLinks, PADDING.left, PADDING.top]);

  const TOOLTIP_MAX_WIDTH = 240;
  const tooltipLeft = tooltip
    ? Math.max(0, Math.min(size.width - TOOLTIP_MAX_WIDTH, tooltip.centerX - TOOLTIP_MAX_WIDTH / 2))
    : 0;

  const formatter = formatValue ?? humanizeIndian;

  // Single tap handler for the whole canvas. Converts the touch point into plot
  // coords and hit-tests nodes first (they sit above the ribbons), then links.
  // A hit selects that shape and fires its click callback; a miss clears the
  // selection ("stays until you tap elsewhere"). One onPress per physical tap, so
  // there is no double-fire and no competing responder.
  const handleCanvasPress = React.useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const px = locationX - PADDING.left;
      const py = locationY - PADDING.top;

      const hitNode = layout.nodeLayouts.find(
        (node) =>
          px >= node.x - HIT_SLOP &&
          px <= node.x + node.width + HIT_SLOP &&
          py >= node.y &&
          py <= node.y + node.height,
      );
      if (hitNode) {
        setActive((prev) =>
          prev && prev.type === 'node' && prev.index === hitNode.index
            ? null
            : { type: 'node', index: hitNode.index },
        );
        const nodeData = data.nodes[hitNode.index];
        if (nodeData) onNodeClick?.(nodeData, hitNode.index);
        return;
      }

      const hitLink = layout.linkLayouts.find((link) => isPointOnRibbon(px, py, link, HIT_SLOP));
      if (hitLink) {
        setActive((prev) =>
          prev && prev.type === 'link' && prev.index === hitLink.originalIndex
            ? null
            : { type: 'link', index: hitLink.originalIndex },
        );
        const originalLink = data.links[hitLink.originalIndex];
        if (originalLink) onLinkClick?.(originalLink, hitLink.originalIndex);
        return;
      }

      setActive(null);
    },
    [layout, data.nodes, data.links, PADDING.left, PADDING.top, onNodeClick, onLinkClick],
  );

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'sankey', dataColorMapping }}>
      <BaseBox
        {...metaAttribute({ name: componentIds.ChartSankeyWrapper, testID })}
        {...makeAnalyticsAttribute(restProps)}
        width="100%"
        height="100%"
        position="relative"
        {...restProps}
      >
        <Pressable
          testID={testID ? `${testID}-canvas` : undefined}
          onLayout={onLayout}
          onPress={handleCanvasPress}
          style={{ flex: 1, width: '100%' }}
        >
          {size.width > 0 && size.height > 0 ? (
            <Svg width={size.width} height={size.height} pointerEvents="none">
              <G x={PADDING.left} y={PADDING.top}>
              {/* Links first so nodes + labels render above the ribbons */}
              {layout.linkLayouts.map((link) => {
                const srcNode = data.nodes[link.sourceIndex] as SankeyDataNode | undefined;
                const colorToken =
                  linkColorOverride ??
                  nodeColorOverride ??
                  (srcNode
                    ? srcNode.color ??
                      defaultColorTokens[link.sourceIndex % defaultColorTokens.length]
                    : defaultColorTokens[0]);
                return (
                  <SankeyLinkShape
                    key={`link-${link.originalIndex}`}
                    targetOpacity={getLinkOpacity(link.originalIndex)}
                    d={link.d}
                    fill={resolveColor(colorToken)}
                  />
                );
              })}

              {layout.nodeLayouts.map((node) => {
                const nodeData = data.nodes[node.index] as SankeyDataNode | undefined;
                if (!nodeData) return null;
                const colorToken =
                  nodeColorOverride ??
                  nodeData.color ??
                  defaultColorTokens[node.index % defaultColorTokens.length];

                const nodeMidY = node.y + node.height / 2;
                const chipX = node.x + node.width + CHIP_GAP;
                const humanized = formatter(node.value);
                const levelCount = layout.countPerDepth[node.depth] ?? 1;
                const pct = totalValue > 0 ? Math.round((node.value / totalValue) * 100) : 0;
                const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
                const labelValue =
                  showPercentage && levelCount > 1 ? `${valueText}  (${pct}%)` : valueText;

                const nameW = estimateTextWidth(nodeData.name, fontSize, semibold);
                const labelW = estimateTextWidth(labelValue, fontSize, regular);
                const contentW = nameW + theme.spacing[2] + labelW;
                const shouldWrap = contentW + CHIP_PAD_X * 2 > CHIP_MAX_WIDTH;
                const chipW = shouldWrap
                  ? Math.min(
                      CHIP_MAX_WIDTH,
                      Math.max(CHIP_MIN_WIDTH, Math.max(nameW, labelW) + CHIP_PAD_X * 2),
                    )
                  : Math.max(CHIP_MIN_WIDTH, contentW + CHIP_PAD_X * 2);
                const chipH = shouldWrap
                  ? theme.spacing[3] + fontSize + lineGap + fontSize + theme.spacing[3]
                  : CHIP_H;
                const chipY = nodeMidY - chipH / 2;

                const labelArgs: NodeLabelArgs = {
                  chipX,
                  chipY,
                  chipW,
                  chipH,
                  nodeMidY,
                  fontSize,
                  fontFamily,
                  labelNameColor,
                  labelValueColor,
                  chipBg,
                  chipBorderColor,
                  chipRadius,
                  chipPadX: CHIP_PAD_X,
                  lineGap,
                  borderThin,
                  capHeightRatio,
                  name: nodeData.name,
                  labelValue,
                  shouldWrap,
                  semibold,
                  regular,
                };

                return (
                  <SankeyNodeShape
                    key={`node-${node.index}`}
                    targetOpacity={getNodeOpacity(node.index)}
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={resolveColor(colorToken)}
                  >
                    {showLabels
                      ? (showLabelChip ? renderChipLabel : renderPlainTextLabel)(labelArgs)
                      : null}
                  </SankeyNodeShape>
                );
              })}
              </G>
            </Svg>
          ) : null}
        </Pressable>

        {tooltip ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: Math.max(0, tooltip.centerY - theme.spacing[9]),
              left: tooltipLeft,
              maxWidth: TOOLTIP_MAX_WIDTH,
              // surface.icon.staticBlack.normal is the token the web SankeyTooltip uses.
              backgroundColor: theme.colors.surface.icon.staticBlack.normal,
              borderRadius: theme.border.radius.large,
              borderWidth: theme.border.width.thin,
              borderColor: theme.colors.surface.border.gray.muted,
              padding: theme.spacing[4],
              // boxShadow: elevation.highRaised — RN cannot parse the web string,
              // so approximate with iOS shadow* props + Android elevation.
              shadowColor: '#000',
              shadowOpacity: 0.24,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
              {tooltip.content}
            </Text>
          </View>
        ) : null}
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
};

/**
 * Orchestration wrapper for the Sankey flow diagram (native).
 * Reads the single `<ChartSankey>` child, computes the layout with a hand-rolled
 * d3-sankey-style algorithm, and renders nodes + bezier link ribbons via
 * `react-native-svg`. Taps are captured by a single outer <Pressable> that
 * hit-tests the touch location against node rects / link ribbons (per-shape SVG
 * onPress is unreliable on nested animated shapes). A tap on a node/link is the
 * touch equivalent of web hover: it selects a persistent dim/highlight + tooltip
 * and fires the click callback; a tap on empty canvas clears the selection.
 */
export const ChartSankeyWrapper = assignWithoutSideEffects(_ChartSankeyWrapper, {
  componentId: componentIds.ChartSankeyWrapper,
});

export type { ChartSankeyWrapperProps, ChartSankeyProps, SankeyDataNode, SankeyDataLink };
