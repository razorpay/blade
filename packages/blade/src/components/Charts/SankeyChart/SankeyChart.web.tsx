import React, {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Sankey, ResponsiveContainer } from 'recharts';
import type { NodeProps, LinkProps } from 'recharts/types/chart/Sankey';
import type { SankeyNode as RechartsSankeyNode } from 'recharts/types/util/types';
import { useChartsColorTheme, assignDataColorMapping } from '../utils';
import { ChartTooltip } from '../CommonChartComponents';
import { CommonChartComponentsContext } from '../CommonChartComponents/CommonChartComponentsContext';
import { calculateTextWidth } from '../CommonChartComponents/utils';
import type { DataColorMapping, ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type {
  ChartSankeyWrapperProps,
  ChartSankeyProps,
  SankeyDataNode,
  SankeyTooltipContentProps,
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
  LABEL_MAX_WIDTH,
  COLOR_INDICATOR_SIZE,
  NODE_MIN_HEIGHT,
  TOOLTIP_Z_INDEX,
} from './tokens';
import { humanizeIndian } from './humanizeIndian';
import { fitLabelToWidth, formatSharePercentage } from './labelUtils';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

// ─── Private context (mirrors DonutContainerContext pattern) ──────────────────
// Passes wrapper-level config down to ChartSankey without prop drilling.

type SankeyChartContextType = {
  showTooltip: boolean;
  nodeColorOverride?: ChartsCategoricalColorToken;
  linkColorOverride?: ChartsCategoricalColorToken;
  defaultColorTokens: ChartsCategoricalColorToken[];
};

// Default is null — rendering ChartSankey outside ChartSankeyWrapper is detected and
// throws a descriptive Blade error rather than silently failing with an empty palette.
const SankeyChartContext = createContext<SankeyChartContextType | null>(null);

// Recharts derives a node's value from its links, so a node with no links (or an
// otherwise degenerate dataset) yields NaN geometry. Rendering that produces invalid
// SVG attributes, so skip the element instead.
const hasFiniteGeometry = (...values: number[]): boolean => values.every(Number.isFinite);

// ─── Hover state ──────────────────────────────────────────────────────────────

type HoverState = { type: 'node' | 'link'; index: number } | null;

// Recharts Sankey's event prop type is MouseEventHandler<SVGSVGElement> &
// ((item, type, e) => void) — an intersection TypeScript cannot satisfy with a
// plain callback. This module-level alias is cast through `any` at the call site.
type SankeyEventHandler = (item: NodeProps | LinkProps, type: 'node' | 'link') => void;

// ─── Tooltip content ──────────────────────────────────────────────────────────

function SankeyTooltipContent({
  active,
  payload,
  labelUnit,
}: SankeyTooltipContentProps): React.ReactElement | null {
  const { theme } = useTheme();

  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload as
    | (RechartsSankeyNode & { name?: string; value?: number })
    | undefined;
  if (!item) return null;

  const label = item.name ?? '';
  const value = item.value != null ? item.value.toLocaleString() : '';
  const content = `${label}: ${value}${labelUnit ? ` ${labelUnit}` : ''}`;

  return (
    <div
      style={{
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
      <Text size="small" weight="regular" color="surface.text.staticWhite.normal">
        {content}
      </Text>
    </div>
  );
}

// ─── Indian number humanizer (private default for formatValue) ────────────────
// ─── ChartSankeyWrapper ───────────────────────────────────────────────────────
// Orchestration layer — mirrors ChartDonutWrapper.
// Inspects children to extract data, computes dataColorMapping,
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

  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'sankey', dataColorMapping }}>
      <SankeyChartContext.Provider
        value={{ showTooltip, nodeColorOverride, linkColorOverride, defaultColorTokens }}
      >
        <BaseBox
          {...metaAttribute({ name: componentIds.ChartSankeyWrapper, testID })}
          {...makeAnalyticsAttribute(restProps)}
          width="100%"
          height="100%"
          {...restProps}
          position="relative"
        >
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </BaseBox>
      </SankeyChartContext.Provider>
    </CommonChartComponentsContext.Provider>
  );
};

