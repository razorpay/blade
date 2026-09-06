import React, { useMemo, useState } from 'react';
import { Svg, G, Rect, Path, Text as SvgText, TSpan } from 'react-native-svg';
import { View, Pressable } from 'react-native';
import type { LayoutChangeEvent, GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import type { EasingFn } from 'react-native-reanimated';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents';
import type { DataColorMapping, ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type {
  ChartSankeyWrapperProps,
  ChartSankeyProps,
  SankeyDataNode,
  SankeyDataLink,
  RechartsLink,
  NodeLayout,
  LinkLayout,
  SankeyLayout,
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
  VERTICAL_LABEL_RESERVE,
} from './tokens';
import { INTER_ADVANCE, INTER_DEFAULT_ADVANCE } from './interAdvance';
import { humanizeIndian } from './humanizeIndian';
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
// See `interAdvance.ts` for the per-character table. Ignores kerning pairs and
// sub-pixel hinting (a few px on long strings) — imperceptible for chip sizing.
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

// Trim `text` (appending an ellipsis) until its estimated width fits `maxWidth`.
// Used only by the vertical layout, where node bars sit side-by-side across a
// narrow screen and a too-wide label would clip or collide with its neighbour.
const truncateToWidth = (
  text: string,
  maxWidth: number,
  fontSize: number,
  weight: number,
): string => {
  if (maxWidth <= 0) return '';
  if (estimateTextWidth(text, fontSize, weight) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 0 && estimateTextWidth(`${trimmed}…`, fontSize, weight) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed.length > 0 ? `${trimmed}…` : '…';
};

// ─── Sankey layout (reimplements recharts <Sankey>) ────────────────────────────

// Native-only flow direction. `horizontal` mirrors the web layout (stages progress
// left→right, nodes are vertical bars). `vertical` transposes it (stages progress
// top→bottom, nodes are horizontal bars) — reads better on tall phone screens.
type SankeyOrientation = 'horizontal' | 'vertical';

// Precomputed, collision-resolved label box for a vertical-layout node.
// Chips in the same stage are swept left→right so they never overlap each other
// and are clamped inside the plot so they never clip off the screen edges; the
// name/value strings are pre-truncated to the resolved chip width.
type VerticalLabel = {
  chipX: number;
  chipY: number;
  chipW: number;
  chipH: number;
  name: string;
  labelValue: string;
};

const computeSankeyLayout = ({
  nodeCount,
  links,
  plotWidth,
  plotHeight,
  nodeWidth,
  nodePadding,
  layout,
}: {
  nodeCount: number;
  links: RechartsLink[];
  plotWidth: number;
  plotHeight: number;
  nodeWidth: number;
  nodePadding: number;
  layout: SankeyOrientation;
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

  // The layout is computed in generic "along" (stage-progression axis) / "across"
  // (node-stacking axis) coordinates, then mapped to screen x/y based on layout.
  //   horizontal → along = X, across = Y  (nodes are vertical bars)
  //   vertical   → along = Y, across = X  (nodes are horizontal bars)
  const isVertical = layout === 'vertical';
  const alongExtent = isVertical ? plotHeight : plotWidth;
  const acrossExtent = isVertical ? plotWidth : plotHeight;

  // 4. Cross-axis scale k — smallest ratio so the fullest column fits.
  let k = Infinity;
  columns.forEach((col) => {
    const colSum = col.reduce((sum, i) => sum + nodeValue[i], 0);
    if (colSum <= 0) return;
    const avail = Math.max(0, acrossExtent - nodePadding * (col.length - 1));
    k = Math.min(k, avail / colSum);
  });
  if (!Number.isFinite(k) || k < 0) k = 0;

  // 5. Node rects — stack within a column, then center the block on the cross axis.
  const alongStep = maxDepth > 0 ? (alongExtent - nodeWidth) / maxDepth : 0;
  const nodeLayouts = new Array<NodeLayout>(nodeCount);
  columns.forEach((col, depth) => {
    const lengths = col.map((i) => Math.max(NODE_MIN_HEIGHT, nodeValue[i] * k));
    const totalLen =
      lengths.reduce((sum, h) => sum + h, 0) + nodePadding * Math.max(0, col.length - 1);
    const along = depth * alongStep;
    let across = (acrossExtent - totalLen) / 2;
    col.forEach((i, kk) => {
      const len = lengths[kk];
      nodeLayouts[i] = isVertical
        ? {
            index: i,
            x: across,
            y: along,
            width: len,
            height: nodeWidth,
            value: nodeValue[i],
            depth,
          }
        : {
            index: i,
            x: along,
            y: across,
            width: nodeWidth,
            height: len,
            value: nodeValue[i],
            depth,
          };
      across += len + nodePadding;
    });
  });

  // 6. Link ribbons — cumulative per-node offsets. Each bezier control point is
  // emitted through the along/across → x/y mapping so the identical curve formula
  // produces a left→right ribbon (horizontal) or a top→bottom one (vertical).
  const sourceOffset = new Array<number>(nodeCount).fill(0);
  const targetOffset = new Array<number>(nodeCount).fill(0);
  const toXY = (along: number, across: number): string =>
    isVertical ? `${across},${along}` : `${along},${across}`;
  const linkLayouts = links.map((l) => {
    const s = nodeLayouts[l.source];
    const t = nodeLayouts[l.target];
    const w = l.value * k;
    // Along-axis endpoints: leading edge of source node, entry edge of target node.
    const sAlong = (isVertical ? s.y : s.x) + nodeWidth;
    const tAlong = isVertical ? t.y : t.x;
    const cAlong = (sAlong + tAlong) / 2;
    // Across-axis band centers, offset cumulatively per node.
    const sAcross = (isVertical ? s.x : s.y) + sourceOffset[l.source] + w / 2;
    const tAcross = (isVertical ? t.x : t.y) + targetOffset[l.target] + w / 2;
    sourceOffset[l.source] += w;
    targetOffset[l.target] += w;
    const d = `M${toXY(sAlong, sAcross + w / 2)} C${toXY(cAlong, sAcross + w / 2)} ${toXY(
      cAlong,
      tAcross + w / 2,
    )} ${toXY(tAlong, tAcross + w / 2)} L${toXY(tAlong, tAcross - w / 2)} C${toXY(
      cAlong,
      tAcross - w / 2,
    )} ${toXY(cAlong, sAcross - w / 2)} ${toXY(sAlong, sAcross - w / 2)} Z`;
    return {
      sourceIndex: l.source,
      targetIndex: l.target,
      value: l.value,
      originalIndex: l._originalIndex,
      d,
      // Screen-coord centerline endpoints + thickness for tap hit-testing.
      sourceX: isVertical ? sAcross : sAlong,
      sourceY: isVertical ? sAlong : sAcross,
      targetX: isVertical ? tAcross : tAlong,
      targetY: isVertical ? tAlong : tAcross,
      thickness: w,
    };
  });

  return { nodeLayouts, linkLayouts, countPerDepth };
};

// Touch slop (plot px) widening node rects / ribbons so thin shapes stay tappable.
const HIT_SLOP = 8;

// ─── Ribbon hit-test ───────────────────────────────────────────────────────────
// RN has no SVG path point-containment, so sample the link's centerline cubic
// (the same bezier used to draw it: controls sit at the midpoint of the stage-
// progression axis) and check whether the point falls within half the ribbon
// thickness of the nearest sample. `slop` widens thin ribbons so they stay
// tappable. Orientation-aware: for `vertical` the primary (progression) axis is Y
// and the cross axis is X — the roles of the touch coords are swapped so taps land
// on the transposed ribbons too.
const isPointOnRibbon = (
  px: number,
  py: number,
  link: LinkLayout,
  slop: number,
  layout: SankeyOrientation,
): boolean => {
  const { sourceX, sourceY, targetX, targetY, thickness } = link;
  const isVertical = layout === 'vertical';
  // primaryS/primaryT — endpoints along the stage-progression axis (curve travels
  // this way); crossS/crossT — band centers on the perpendicular axis.
  const primaryS = isVertical ? sourceY : sourceX;
  const primaryT = isVertical ? targetY : targetX;
  const crossS = isVertical ? sourceX : sourceY;
  const crossT = isVertical ? targetX : targetY;
  const primaryP = isVertical ? py : px;
  const crossP = isVertical ? px : py;
  if (
    primaryP < Math.min(primaryS, primaryT) - slop ||
    primaryP > Math.max(primaryS, primaryT) + slop
  ) {
    return false;
  }
  const controlP = (primaryS + primaryT) / 2;
  const halfBand = thickness / 2 + slop;
  const STEPS = 40;
  let bestDp = Infinity;
  let bestCross = crossS;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const mt = 1 - t;
    const p =
      mt * mt * mt * primaryS +
      3 * mt * mt * t * controlP +
      3 * mt * t * t * controlP +
      t * t * t * primaryT;
    const c =
      mt * mt * mt * crossS +
      3 * mt * mt * t * crossS +
      3 * mt * t * t * crossT +
      t * t * t * crossT;
    const dp = Math.abs(p - primaryP);
    if (dp < bestDp) {
      bestDp = dp;
      bestCross = c;
    }
  }
  return Math.abs(crossP - bestCross) <= halfBand;
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
  accessibilityLabel?: string;
  children?: React.ReactNode;
};

const SankeyNodeShape = ({
  targetOpacity,
  x,
  y,
  width,
  height,
  fill,
  accessibilityLabel,
  children,
}: SankeyNodeShapeProps): React.ReactElement => {
  const { theme } = useTheme();
  const opacity = useSharedValue(targetOpacity);
  const duration = theme.motion.duration.quick;
  const easing = (theme.motion.easing.standard as unknown) as EasingFn;

  React.useEffect(() => {
    opacity.value = withTiming(targetOpacity, { duration, easing });
  }, [targetOpacity, duration, easing]);

  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }));

  return (
    <AnimatedG animatedProps={animatedProps} accessibilityLabel={accessibilityLabel}>
      <Rect x={x} y={y} width={width} height={height} fill={fill} />
      {children}
    </AnimatedG>
  );
};

