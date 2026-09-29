import React, {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents/CommonChartComponentsContext';
import { calculateTextWidth } from '../CommonChartComponents/utils';
import type { DataColorMapping, ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { ChartSankeyWrapperProps, ChartSankeyProps, SankeyDataNode } from './types';
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
  LABEL_MAX_WIDTH,
  GROUP_LABEL_MAX_WIDTH,
  COLOR_INDICATOR_SIZE,
  NODE_MIN_HEIGHT,
  TOOLTIP_Z_INDEX,
  GROUP_NODE_COLOR_TOKEN,
  GROUP_CHEVRON_SIZE,
  TOOLTIP_MAX_MEMBERS,
  TOOLTIP_OFFSET,
} from './tokens';
import { humanizeIndian } from './humanizeIndian';
import { fitLabelToWidth, formatShareDetailed, formatSharePercentage } from './labelUtils';
import { computeSankeyLayout } from './layout';
import type { SankeyLayoutLink } from './layout';
import { groupSankeyData, getGroupId, computeDepths } from './grouping';
import type { GroupedSankeyNode, SankeyGroup } from './grouping';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useControllableState } from '~utils/useControllable';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { opacity } from '~tokens/global';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { ChevronDownIcon } from '~components/Icons';

// ─── Private context (mirrors DonutContainerContext pattern) ──────────────────
// Passes wrapper-level config — and the measured container size — down to ChartSankey.

type SankeyChartContextType = {
  showTooltip: boolean;
  nodeColorOverride?: ChartsCategoricalColorToken;
  linkColorOverride?: ChartsCategoricalColorToken;
  defaultColorTokens: ChartsCategoricalColorToken[];
  /** Measured width of the wrapper, 0 until the first layout pass */
  width: number;
  /** Measured height of the wrapper, 0 until the first layout pass */
  height: number;
};

// Default is null — rendering ChartSankey outside ChartSankeyWrapper is detected and
// throws a descriptive Blade error rather than silently failing with an empty palette.
const SankeyChartContext = createContext<SankeyChartContextType | null>(null);

// A node with no links (or an otherwise degenerate dataset) has no value to lay out and
// yields NaN geometry. Rendering that produces invalid SVG attributes, so skip the element.
const hasFiniteGeometry = (...values: number[]): boolean => values.every(Number.isFinite);

const EMPTY_IDS: string[] = [];
const EMPTY_DEPTHS: number[] = [];

// ─── Hover state ──────────────────────────────────────────────────────────────

type HoverState = { type: 'node' | 'link'; index: number } | null;

// ─── Tooltip ──────────────────────────────────────────────────────────────────

/** The box a tooltip hangs from: a node's label chip, or a zero-size point on a ribbon */
type TooltipAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Distance kept between the anchor box and the tooltip */
  gap: number;
};

type TooltipModel = {
  anchor: TooltipAnchor;
  content: React.ReactNode;
};

/**
 * Hover tooltip. It hangs below its anchor, left-aligned with it, so it never covers the
 * label it describes; near the bottom edge it flips above the anchor, and near the right
 * edge it slides left to stay inside the chart. Measures itself after paint to do so.
 */