/**
 * Orchestration wrapper for the Sankey flow diagram.
 * Computes colour mapping, provides chart context, and owns the responsive container.
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
// Pure functions extracted from renderNode to keep the useCallback lean.
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
  semibold,
  regular,
}: NodeLabelArgs): React.ReactElement {
  return (
    <>
      <rect
        x={labelX + borderThin / 2}
        y={chipY + borderThin / 2}
        width={chipW - borderThin}
        height={chipH - borderThin}
        fill={chipBg}
        rx={chipRadius}
        stroke={chipBorderColor}
        strokeWidth={borderThin}
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
    </>
  );
}

function renderPlainTextLabel({
  labelX,
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
    </>
  );
}

// ─── ChartSankey ──────────────────────────────────────────────────────────────
// Presentational layer — mirrors ChartDonut.
// Reads wrapper config from SankeyChartContext, manages local hover state only.

const _ChartSankey = ({
  data,
  showLabels = true,
  showLabelChip = true,
  showPercentage = true,
  labelUnit,
  labelDensity = 'normal',
  showColorIndicator = false,
  formatValue,
  onNodeClick,
  onLinkClick,
  // width and height are injected at runtime by ResponsiveContainer — not part of
  // the public ChartSankeyProps API. They must be forwarded to <Sankey> for the chart to render.
  width,
  height,
}: ChartSankeyProps & { width?: number; height?: number }): React.ReactElement => {
  const [hovered, setHovered] = useState<HoverState>(null);

  // Read wrapper-level config from private context.
  // null means ChartSankey was rendered outside ChartSankeyWrapper — throw a clear error.
  const sankeyCtx = useContext(SankeyChartContext);
  if (sankeyCtx === null) {
    throwBladeError({
      message: 'ChartSankey must be rendered as a direct child of ChartSankeyWrapper',
      moduleName: 'ChartSankey',
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { showTooltip, nodeColorOverride, linkColorOverride, defaultColorTokens } = sankeyCtx!;

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
  const fontFamily = theme.typography.fonts.family.text;
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
  const chipRadius = theme.border.radius.small;
  const nodePadding = theme.spacing[4]; // 12px
  const motionDuration = theme.motion.duration.quick;

  // ── Transform data to Recharts format ────────────────────────────────────
  const nodeIdToIndex = useMemo(() => new Map(data.nodes.map((n, i) => [n.id, i])), [data.nodes]);

  const rechartsLinks = useMemo(
    () =>
      data.links
        .map((l, i) => {
          const source = nodeIdToIndex.get(l.source);
          const target = nodeIdToIndex.get(l.target);
          if (source === undefined || target === undefined) return null;
          return { source, target, value: l.value, _originalIndex: i };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [data.links, nodeIdToIndex],
  );

  // Node depth map + count per level — suppress percentage for sole node at a level.
  // `maxDepth` identifies the rightmost column, the only one that needs right margin.
  const nodeDepthInfo = useMemo(() => {
    const incomingCount = new Map<string, number>(data.nodes.map((n) => [n.id, 0]));
    data.links.forEach((l) => incomingCount.set(l.target, (incomingCount.get(l.target) ?? 0) + 1));
    const outgoing = new Map<string, string[]>(data.nodes.map((n) => [n.id, []]));
    data.links.forEach((l) => outgoing.get(l.source)?.push(l.target));
    const depthOf = new Map<string, number>();
    const queue = data.nodes.filter((n) => incomingCount.get(n.id) === 0).map((n) => n.id);
    queue.forEach((id) => depthOf.set(id, 0));
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i];
      const d = depthOf.get(id) ?? 0;
      outgoing.get(id)?.forEach((tid) => {
        if (!depthOf.has(tid)) {
          depthOf.set(tid, d + 1);
          queue.push(tid);
        }
      });
    }
    const countPerDepth = new Map<number, number>();
    let maxDepth = 0;
    depthOf.forEach((d) => {
      countPerDepth.set(d, (countPerDepth.get(d) ?? 0) + 1);
      maxDepth = Math.max(maxDepth, d);
    });
    return { depthOf, countPerDepth, maxDepth };
  }, [data.nodes, data.links]);

  // Total value = sum of outflows from root nodes
  const totalValue = useMemo(() => {
    const targetIds = new Set(data.links.map((l) => l.target));
    return data.links.filter((l) => !targetIds.has(l.source)).reduce((sum, l) => sum + l.value, 0);
  }, [data.links]);

  // Node value = max(Σ incoming, Σ outgoing) — the same rule Recharts applies during layout,
  // computed here so every label's text (and so its width) is known before the layout runs.
  const nodeValues = useMemo(() => {
    const inSum = new Array<number>(data.nodes.length).fill(0);
    const outSum = new Array<number>(data.nodes.length).fill(0);
    rechartsLinks.forEach((l) => {
      outSum[l.source] += l.value;
      inSum[l.target] += l.value;
    });
    return data.nodes.map((_, i) => Math.max(inSum[i], outSum[i]));
  }, [data.nodes, rechartsLinks]);

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
    const maxContentWidth = LABEL_MAX_WIDTH - framePad - INDICATOR_RESERVE;

    return data.nodes.map((node, index) => {
      const value = nodeValues[index] ?? 0;
      const depth = nodeDepthInfo.depthOf.get(node.id) ?? 0;
      const levelCount = nodeDepthInfo.countPerDepth.get(depth) ?? 1;
      const share = totalValue > 0 ? (value / totalValue) * 100 : 0;
      const humanized = formatter(value);
      const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
      const fullValueText =
        showPercentage && levelCount > 1
          ? `${valueText}  (${formatSharePercentage(share)}%)`
          : valueText;
      const fitted = fitLabelToWidth({
        name: node.name,
        valueText: fullValueText,
        maxContentWidth,
        gap: TEXT_GAP,
        measureName,
        measureValue,
      });
      const contentWidth = INDICATOR_RESERVE + fitted.nameWidth + TEXT_GAP + fitted.valueWidth;
      const width = showLabelChip
        ? Math.max(CHIP_MIN_WIDTH, contentWidth + framePad)
        : contentWidth;
      return { name: fitted.name, labelValue: fitted.valueText, width };
    });
  }, [
    data.nodes,
    nodeValues,
    nodeDepthInfo,
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
  ]);

  // Dynamic right margin — room for the labels of the rightmost column only. Labels in earlier
  // columns sit in the gap before the next column, so reserving margin for them just shrank the chart.
  const dynamicRightMargin = useMemo(() => {
    if (!showLabels) return theme.spacing[3];
    const hasOutgoing = new Set(rechartsLinks.map((l) => l.source));
    const widest = data.nodes.reduce((max, node, index) => {
      const depth = nodeDepthInfo.depthOf.get(node.id) ?? 0;
      // Recharts' 'justify' alignment also draws nodes without outgoing links in the last column.
      const isLastColumn = depth === nodeDepthInfo.maxDepth || !hasOutgoing.has(index);
      return isLastColumn ? Math.max(max, nodeLabels[index]?.width ?? 0) : max;
    }, 0);
    return widest + CHIP_GAP + theme.spacing[3];
  }, [showLabels, data.nodes, rechartsLinks, nodeDepthInfo, nodeLabels, CHIP_GAP, theme]);

  // ── Opacity helpers ────────────────────────────────────────────────────────
  const getNodeOpacity = useCallback(
    (nodeIdx: number): number => {
      if (hovered === null) return NODE_DEFAULT_OPACITY;
      if (hovered.type === 'node' && hovered.index === nodeIdx) return NODE_DEFAULT_OPACITY;
      if (hovered.type === 'link') {
        const link = rechartsLinks[hovered.index];
        if (link && (link.source === nodeIdx || link.target === nodeIdx))
          return NODE_DEFAULT_OPACITY;
      }
      return NODE_DIMMED_OPACITY;
    },
    [hovered, rechartsLinks],
  );

  const getLinkOpacity = useCallback(
    (linkIdx: number): number => {
      if (hovered === null) return LINK_DEFAULT_OPACITY;
      if (hovered.type === 'link' && hovered.index === linkIdx) return LINK_HOVER_OPACITY;
      if (hovered.type === 'node') {
        const link = rechartsLinks[linkIdx];
        if (link && (link.source === hovered.index || link.target === hovered.index))
          return LINK_HOVER_OPACITY;
      }
      return LINK_DIMMED_OPACITY;
    },
    [hovered, rechartsLinks],
  );

  // ── Custom node render ─────────────────────────────────────────────────────
  const renderNode = useCallback(
    (props: NodeProps): React.ReactElement => {
      const { x, y, width, height: nodeHeight, index } = props;
      const nodeData = data.nodes[index] as SankeyDataNode | undefined;
      const label = nodeLabels[index];
      if (!nodeData || !label) return <g />;
      if (!hasFiniteGeometry(x, y, width, nodeHeight)) return <g />;

      const colorToken =
        nodeColorOverride ??
        nodeData.color ??
        defaultColorTokens[index % defaultColorTokens.length];
      const fill = resolveColor(colorToken);
      const opacity = getNodeOpacity(index);

      const nodeMidY = y + nodeHeight / 2;
      const labelX = x + width + CHIP_GAP;
      const fontSize = theme.typography.fonts.size[75];
      const chipY = nodeMidY - CHIP_H / 2;

      return (
        <g
          opacity={opacity}
          style={{
            transition: `opacity ${motionDuration}ms ${castWebType(theme.motion.easing.standard)}`,
          }}
        >
          {/* Node bar */}
          <rect
            x={x}
            y={y}
            width={width}
            height={Math.max(NODE_MIN_HEIGHT, nodeHeight)}
            fill={fill}
            rx={theme.border.radius.none}
            style={{ cursor: 'pointer' }}
          />

          {/* Label — delegated to renderChipLabel / renderPlainTextLabel helpers */}
          {showLabels && (
            <g style={{ pointerEvents: 'none' }}>
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
                chipBorderColor,
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
                semibold: theme.typography.fonts.weight.semibold,
                regular: theme.typography.fonts.weight.regular,
              })}
            </g>
          )}
        </g>
      );
    },
    [
      data.nodes,
      nodeLabels,
      nodeColorOverride,
      defaultColorTokens,
      resolveColor,
      getNodeOpacity,
      showLabels,
      showLabelChip,
      showColorIndicator,
      capHeightRatio,
      CHIP_H,
      CHIP_PAD_X,
      CHIP_GAP,
      TEXT_GAP,
      INDICATOR_RESERVE,
      fontFamily,
      labelNameColor,
      labelValueColor,
      chipBg,
      chipBorderColor,
      chipRadius,
      motionDuration,
      theme,
    ],
  );

  // ── Custom link render ─────────────────────────────────────────────────────
  const renderLink = useCallback(
    (props: LinkProps): React.ReactElement => {
      const {
        sourceX,
        targetX,
        sourceY,
        targetY,
        sourceControlX,
        targetControlX,
        linkWidth,
        index,
        payload,
      } = props;

      if (
        !hasFiniteGeometry(
          sourceX,
          targetX,
          sourceY,
          targetY,
          sourceControlX,
          targetControlX,
          linkWidth,
        )
      )
        return <path />;

      const resolveSourceIndex = (source: typeof payload.source): number => {
        if (typeof source === 'number') return source;
        const id = ((source as unknown) as { id?: string })?.id ?? '';
        return nodeIdToIndex.get(id) ?? 0;
      };
      const srcNodeIndex = resolveSourceIndex(payload.source);
      const srcNode = data.nodes[srcNodeIndex] as SankeyDataNode | undefined;

      const colorToken =
        linkColorOverride ??
        nodeColorOverride ??
        (srcNode
          ? srcNode.color ??
            // srcNodeIndex is already resolved above — O(1) map lookup, not O(n) indexOf
            defaultColorTokens[srcNodeIndex % defaultColorTokens.length]
          : defaultColorTokens[0]);
      const stroke = resolveColor(colorToken);
      const opacity = getLinkOpacity(index);

      const d = `
        M${sourceX},${sourceY + linkWidth / 2}
        C${sourceControlX},${sourceY + linkWidth / 2}
          ${targetControlX},${targetY + linkWidth / 2}
          ${targetX},${targetY + linkWidth / 2}
        L${targetX},${targetY - linkWidth / 2}
        C${targetControlX},${targetY - linkWidth / 2}
          ${sourceControlX},${sourceY - linkWidth / 2}
          ${sourceX},${sourceY - linkWidth / 2}
        Z
      `;

      return (
        <path
          d={d}
          fill={stroke}
          fillOpacity={opacity}
          style={{
            cursor: 'pointer',
            transition: `fill-opacity ${motionDuration}ms ${castWebType(
              theme.motion.easing.standard,
            )}`,
          }}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // castWebType is module-level — stable, intentionally omitted
    [
      data.nodes,
      nodeIdToIndex,
      linkColorOverride,
      nodeColorOverride,
      defaultColorTokens,
      resolveColor,
      getLinkOpacity,
      motionDuration,
      theme,
    ],
  );

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handleMouseEnter = useCallback<SankeyEventHandler>((item, type): void => {
    setHovered({ type, index: item.index });
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setHovered(null);
  }, []);

  const handleClick = useCallback<SankeyEventHandler>(
    (item, type): void => {
      if (type === 'node') {
        const nodeData = data.nodes[item.index];
        if (nodeData) onNodeClick?.(nodeData, item.index);
      } else {
        const link = rechartsLinks[item.index];
        if (link !== undefined) {
          const originalLink = data.links[link._originalIndex];
          if (originalLink) onLinkClick?.(originalLink, link._originalIndex);
        }
      }
    },
    [data.nodes, data.links, rechartsLinks, onNodeClick, onLinkClick],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Sankey
      data={{ nodes: data.nodes, links: rechartsLinks }}
      width={width}
      height={height}
      nodeWidth={NODE_WIDTH}
      nodePadding={nodePadding}
      node={renderNode}
      link={renderLink}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMouseEnter={handleMouseEnter as any}
      onMouseLeave={handleMouseLeave}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={handleClick as any}
      margin={{
        top: theme.spacing[3],
        right: dynamicRightMargin,
        bottom: theme.spacing[3],
        left: theme.spacing[3],
      }}
    >
      {showTooltip && (
        <ChartTooltip
          isAnimationActive={false}
          content={(tooltipProps) => (
            <SankeyTooltipContent
              active={tooltipProps.active}
              payload={tooltipProps.payload}
              labelUnit={labelUnit}
            />
          )}
        />
      )}
    </Sankey>
  );
};

/**
 * Presentational layer for the Sankey flow diagram.
 * Renders nodes, link ribbons, and labels; delegates colour and tooltip config
 * to the parent `<ChartSankeyWrapper>`.
 * Must be rendered as a direct child of `<ChartSankeyWrapper>`.
 *
 * @example
 * <Box height="420px">
 *   <ChartSankeyWrapper>
 *     <ChartSankey
 *     data={{ nodes, links }}
 *     showLabels
 *     showLabelChip
 *     labelUnit="txn"
 *     onNodeClick={(node, i) => console.log(node, i)}
 *   />
 *   </ChartSankeyWrapper>
 * </Box>
 */
export const ChartSankey = assignWithoutSideEffects(_ChartSankey, {
  componentId: componentIds.ChartSankey,
});