type SankeyLinkShapeProps = {
  targetOpacity: number;
  d: string;
  fill: string;
  accessibilityLabel?: string;
};

const SankeyLinkShape = ({
  targetOpacity,
  d,
  fill,
  accessibilityLabel,
}: SankeyLinkShapeProps): React.ReactElement => {
  const { theme } = useTheme();
  const fillOpacity = useSharedValue(targetOpacity);
  const duration = theme.motion.duration.quick;
  const easing = (theme.motion.easing.standard as unknown) as EasingFn;

  React.useEffect(() => {
    fillOpacity.value = withTiming(targetOpacity, { duration, easing });
  }, [targetOpacity, duration, easing]);

  const animatedProps = useAnimatedProps(() => ({ fillOpacity: fillOpacity.value }));

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      d={d}
      fill={fill}
      accessibilityLabel={accessibilityLabel}
    />
  );
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
  // Plain-text label anchoring — horizontal left-aligns to the right of the node
  // (`textX` = node right edge, anchor `start`); vertical centers under the node
  // (`textX` = node horizontal center, anchor `middle`).
  textX: number;
  textAnchor: 'start' | 'middle';
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
  textX,
  textAnchor,
}: NodeLabelArgs): React.ReactElement => {
  if (shouldWrap) {
    return (
      <SvgText fontSize={fontSize} fontFamily={fontFamily} textAnchor={textAnchor}>
        <TSpan
          x={textX}
          y={nodeMidY - (fontSize + lineGap) / 2}
          fontWeight={semibold}
          fill={labelNameColor}
        >
          {name}
        </TSpan>
        <TSpan
          x={textX}
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
      x={textX}
      y={nodeMidY + (fontSize * capHeightRatio) / 2}
      fontSize={fontSize}
      fontFamily={fontFamily}
      textAnchor={textAnchor}
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
  layout = 'horizontal',
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
  // Horizontal reserves the wide right margin for side labels; vertical instead
  // reserves a bottom margin for the below-node label chips (labels stack under
  // each horizontal bar) and keeps symmetric side padding.
  const isVertical = layout === 'vertical';
  const verticalLabelMargin = showLabels
    ? VERTICAL_LABEL_RESERVE + CHIP_GAP + theme.spacing[3]
    : theme.spacing[3];
  const PADDING = isVertical
    ? {
        top: theme.spacing[3],
        bottom: verticalLabelMargin,
        left: theme.spacing[3],
        right: theme.spacing[3],
      }
    : {
        top: theme.spacing[3],
        bottom: theme.spacing[3],
        left: theme.spacing[3],
        right: dynamicRightMargin,
      };
  const plotWidth = Math.max(0, size.width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(0, size.height - PADDING.top - PADDING.bottom);

  const sankeyLayout = useMemo(
    () =>
      computeSankeyLayout({
        nodeCount: data.nodes.length,
        links: rechartsLinks,
        plotWidth,
        plotHeight,
        nodeWidth: NODE_WIDTH,
        nodePadding,
        layout,
      }),
    [data.nodes.length, rechartsLinks, plotWidth, plotHeight, nodePadding, layout],
  );

  // ── Lookup map: _originalIndex → RechartsLink (active.index stores the
  //    original index from data.links, not the position in the filtered
  //    rechartsLinks array, so we must look up by _originalIndex) ───────────────
  const linkByOriginalIndex = useMemo(() => {
    const map = new Map<number, RechartsLink>();
    rechartsLinks.forEach((l) => map.set(l._originalIndex, l));
    return map;
  }, [rechartsLinks]);

  // ── Opacity helpers (ported verbatim from web, `active` instead of `hovered`) ─
  const getNodeOpacity = React.useCallback(
    (nodeIdx: number): number => {
      if (active === null) return NODE_DEFAULT_OPACITY;
      if (active.type === 'node' && active.index === nodeIdx) return NODE_DEFAULT_OPACITY;
      if (active.type === 'link') {
        const link = linkByOriginalIndex.get(active.index);
        if (link && (link.source === nodeIdx || link.target === nodeIdx))
          return NODE_DEFAULT_OPACITY;
      }
      return NODE_DIMMED_OPACITY;
    },
    [active, linkByOriginalIndex],
  );

  const getLinkOpacity = React.useCallback(
    (linkIdx: number): number => {
      if (active === null) return LINK_DEFAULT_OPACITY;
      if (active.type === 'link' && active.index === linkIdx) return LINK_HOVER_OPACITY;
      if (active.type === 'node') {
        const link = linkByOriginalIndex.get(linkIdx);
        if (link && (link.source === active.index || link.target === active.index))
          return LINK_HOVER_OPACITY;
      }
      return LINK_DIMMED_OPACITY;
    },
    [active, linkByOriginalIndex],
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
      const node = sankeyLayout.nodeLayouts[active.index];
      const nodeData = data.nodes[active.index];
      if (!node || !nodeData) return null;
      return {
        content: `${nodeData.name}: ${node.value.toLocaleString()}${unitSuffix}`,
        centerX: PADDING.left + node.x + node.width / 2,
        centerY: PADDING.top + node.y + node.height / 2,
      };
    }
    const link = linkByOriginalIndex.get(active.index);
    if (!link) return null;
    const sourceName = data.nodes[link.source]?.name ?? '';
    const targetName = data.nodes[link.target]?.name ?? '';
    const sourceNode = sankeyLayout.nodeLayouts[link.source];
    const targetNode = sankeyLayout.nodeLayouts[link.target];
    // Anchor the tooltip at the midpoint of the ribbon: horizontal spans the gap
    // between source-right and target-left (X) at the average node center (Y);
    // vertical transposes it (X = average node center, Y = gap between the stages).
    const centerX =
      sourceNode && targetNode
        ? PADDING.left +
          (isVertical
            ? (sourceNode.x + sourceNode.width / 2 + targetNode.x + targetNode.width / 2) / 2
            : (sourceNode.x + sourceNode.width + targetNode.x) / 2)
        : size.width / 2;
    const centerY =
      sourceNode && targetNode
        ? PADDING.top +
          (isVertical
            ? (sourceNode.y + sourceNode.height + targetNode.y) / 2
            : (sourceNode.y + sourceNode.height / 2 + targetNode.y + targetNode.height / 2) / 2)
        : size.height / 2;
    return {
      content: `${sourceName} → ${targetName}: ${link.value.toLocaleString()}${unitSuffix}`,
      centerX,
      centerY,
    };
  }, [
    showTooltip,
    active,
    size,
    labelUnit,
    sankeyLayout,
    data.nodes,
    linkByOriginalIndex,
    PADDING.left,
    PADDING.top,
    isVertical,
  ]);

  const TOOLTIP_MAX_WIDTH = 240;
  const tooltipLeft = tooltip
    ? Math.max(0, Math.min(size.width - TOOLTIP_MAX_WIDTH, tooltip.centerX - TOOLTIP_MAX_WIDTH / 2))
    : 0;

  const formatter = formatValue ?? humanizeIndian;

  // ── Vertical label layout (native-only) ──────────────────────────────────────
  // Vertical bars sit side-by-side across a narrow phone width, so labels both clip
  // at the screen edges and collide with neighbours. Precompute a per-stage layout:
  // cap each chip to its fair share of the row, sweep them left→right so they never
  // overlap, clamp inside the plot so they never clip, and truncate text to fit.
  const verticalLabels = useMemo<Map<number, VerticalLabel>>(() => {
    const map = new Map<number, VerticalLabel>();
    if (!isVertical || !showLabels || plotWidth <= 0) return map;

    const inset = theme.spacing[2];
    const gap = theme.spacing[2];
    const chipH = theme.spacing[3] + fontSize + lineGap + fontSize + theme.spacing[3];
    const WIDTH_SAFETY = 1.06;

    const columns = new Map<number, NodeLayout[]>();
    sankeyLayout.nodeLayouts.forEach((node) => {
      const col = columns.get(node.depth) ?? [];
      col.push(node);
      columns.set(node.depth, col);
    });

    columns.forEach((colNodes) => {
      const sorted = [...colNodes].sort((a, b) => a.x - b.x);
      const count = sorted.length;
      const available = Math.max(0, plotWidth - inset * 2);
      // Fair per-chip width so `count` chips + gaps always fit within the row.
      const slotW = count > 0 ? Math.max(0, (available - gap * (count - 1)) / count) : available;
      const rightBound = plotWidth - inset;

      // 1. Resolve each chip's width + (truncated) text, and its ideal centered left.
      const items = sorted.map((node) => {
        const nodeData = data.nodes[node.index];
        const name = nodeData?.name ?? '';
        const humanized = formatter(node.value);
        const levelCount = sankeyLayout.countPerDepth[node.depth] ?? 1;
        const pct = totalValue > 0 ? Math.round((node.value / totalValue) * 100) : 0;
        const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
        const valueWithPct =
          showPercentage && levelCount > 1 ? `${valueText}  (${pct}%)` : valueText;

        // The Inter advance-width table slightly under-measures, so pad estimates a
        // little; otherwise text renders a few px wider than its chip and bleeds into
        // (and is overpainted by) the neighbouring chip.
        const nameW = estimateTextWidth(name, fontSize, semibold) * WIDTH_SAFETY;
        const valueW = estimateTextWidth(valueWithPct, fontSize, regular) * WIDTH_SAFETY;
        const desiredW = Math.max(nameW, valueW) + CHIP_PAD_X * 2;
        const chipW = Math.max(0, Math.min(desiredW, slotW));

        // Width the text must fit within, with the same safety margin baked in.
        const safeMaxW = (chipW - CHIP_PAD_X * 2) / WIDTH_SAFETY;
        // Drop the percentage before truncating so a tight slot renders a clean
        // value ("2.8k txn") rather than a dangling "2.8k txn (…".
        const valueLine =
          estimateTextWidth(valueWithPct, fontSize, regular) <= safeMaxW ? valueWithPct : valueText;
        const idealLeft = Math.max(
          inset,
          Math.min(rightBound - chipW, node.x + node.width / 2 - chipW / 2),
        );
        return {
          index: node.index,
          chipW,
          chipY: node.y + node.height + CHIP_GAP,
          name: truncateToWidth(name, safeMaxW, fontSize, semibold),
          labelValue: truncateToWidth(valueLine, safeMaxW, fontSize, regular),
          left: idealLeft,
        };
      });

      // 2. Forward pass — push right so no chip overlaps the previous one.
      for (let i = 1; i < count; i++) {
        const minLeft = items[i - 1].left + items[i - 1].chipW + gap;
        if (items[i].left < minLeft) items[i].left = minLeft;
      }
      // 3. Backward pass — pull left so the last chip stays in bounds and any overlap
      // introduced by the forward pass is undone (total width always fits, so this
      // converges to a clean, non-overlapping, fully on-screen arrangement).
      if (count > 0 && items[count - 1].left + items[count - 1].chipW > rightBound) {
        items[count - 1].left = rightBound - items[count - 1].chipW;
      }
      for (let i = count - 2; i >= 0; i--) {
        const maxLeft = items[i + 1].left - gap - items[i].chipW;
        if (items[i].left > maxLeft) items[i].left = maxLeft;
      }

      items.forEach((it) => {
        map.set(it.index, {
          chipX: Math.max(inset, it.left),
          chipY: it.chipY,
          chipW: it.chipW,
          chipH,
          name: it.name,
          labelValue: it.labelValue,
        });
      });
    });

    return map;
  }, [
    isVertical,
    showLabels,
    plotWidth,
    sankeyLayout,
    data.nodes,
    formatter,
    totalValue,
    labelUnit,
    showPercentage,
    fontSize,
    semibold,
    regular,
    CHIP_PAD_X,
    CHIP_GAP,
    lineGap,
    theme,
  ]);

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

      // Slop widens the thin (progression-axis) dimension so the bar stays tappable:
      // that is the X axis for horizontal (thin width) and the Y axis for vertical
      // (thin height).
      const slopX = isVertical ? 0 : HIT_SLOP;
      const slopY = isVertical ? HIT_SLOP : 0;
      const hitNode = sankeyLayout.nodeLayouts.find(
        (node) =>
          px >= node.x - slopX &&
          px <= node.x + node.width + slopX &&
          py >= node.y - slopY &&
          py <= node.y + node.height + slopY,
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

      const hitLink = sankeyLayout.linkLayouts.find((link) =>
        isPointOnRibbon(px, py, link, HIT_SLOP, layout),
      );
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
    [
      sankeyLayout,
      data.nodes,
      data.links,
      PADDING.left,
      PADDING.top,
      onNodeClick,
      onLinkClick,
      isVertical,
      layout,
    ],
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
            <Svg
              width={size.width}
              height={size.height}
              pointerEvents="none"
              accessibilityRole="image"
              accessibilityLabel="Sankey flow diagram"
            >
              <G x={PADDING.left} y={PADDING.top}>
                {/* Links first so nodes + labels render above the ribbons */}
                {sankeyLayout.linkLayouts.map((link) => {
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
                      accessibilityLabel={`Link from ${
                        data.nodes[link.sourceIndex]?.name ?? ''
                      } to ${data.nodes[link.targetIndex]?.name ?? ''}: ${link.value}`}
                    />
                  );
                })}

                {sankeyLayout.nodeLayouts.map((node) => {
                  const nodeData = data.nodes[node.index] as SankeyDataNode | undefined;
                  if (!nodeData) return null;
                  const colorToken =
                    nodeColorOverride ??
                    nodeData.color ??
                    defaultColorTokens[node.index % defaultColorTokens.length];

                  // Build the label. Horizontal computes chip geometry inline (chip to
                  // the right of the bar). Vertical uses the precomputed, collision-
                  // resolved + clamped layout (chip below the bar) so labels never
                  // overlap a neighbour or clip off the narrow screen edges.
                  const labelElement = ((): React.ReactElement | null => {
                    if (!showLabels) return null;
                    let labelArgs: NodeLabelArgs;
                    if (isVertical) {
                      const vLabel = verticalLabels.get(node.index);
                      if (!vLabel || vLabel.chipW <= 0) return null;
                      labelArgs = {
                        chipX: vLabel.chipX,
                        chipY: vLabel.chipY,
                        chipW: vLabel.chipW,
                        chipH: vLabel.chipH,
                        nodeMidY: vLabel.chipY + vLabel.chipH / 2,
                        textX: vLabel.chipX + vLabel.chipW / 2,
                        textAnchor: 'middle',
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
                        name: vLabel.name,
                        labelValue: vLabel.labelValue,
                        shouldWrap: true,
                        semibold,
                        regular,
                      };
                    } else {
                      const humanized = formatter(node.value);
                      const levelCount = sankeyLayout.countPerDepth[node.depth] ?? 1;
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
                      const nodeMidY = node.y + node.height / 2;
                      const chipX = node.x + node.width + CHIP_GAP;
                      labelArgs = {
                        chipX,
                        chipY: nodeMidY - chipH / 2,
                        chipW,
                        chipH,
                        nodeMidY,
                        textX: chipX,
                        textAnchor: 'start',
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
                    }
                    return (showLabelChip ? renderChipLabel : renderPlainTextLabel)(labelArgs);
                  })();

                  return (
                    <SankeyNodeShape
                      key={`node-${node.index}`}
                      targetOpacity={getNodeOpacity(node.index)}
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      fill={resolveColor(colorToken)}
                      accessibilityLabel={`Node ${nodeData.name}: ${node.value}`}
                    >
                      {labelElement}
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