function SankeyTooltip({
  anchor,
  bounds,
  children,
}: {
  anchor: TooltipAnchor;
  bounds: { width: number; height: number };
  children: React.ReactNode;
}): React.ReactElement {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.width !== size.width || rect.height !== size.height) {
      setSize({ width: rect.width, height: rect.height });
    }
  });

  const below = anchor.y + anchor.height + anchor.gap;
  const fitsBelow = below + size.height <= bounds.height;
  const top = Math.max(0, fitsBelow ? below : anchor.y - anchor.gap - size.height);
  const left = Math.max(0, Math.min(anchor.x, bounds.width - size.width));

  return (
    <div
      ref={ref}
      {...metaAttribute({ name: componentIds.ChartSankeyTooltip })}
      style={{
        position: 'absolute',
        left,
        top,
        // surface.icon.staticBlack.normal is the token used by CommonChartComponents tooltip.
        // The icon→surface semantic mismatch is a known issue to fix system-wide separately.
        backgroundColor: theme.colors.surface.icon.staticBlack.normal,
        borderRadius: theme.border.radius.large,
        border: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.muted}`,
        padding: theme.spacing[4],
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: TOOLTIP_Z_INDEX,
        boxShadow: castWebType(theme.elevation.highRaised),
      }}
    >
      {children}
    </div>
  );
}

// ─── ChartSankeyWrapper ───────────────────────────────────────────────────────
// Orchestration layer — mirrors ChartDonutWrapper.
// Inspects children to extract data, computes dataColorMapping, measures the container,
// provides CommonChartComponentsContext + private SankeyChartContext.

const _ChartSankeyWrapper = ({
  children,
  showTooltip = true,
  colorTheme = 'categorical',
  nodeColorOverride,
  linkColorOverride,
  testID,
  ...restProps
}: ChartSankeyWrapperProps): React.ReactElement => {
  // Categorical palette — same filter used in DonutChart (gray.faint is near-white).
  // Memoised so the filtered array reference is stable across renders and downstream
  // useMemo/useCallback hooks that depend on it don't recompute needlessly.
  const allColorTokens = useChartsColorTheme({ colorTheme });
  const defaultColorTokens = useMemo(
    () => allColorTokens.filter((t) => t !== 'data.background.categorical.gray.faint'),
    [allColorTokens],
  );

  // Extract data from the ChartSankey child to compute dataColorMapping ahead of render.
  // children is typed as React.ReactElement so no array traversal needed — check directly.
  const data = useMemo(
    () =>
      isValidElement(children) && getComponentId(children) === componentIds.ChartSankey
        ? (children.props as ChartSankeyProps).data
        : { nodes: [], links: [] },
    [children],
  );

  // Build dataColorMapping for CommonChartComponentsContext.
  // Pre-populate explicit overrides then fill the rest with assignDataColorMapping().
  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    data.nodes.forEach((node) => {
      const override = nodeColorOverride ?? node.color;
      mapping[node.id] = {
        // Entries without an explicit override use undefined as a placeholder;
        // assignDataColorMapping() fills in the real palette token afterwards.
        // Cast is narrower than `as any` — undefined is intentional here, not a type escape.
        colorToken: override as ChartsCategoricalColorToken,
        isCustomColor: Boolean(override),
      };
    });
    assignDataColorMapping(mapping, defaultColorTokens);
    return mapping;
  }, [data.nodes, nodeColorOverride, defaultColorTokens]);

  // The chart fills the wrapper. Its size is measured here (and observed for resizes) and
  // handed down through context; the drawing may grow taller than this when groups expand.
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useIsomorphicLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const measure = (): void => {
      const rect = element.getBoundingClientRect();
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const contextValue = useMemo(
    () => ({
      showTooltip,
      nodeColorOverride,
      linkColorOverride,
      defaultColorTokens,
      width: size.width,
      height: size.height,
    }),
    [
      showTooltip,
      nodeColorOverride,
      linkColorOverride,
      defaultColorTokens,
      size.width,
      size.height,
    ],
  );

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'sankey', dataColorMapping }}>
      <SankeyChartContext.Provider value={contextValue}>
        <BaseBox
          {...metaAttribute({ name: componentIds.ChartSankeyWrapper, testID })}
          {...makeAnalyticsAttribute(restProps)}
          width="100%"
          height="100%"
          {...restProps}
          position="relative"
        >
          <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}
          </div>
        </BaseBox>
      </SankeyChartContext.Provider>
    </CommonChartComponentsContext.Provider>
  );
};

/**
 * Orchestration wrapper for the Sankey flow diagram.
 * Computes colour mapping, provides chart context, and measures the container.
 * Must contain exactly one `<ChartSankey>` child.
 *
 * @example
 * <Box height="420px">
 *   <ChartSankeyWrapper showTooltip>
 *     <ChartSankey data={{ nodes, links }} labelUnit="txn" />
 *   </ChartSankeyWrapper>
 * </Box>
 */
export const ChartSankeyWrapper = assignWithoutSideEffects(_ChartSankeyWrapper, {
  componentId: componentIds.ChartSankeyWrapper,
});

// ─── Node label render helpers ───────────────────────────────────────────────
// Pure functions extracted from the node render to keep it lean.
// All positional/style data is passed explicitly so there are no hidden closures.
// Labels are always a single line — `fitLabelToWidth` trims a long name with an ellipsis
// (the full name stays in the tooltip) instead of wrapping onto a second line.

type NodeLabelArgs = {
  /** Left edge of the label: the chip edge, or the text start in plain-text mode */
  labelX: number;
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
  /** Opacity of the chip border stroke; 1 unless the chip marks a revealed group member */
  chipBorderOpacity: number;
  chipRadius: number;
  chipPadX: number;
  /** Gap between the name and the value text */
  textGap: number;
  borderThin: number;
  capHeightRatio: number;
  name: string;
  labelValue: string;
  /** Fill of the colour indicator dot; undefined renders no dot */
  indicatorColor?: string;
  indicatorSize: number;
  /** Horizontal space the dot and its gap take up before the text (0 when there is no dot) */
  indicatorReserve: number;
  /** Icon drawn at the trailing end of the label (a group's chevron); undefined renders none */
  trailingIcon?: React.ReactNode;
  trailingIconSize: number;
  /** Stroke drawn around the chip while it has keyboard focus */
  focusStrokeColor?: string;
  semibold: number | string;
  regular: number | string;
};

function renderChipLabel({
  labelX,
  chipY,
  chipW,
  chipH,
  fontSize,
  fontFamily,
  labelNameColor,
  labelValueColor,
  chipBg,
  chipBorderColor,
  chipBorderOpacity,
  chipRadius,
  chipPadX,
  textGap,
  borderThin,
  capHeightRatio,
  name,
  labelValue,
  indicatorColor,
  indicatorSize,
  indicatorReserve,
  trailingIcon,
  trailingIconSize,
  focusStrokeColor,
  semibold,
  regular,
}: NodeLabelArgs): React.ReactElement {
  const strokeWidth = focusStrokeColor ? borderThin * 2 : borderThin;
  return (
    <>
      <rect
        x={labelX + borderThin / 2}
        y={chipY + borderThin / 2}
        width={chipW - borderThin}
        height={chipH - borderThin}
        fill={chipBg}
        rx={chipRadius}
        stroke={focusStrokeColor ?? chipBorderColor}
        strokeOpacity={focusStrokeColor ? 1 : chipBorderOpacity}
        strokeWidth={strokeWidth}
      />
      {indicatorColor !== undefined && (
        <circle
          cx={labelX + chipPadX + indicatorSize / 2}
          cy={chipY + chipH / 2}
          r={indicatorSize / 2}
          fill={indicatorColor}
        />
      )}
      <text
        x={labelX + chipPadX + indicatorReserve}
        y={chipY + (chipH + fontSize * capHeightRatio) / 2}
        fontSize={fontSize}
        style={{ userSelect: 'none', fontFamily }}
      >
        <tspan fontWeight={semibold} fill={labelNameColor}>
          {name}
        </tspan>
        <tspan fontWeight={regular} fill={labelValueColor} dx={textGap}>
          {labelValue}
        </tspan>
      </text>
      {trailingIcon !== undefined && (
        <g
          transform={`translate(${labelX + chipW - chipPadX - trailingIconSize}, ${
            chipY + (chipH - trailingIconSize) / 2
          })`}
        >
          {trailingIcon}
        </g>
      )}
    </>
  );
}

function renderPlainTextLabel({
  labelX,
  chipW,
  nodeMidY,
  fontSize,
  fontFamily,
  labelNameColor,
  labelValueColor,
  textGap,
  capHeightRatio,
  name,
  labelValue,
  indicatorColor,
  indicatorSize,
  indicatorReserve,
  trailingIcon,
  trailingIconSize,
  semibold,
  regular,
}: NodeLabelArgs): React.ReactElement {
  return (
    <>
      {indicatorColor !== undefined && (
        <circle
          cx={labelX + indicatorSize / 2}
          cy={nodeMidY}
          r={indicatorSize / 2}
          fill={indicatorColor}
        />
      )}
      <text
        x={labelX + indicatorReserve}
        y={nodeMidY + (fontSize * capHeightRatio) / 2}
        fontSize={fontSize}
        style={{ userSelect: 'none', fontFamily }}
      >
        <tspan fontWeight={semibold} fill={labelNameColor}>
          {name}
        </tspan>
        <tspan fontWeight={regular} fill={labelValueColor} dx={textGap}>
          {labelValue}
        </tspan>
      </text>
      {trailingIcon !== undefined && (
        <g
          transform={`translate(${labelX + chipW - trailingIconSize}, ${
            nodeMidY - trailingIconSize / 2
          })`}
        >
          {trailingIcon}
        </g>
      )}
    </>
  );
}

// ─── Graph helpers ────────────────────────────────────────────────────────────

/**
 * Column info for the (grouped) graph: the shared BFS depth map from `grouping.ts`
 * plus the nodes-per-depth counts and the last column's depth derived on top of it,
 * so the depth rule itself is written once.
 */
const computeDepthInfo = (
  nodes: readonly { id: string }[],
  links: readonly { source: string; target: string }[],
): { depthOf: Map<string, number>; countPerDepth: Map<number, number>; maxDepth: number } => {
  const depthOf = computeDepths(nodes, links);
  const countPerDepth = new Map<number, number>();
  let maxDepth = 0;
  depthOf.forEach((d) => {
    countPerDepth.set(d, (countPerDepth.get(d) ?? 0) + 1);
    maxDepth = Math.max(maxDepth, d);
  });
  return { depthOf, countPerDepth, maxDepth };
};

const isActivationKey = (key: string): boolean => key === 'Enter' || key === ' ';

// True when the browser would show a focus ring for this element, i.e. keyboard focus.
// Older engines without `:focus-visible` fall back to showing the ring on every focus.
const isFocusVisible = (element: Element): boolean => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
};

// ─── ChartSankey ──────────────────────────────────────────────────────────────
// Presentational layer — mirrors ChartDonut.
// Reads wrapper config from SankeyChartContext, owns the layout and hover/expand state,
// and draws nodes, ribbons, labels and the tooltip.

const _ChartSankey = ({
  data,
  showLabels = true,
  showLabelChip = true,
  showPercentage = true,
  labelUnit,
  labelDensity = 'normal',
  showColorIndicator = false,
  groupNodesBelow,
  formatGroupLabel,
  defaultExpandedGroupDepths,
  expandedGroupDepths: expandedGroupDepthsProp,
  onExpandChange,
  formatValue,
  onNodeClick,
  onLinkClick,
}: ChartSankeyProps): React.ReactElement | null => {
  const [hovered, setHovered] = useState<HoverState>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Read wrapper-level config from private context.
  // null means ChartSankey was rendered outside ChartSankeyWrapper — throw a clear error.
  const sankeyCtx = useContext(SankeyChartContext);
  if (sankeyCtx === null) {
    throwBladeError({
      message: 'ChartSankey must be rendered as a direct child of ChartSankeyWrapper',
      moduleName: 'ChartSankey',
    });
  }
  const {
    showTooltip,
    nodeColorOverride,
    linkColorOverride,
    defaultColorTokens,
    width,
    height,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = sankeyCtx!;

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const { theme } = useTheme();

  const resolveColor = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tokenPath: string): string => (getIn(theme.colors, tokenPath as any) as string) ?? tokenPath,
    [theme],
  );

  // Chip layout — derived from Blade spacing tokens
  const CHIP_PAD_X = theme.spacing[3]; // 8px horizontal padding
  // 'normal' → 8px vertical padding (28px chip); 'compact' → 4px (20px chip), both at size[75] text
  const CHIP_PAD_Y = labelDensity === 'compact' ? theme.spacing[2] : theme.spacing[3];
  const CHIP_H = theme.typography.fonts.size[75] + CHIP_PAD_Y * 2;
  const CHIP_GAP = theme.spacing[3]; // 8px between the node bar and its label
  const TEXT_GAP = theme.spacing[2]; // 4px between the name and the value text
  // Colour dot plus its gap to the text, reserved at the start of every label when enabled
  const INDICATOR_RESERVE = showColorIndicator ? COLOR_INDICATOR_SIZE + theme.spacing[2] : 0;
  // Chevron plus its gap, reserved at the end of a group's label
  const CHEVRON_RESERVE = GROUP_CHEVRON_SIZE + theme.spacing[2];
  const fontFamily = theme.typography.fonts.family.text;
  const fontSize = theme.typography.fonts.size[75];
  // Imported from tokens.ts — see LABEL_CAP_HEIGHT_RATIO for derivation notes.
  const capHeightRatio = LABEL_CAP_HEIGHT_RATIO;

  // Canvas-based text width measurement — delegates to calculateTextWidth from CommonChartComponents.
  // Uses size[75] (node labels are larger than the default size[50] used by axis labels) and
  // accepts a per-call fontWeight override so name vs value segments can use different weights.
  const measureText = useCallback(
    (text: string, weight: number | string): number =>
      calculateTextWidth(text, theme, {
        fontSize: theme.typography.fonts.size[75],
        fontWeight: weight,
        // skipPadding: return the bare canvas pixel width so truncation and chip widths
        // use actual glyph widths rather than the MIN_WIDTH-floored chip widths
        // that calculateTextWidth normally returns for axis label chips.
        skipPadding: true,
      }).width,
    [theme],
  );

  const labelNameColor = theme.colors.surface.text.gray.normal;
  const labelValueColor = theme.colors.surface.text.gray.muted;
  const chipBg = theme.colors.surface.background.gray.intense;
  const chipBorderColor = theme.colors.interactive.border.gray.faded;
  const chipFocusColor = theme.colors.surface.border.primary.normal;
  // Members shown out of a group: the primary border at 64% opacity (Blade's `opacity[800]`).
  // Clear against the grey chip border, softer than the solid primary used for the focus ring.
  const revealedChipBorderColor = theme.colors.surface.border.primary.normal;
  const revealedChipBorderOpacity = opacity[800];
  const chipRadius = theme.border.radius.small;
  const nodePadding = theme.spacing[4]; // 12px
  const motionDuration = theme.motion.duration.quick;
  const transition = `opacity ${motionDuration}ms ${castWebType(theme.motion.easing.standard)}`;

  // ── Grouping ──────────────────────────────────────────────────────────────
  const isGroupingEnabled = groupNodesBelow !== undefined && groupNodesBelow > 0;

  // Expanded groups are keyed by column depth in the public API (mirroring Accordion's
  // numeric `expandedIndex`), so no internal id scheme leaks into consumer code. The
  // grouping transform works in the internal group ids, translated right here.
  const [expandedGroupDepths, setExpandedGroupDepths] = useControllableState<number[]>({
    value: expandedGroupDepthsProp,
    defaultValue: defaultExpandedGroupDepths ?? EMPTY_DEPTHS,
    onChange: (depths, extra: { groupDepth: number; isExpanded: boolean; memberIds: string[] }) =>
      onExpandChange?.({ expandedGroupDepths: depths, ...extra }),
  });

  const grouped = useMemo(
    () =>
      groupSankeyData({
        nodes: data.nodes,
        links: data.links,
        groupNodesBelow,
        expandedGroupIds: expandedGroupDepths.map(getGroupId),
        formatGroupLabel,
      }),
    [data.nodes, data.links, groupNodesBelow, expandedGroupDepths, formatGroupLabel],
  );

  // The fully folded graph fixes the scale, so expanding a group never shrinks the others.
  const foldedGrouped = useMemo(
    () =>
      isGroupingEnabled && expandedGroupDepths.length > 0
        ? groupSankeyData({
            nodes: data.nodes,
            links: data.links,
            groupNodesBelow,
            expandedGroupIds: EMPTY_IDS,
            formatGroupLabel,
          })
        : grouped,
    [
      isGroupingEnabled,
      expandedGroupDepths.length,
      data.nodes,
      data.links,
      groupNodesBelow,
      formatGroupLabel,
      grouped,
    ],
  );

  const toggleGroup = useCallback(
    (group: SankeyGroup): void => {
      setExpandedGroupDepths(
        (prev) =>
          group.isExpanded ? prev.filter((depth) => depth !== group.depth) : [...prev, group.depth],
        false,
        { groupDepth: group.depth, isExpanded: !group.isExpanded, memberIds: group.memberIds },
      );
    },
    [setExpandedGroupDepths],
  );

  // ── Graph info on the (grouped) graph ─────────────────────────────────────
  const nodes = grouped.nodes;
  const nodeIdToIndex = useMemo(() => new Map(nodes.map((entry, i) => [entry.node.id, i])), [
    nodes,
  ]);

  const layoutLinks = useMemo<SankeyLayoutLink[]>(
    () =>
      grouped.links.map((link) => ({
        source: nodeIdToIndex.get(link.source) ?? 0,
        target: nodeIdToIndex.get(link.target) ?? 0,
        value: link.value,
      })),
    [grouped.links, nodeIdToIndex],
  );

  // Depth per node — suppresses the percentage for a sole node at a level and identifies the
  // rightmost column, the only one that needs right margin.
  const depthInfo = useMemo(
    () =>
      computeDepthInfo(
        nodes.map((entry) => entry.node),
        grouped.links,
      ),
    [nodes, grouped.links],
  );

  // Node value = max(Σ incoming, Σ outgoing) — the same rule the layout applies, computed here
  // so every label's text (and so its width) is known before the layout runs.
  const nodeValues = useMemo(() => {
    const inSum = new Array<number>(nodes.length).fill(0);
    const outSum = new Array<number>(nodes.length).fill(0);
    layoutLinks.forEach((l) => {
      outSum[l.source] += l.value;
      inSum[l.target] += l.value;
    });
    return nodes.map((_, i) => Math.max(inSum[i], outSum[i]));
  }, [nodes, layoutLinks]);

  const totalValue = grouped.total;

  // Label text and width per node. Labels are single-line: the value text is kept whole and
  // the name is truncated with an ellipsis so the label fits LABEL_MAX_WIDTH. The tooltip
  // always shows the full name.
  const nodeLabels = useMemo(() => {
    const semibold = theme.typography.fonts.weight.semibold;
    const regular = theme.typography.fonts.weight.regular;
    const formatter = formatValue ?? humanizeIndian;
    const measureName = (text: string): number => measureText(text, semibold);
    const measureValue = (text: string): number => measureText(text, regular);
    // Chip padding only exists in chip mode; plain text gets the whole budget.
    const framePad = showLabelChip ? CHIP_PAD_X * 2 : 0;

    return nodes.map((entry, index) => {
      const value = nodeValues[index] ?? 0;
      const depth = depthInfo.depthOf.get(entry.node.id) ?? 0;
      const levelCount = depthInfo.countPerDepth.get(depth) ?? 1;
      const share = totalValue > 0 ? (value / totalValue) * 100 : 0;
      const humanized = formatter(value);
      const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
      const fullValueText =
        showPercentage && levelCount > 1
          ? `${valueText}  (${formatSharePercentage(share)}%)`
          : valueText;
      const trailingReserve = entry.group ? CHEVRON_RESERVE : 0;
      const fitted = fitLabelToWidth({
        name: entry.node.name,
        valueText: fullValueText,
        maxContentWidth:
          (entry.group ? GROUP_LABEL_MAX_WIDTH : LABEL_MAX_WIDTH) -
          framePad -
          INDICATOR_RESERVE -
          trailingReserve,
        gap: TEXT_GAP,
        measureName,
        measureValue,
      });
      const contentWidth =
        INDICATOR_RESERVE + fitted.nameWidth + TEXT_GAP + fitted.valueWidth + trailingReserve;
      const labelWidth = showLabelChip
        ? Math.max(CHIP_MIN_WIDTH, contentWidth + framePad)
        : contentWidth;
      return { name: fitted.name, labelValue: fitted.valueText, width: labelWidth, value, share };
    });
  }, [
    nodes,
    nodeValues,
    depthInfo,
    totalValue,
    formatValue,
    labelUnit,
    showPercentage,
    showLabelChip,
    measureText,
    theme,
    CHIP_PAD_X,
    TEXT_GAP,
    INDICATOR_RESERVE,
    CHEVRON_RESERVE,
  ]);

  // Dynamic right margin — room for the labels of the rightmost column only. Labels in earlier
  // columns sit in the gap before the next column, so reserving margin for them just shrank the chart.
  const dynamicRightMargin = useMemo(() => {
    if (!showLabels) return theme.spacing[3];
    const hasOutgoing = new Set(layoutLinks.map((l) => l.source));
    const widest = nodes.reduce((max, entry, index) => {
      const depth = depthInfo.depthOf.get(entry.node.id) ?? 0;
      // 'justify' alignment also draws nodes without outgoing links in the last column.
      const isLastColumn = depth === depthInfo.maxDepth || !hasOutgoing.has(index);
      return isLastColumn ? Math.max(max, nodeLabels[index]?.width ?? 0) : max;
    }, 0);
    return widest + CHIP_GAP + theme.spacing[3];
  }, [showLabels, nodes, layoutLinks, depthInfo, nodeLabels, CHIP_GAP, theme]);

  // ── Layout ────────────────────────────────────────────────────────────────
  const margin = useMemo(
    () => ({
      top: theme.spacing[3],
      right: dynamicRightMargin,
      bottom: theme.spacing[3],
      left: theme.spacing[3],
    }),
    [theme, dynamicRightMargin],
  );
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // With grouping on, the scale comes from the fully folded graph at the container height,
  // so bars and ribbons keep their size when a group is expanded.
  const lockedScale = useMemo(() => {
    if (!isGroupingEnabled) return undefined;
    const foldedIdToIndex = new Map(foldedGrouped.nodes.map((entry, i) => [entry.node.id, i]));
    return computeSankeyLayout({
      nodeCount: foldedGrouped.nodes.length,
      links: foldedGrouped.links.map((link) => ({
        source: foldedIdToIndex.get(link.source) ?? 0,
        target: foldedIdToIndex.get(link.target) ?? 0,
        value: link.value,
      })),
      width: plotWidth,
      height: plotHeight,
      nodeWidth: NODE_WIDTH,
      nodePadding,
    }).scale;
  }, [isGroupingEnabled, foldedGrouped, plotWidth, plotHeight, nodePadding]);

  const layout = useMemo(
    () =>
      computeSankeyLayout({
        nodeCount: nodes.length,
        links: layoutLinks,
        width: plotWidth,
        height: plotHeight,
        nodeWidth: NODE_WIDTH,
        nodePadding,
        offsetX: margin.left,
        offsetY: margin.top,
        scale: lockedScale,
        // In grouping mode every node reserves room for its label, so revealed members never
        // stack their labels; the drawing grows below the container instead.
        minNodeExtent: isGroupingEnabled && showLabels ? () => CHIP_H : undefined,
      }),
    [
      nodes.length,
      layoutLinks,
      plotWidth,
      plotHeight,
      nodePadding,
      margin,
      lockedScale,
      isGroupingEnabled,
      showLabels,
      CHIP_H,
    ],
  );
  const svgHeight = layout.contentHeight + margin.top + margin.bottom;

  // ── Colours ───────────────────────────────────────────────────────────────
  const colorTokenFor = useCallback(
    (entry: GroupedSankeyNode): string => {
      if (nodeColorOverride) return nodeColorOverride;
      if (entry.group) return GROUP_NODE_COLOR_TOKEN;
      // Palette position follows the consumer's node order, so grouping never shifts colours.
      return (
        entry.node.color ??
        defaultColorTokens[(entry.originalIndex ?? 0) % defaultColorTokens.length]
      );
    },
    [nodeColorOverride, defaultColorTokens],
  );

  // ── Opacity helpers ────────────────────────────────────────────────────────
  const getNodeOpacity = useCallback(
    (nodeIdx: number): number => {
      if (hovered === null) return NODE_DEFAULT_OPACITY;
      if (hovered.type === 'node' && hovered.index === nodeIdx) return NODE_DEFAULT_OPACITY;
      if (hovered.type === 'link') {
        const link = layoutLinks[hovered.index];
        if (link && (link.source === nodeIdx || link.target === nodeIdx))
          return NODE_DEFAULT_OPACITY;
      }
      return NODE_DIMMED_OPACITY;
    },
    [hovered, layoutLinks],
  );

  const getLinkOpacity = useCallback(
    (linkIdx: number): number => {
      if (hovered === null) return LINK_DEFAULT_OPACITY;
      if (hovered.type === 'link' && hovered.index === linkIdx) return LINK_HOVER_OPACITY;
      if (hovered.type === 'node') {
        const link = layoutLinks[linkIdx];
        if (link && (link.source === hovered.index || link.target === hovered.index))
          return LINK_HOVER_OPACITY;
      }
      return LINK_DIMMED_OPACITY;
    },
    [hovered, layoutLinks],
  );

  // ── Event handlers ─────────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (index: number): void => {
      const entry = nodes[index];
      if (!entry) return;
      if (entry.group) {
        toggleGroup(entry.group);
        return;
      }
      if (entry.originalIndex !== null) onNodeClick?.(entry.node, entry.originalIndex);
    },
    [nodes, toggleGroup, onNodeClick],
  );

  // A revealed member's label folds its group again; its bar behaves like any other node.
  const handleLabelActivate = useCallback(
    (index: number): void => {
      const entry = nodes[index];
      if (!entry) return;
      const group =
        entry.group ??
        (entry.revealedGroupId
          ? grouped.groups.find((g) => g.id === entry.revealedGroupId)
          : undefined);
      if (group) toggleGroup(group);
    },
    [nodes, grouped.groups, toggleGroup],
  );

  const handleLinkClick = useCallback(
    (index: number): void => {
      const link = grouped.links[index];
      if (!link) return;
      onLinkClick?.(
        { source: link.source, target: link.target, value: link.value },
        link.originalIndex,
      );
    },
    [grouped.links, onLinkClick],
  );

  // ── Tooltip content ────────────────────────────────────────────────────────
  const unitSuffix = labelUnit ? ` ${labelUnit}` : '';

  const tooltip = useMemo<TooltipModel | null>(() => {
    if (!showTooltip || hovered === null) return null;

    if (hovered.type === 'link') {
      const link = grouped.links[hovered.index];
      const geometry = layout.links[hovered.index];
      if (!link || !geometry) return null;
      const sourceName = nodes[geometry.source]?.node.name ?? link.source;
      const targetName = nodes[geometry.target]?.node.name ?? link.target;
      return {
        // A ribbon has no label to avoid: hang the tooltip off its midpoint.
        anchor: {
          x: geometry.controlX + TOOLTIP_OFFSET,
          y: (geometry.sourceY + geometry.targetY) / 2,
          width: 0,
          height: 0,
          gap: TOOLTIP_OFFSET,
        },
        content: (
          <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
            {`${sourceName} → ${targetName}: ${link.value.toLocaleString()}${unitSuffix}`}
          </Text>
        ),
      };
    }

    const entry = nodes[hovered.index];
    const geometry = layout.nodes[hovered.index];
    const label = nodeLabels[hovered.index];
    if (!entry || !geometry || !label) return null;
    // Hang the tooltip below the node's label chip so the label stays readable while hovering.
    const nodeMidY = geometry.barY + geometry.barHeight / 2;
    const anchor: TooltipAnchor = {
      x: geometry.x + geometry.width + CHIP_GAP,
      y: nodeMidY - CHIP_H / 2,
      width: label.width,
      height: CHIP_H,
      gap: theme.spacing[2],
    };

    if (!entry.group) {
      return {
        anchor,
        content: (
          <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
            {`${entry.node.name}: ${label.value.toLocaleString()}${unitSuffix}`}
          </Text>
        ),
      };
    }

    // A group lists what it stands for: its total, then each member with its share.
    const { group } = entry;
    const shown = group.members.slice(0, TOOLTIP_MAX_MEMBERS);
    const hidden = group.members.length - shown.length;
    // Same value rule as the labels and the grouping threshold: max(Σ incoming, Σ outgoing).
    const memberInSum = new Map<string, number>();
    const memberOutSum = new Map<string, number>();
    data.links.forEach((link) => {
      memberOutSum.set(link.source, (memberOutSum.get(link.source) ?? 0) + link.value);
      memberInSum.set(link.target, (memberInSum.get(link.target) ?? 0) + link.value);
    });
    return {
      anchor,
      content: (
        <>
          <Text size="small" weight="semibold" color="surface.text.staticWhite.normal">
            {entry.node.name}
          </Text>
          <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
            {`${label.value.toLocaleString()}${unitSuffix} · ${formatShareDetailed(label.share)}%`}
          </Text>
          <div
            style={{
              marginTop: theme.spacing[3],
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[1],
            }}
          >
            {shown.map((member) => {
              const memberValue = Math.max(
                memberInSum.get(member.id) ?? 0,
                memberOutSum.get(member.id) ?? 0,
              );
              const memberShare = totalValue > 0 ? (memberValue / totalValue) * 100 : 0;
              return (
                <Text
                  key={member.id}
                  size="xsmall"
                  weight="regular"
                  color="surface.text.staticWhite.normal"
                >
                  {`${member.name}  ${formatShareDetailed(memberShare)}%`}
                </Text>
              );
            })}
            {hidden > 0 && (
              <Text size="xsmall" weight="regular" color="surface.text.staticWhite.normal">
                {`and ${hidden} more`}
              </Text>
            )}
          </div>
        </>
      ),
    };
  }, [
    showTooltip,
    hovered,
    grouped.links,
    layout,
    nodes,
    nodeLabels,
    data.links,
    totalValue,
    unitSuffix,
    theme,
    CHIP_GAP,
    CHIP_H,
  ]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (width <= 0 || height <= 0) return null;

  const renderedLinks = layout.links.map((link) => {
    if (
      !hasFiniteGeometry(
        link.sourceX,
        link.targetX,
        link.sourceY,
        link.targetY,
        link.controlX,
        link.width,
      )
    )
      return null;
    const sourceEntry = nodes[link.source];
    const colorToken =
      linkColorOverride ??
      nodeColorOverride ??
      (sourceEntry ? colorTokenFor(sourceEntry) : defaultColorTokens[0]);
    const half = link.width / 2;
    const d = `
      M${link.sourceX},${link.sourceY + half}
      C${link.controlX},${link.sourceY + half}
        ${link.controlX},${link.targetY + half}
        ${link.targetX},${link.targetY + half}
      L${link.targetX},${link.targetY - half}
      C${link.controlX},${link.targetY - half}
        ${link.controlX},${link.sourceY - half}
        ${link.sourceX},${link.sourceY - half}
      Z
    `;
    return (
      <path
        key={`${link.source}-${link.target}-${link.index}`}
        d={d}
        fill={resolveColor(colorToken)}
        fillOpacity={getLinkOpacity(link.index)}
        style={{
          cursor: 'pointer',
          transition: `fill-opacity ${motionDuration}ms ${castWebType(
            theme.motion.easing.standard,
          )}`,
        }}
        onMouseEnter={() => setHovered({ type: 'link', index: link.index })}
        onMouseLeave={() => setHovered(null)}
        onClick={() => handleLinkClick(link.index)}
      />
    );
  });

  const renderedNodes = layout.nodes.map((nodeLayout) => {
    const { index } = nodeLayout;
    const entry = nodes[index];
    const label = nodeLabels[index];
    if (!entry || !label) return null;
    if (!hasFiniteGeometry(nodeLayout.x, nodeLayout.barY, nodeLayout.barHeight)) return null;

    const fill = resolveColor(colorTokenFor(entry));
    const isGroup = Boolean(entry.group);
    const isRevealed = Boolean(entry.revealedGroupId);
    const isInteractiveLabel = showLabels && (isGroup || isRevealed);
    const nodeMidY = nodeLayout.barY + nodeLayout.barHeight / 2;
    const labelX = nodeLayout.x + nodeLayout.width + CHIP_GAP;
    const chipY = nodeMidY - CHIP_H / 2;
    const groupSize = entry.group?.members.length ?? 0;

    return (
      <g
        key={entry.node.id}
        opacity={getNodeOpacity(index)}
        style={{ transition }}
        onMouseEnter={() => setHovered({ type: 'node', index })}
        onMouseLeave={() => setHovered(null)}
        onClick={() => handleNodeClick(index)}
      >
        {/* Node bar */}
        <rect
          x={nodeLayout.x}
          y={nodeLayout.barY}
          width={nodeLayout.width}
          height={Math.max(NODE_MIN_HEIGHT, nodeLayout.barHeight)}
          fill={fill}
          rx={theme.border.radius.none}
          style={{ cursor: 'pointer' }}
        />

        {/* Label — a group's label (and a revealed member's) is a button that toggles the group */}
        {showLabels && (
          <g
            style={{ pointerEvents: isInteractiveLabel ? 'auto' : 'none', cursor: 'pointer' }}
            {...(isInteractiveLabel
              ? {
                  role: 'button',
                  tabIndex: 0,
                  'aria-expanded': isRevealed,
                  'aria-label': isGroup
                    ? `${entry.node.name}, ${groupSize} grouped nodes`
                    : `${entry.node.name}, grouped node`,
                  onClick: (event: React.MouseEvent<SVGGElement>) => {
                    event.stopPropagation();
                    handleLabelActivate(index);
                  },
                  onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
                    if (!isActivationKey(event.key)) return;
                    event.preventDefault();
                    event.stopPropagation();
                    handleLabelActivate(index);
                  },
                  onFocus: (event: React.FocusEvent<SVGGElement>) => {
                    // Ring only for keyboard focus (`:focus-visible`), never for a mouse click.
                    if (isFocusVisible(event.currentTarget)) setFocusedNodeId(entry.node.id);
                    setHovered({ type: 'node', index });
                  },
                  onBlur: () => {
                    setFocusedNodeId(null);
                    setHovered(null);
                  },
                }
              : {})}
          >
            {(showLabelChip ? renderChipLabel : renderPlainTextLabel)({
              labelX,
              chipY,
              chipW: label.width,
              chipH: CHIP_H,
              nodeMidY,
              fontSize,
              fontFamily,
              labelNameColor,
              labelValueColor,
              chipBg,
              // Members shown out of a group carry a light primary border: they belong together
              // and each folds the group again.
              chipBorderColor: isRevealed ? revealedChipBorderColor : chipBorderColor,
              chipBorderOpacity: isRevealed ? revealedChipBorderOpacity : 1,
              chipRadius,
              chipPadX: CHIP_PAD_X,
              textGap: TEXT_GAP,
              borderThin: theme.border.width.thin,
              capHeightRatio,
              name: label.name,
              labelValue: label.labelValue,
              indicatorColor: showColorIndicator ? fill : undefined,
              indicatorSize: COLOR_INDICATOR_SIZE,
              indicatorReserve: INDICATOR_RESERVE,
              trailingIcon: isGroup ? (
                <ChevronDownIcon size="small" color="surface.icon.gray.muted" />
              ) : undefined,
              trailingIconSize: GROUP_CHEVRON_SIZE,
              focusStrokeColor: focusedNodeId === entry.node.id ? chipFocusColor : undefined,
              semibold: theme.typography.fonts.weight.semibold,
              regular: theme.typography.fonts.weight.regular,
            })}
          </g>
        )}
      </g>
    );
  });

  return (
    // Absolutely positioned so a drawing taller than the container (expanded groups) overflows
    // it instead of resizing it — the consumer's scroll container takes it from there.
    <div style={{ position: 'absolute', top: 0, left: 0, width, height: svgHeight }}>
      <svg width={width} height={svgHeight} style={{ display: 'block', overflow: 'visible' }}>
        <g>{renderedLinks}</g>
        <g>{renderedNodes}</g>
      </svg>
      {tooltip && (
        <SankeyTooltip anchor={tooltip.anchor} bounds={{ width, height: svgHeight }}>
          {tooltip.content}
        </SankeyTooltip>
      )}
    </div>
  );
};

/**
 * Presentational layer for the Sankey flow diagram.
 * Lays out and renders nodes, link ribbons, labels and the tooltip; delegates colour
 * config and sizing to the parent `<ChartSankeyWrapper>`.
 * Must be rendered as a direct child of `<ChartSankeyWrapper>`.
 *
 * @example
 * <Box height="420px">
 *   <ChartSankeyWrapper>
 *     <ChartSankey
 *       data={{ nodes, links }}
 *       labelUnit="txn"
 *       groupNodesBelow={2}
 *       onNodeClick={(node, i) => console.log(node, i)}
 *     />
 *   </ChartSankeyWrapper>
 * </Box>
 */
export const ChartSankey = assignWithoutSideEffects(_ChartSankey, {
  componentId: componentIds.ChartSankey,
});

export type { SankeyDataNode };
