import React, {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { NodeProps, LinkProps } from 'recharts/types/chart/Sankey';
import type { SankeyNode as RechartsSankeyNode } from 'recharts/types/util/types';
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
  CHIP_MAX_WIDTH,
  CHIP_VALUE_BUDGET,
  NODE_MIN_HEIGHT,
  TOOLTIP_Z_INDEX,
  MIN_CHART_WIDTH,
} from './tokens';
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

// ─── Hover state ──────────────────────────────────────────────────────────────

type HoverState = { type: 'node' | 'link'; index: number } | null;

// Recharts Sankey's event prop type is MouseEventHandler<SVGSVGElement> &
// ((item, type, e) => void) — an intersection TypeScript cannot satisfy with a
// plain callback. This module-level alias is cast through `any` at the call site.
type SankeyEventHandler = (item: NodeProps | LinkProps, type: 'node' | 'link') => void;

// ─── Tooltip content ──────────────────────────────────────────────────────────

type SankeyTooltipContentProps = {
  active?: boolean;
  payload?: TooltipContentProps<number, string>['payload'];
  labelUnit?: string;
};

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
// Truncates (never rounds up) to avoid overstating values.
// Examples: 2550→2.5k, 17100→17.1k, 124500→1.24L, 1000000→10L, 15000000→1.5Cr

function humanizeIndian(value: number): string {
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
}

// ─── ChartSankeyWrapper ───────────────────────────────────────────────────────
// Orchestration layer — mirrors ChartDonutWrapper.
// Inspects children to extract data, computes dataColorMapping,
// provides CommonChartComponentsContext + private SankeyChartContext.

const _ChartSankeyWrapper = ({
  children,
  height = 400,
  width,
  showTooltip = true,
  nodeColorOverride,
  linkColorOverride,
  testID,
  ...restProps
}: ChartSankeyWrapperProps): React.ReactElement => {
  // Categorical palette — same filter used in DonutChart (gray.faint is near-white).
  // Memoised so the filtered array reference is stable across renders and downstream
  // useMemo/useCallback hooks that depend on it don't recompute needlessly.
  const allColorTokens = useChartsColorTheme({ colorTheme: 'categorical' });
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
          {...makeAnalyticsAttribute(restProps as Record<string, unknown>)}
          position="relative"
          width="100%"
        >
          {/* Scroll wrapper — ensures minimum width on narrow viewports */}
          <BaseBox width="100%" overflowX="auto">
            <BaseBox minWidth={`${MIN_CHART_WIDTH}px`}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <ResponsiveContainer width={(width ?? '100%') as any} height={height}>
                {children}
              </ResponsiveContainer>
            </BaseBox>
          </BaseBox>
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
 * <ChartSankeyWrapper height={420} showTooltip>
 *   <ChartSankey data={{ nodes, links }} labelUnit="txn" />
 * </ChartSankeyWrapper>
 */
export const ChartSankeyWrapper = assignWithoutSideEffects(_ChartSankeyWrapper, {
  componentId: componentIds.ChartSankeyWrapper,
});

// ─── Node label render helpers ───────────────────────────────────────────────
// Pure functions extracted from renderNode to keep the useCallback lean.
// All positional/style data is passed explicitly so there are no hidden closures.

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
  semibold: number | string;
  regular: number | string;
};

function renderChipLabel({
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
}: NodeLabelArgs): React.ReactElement {
  return (
    <>
      <rect
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
        <text fontSize={fontSize} style={{ userSelect: 'none', fontFamily }}>
          <tspan
            x={chipX + chipPadX}
            y={chipY + lineGap * 2 + (fontSize * (1 + capHeightRatio)) / 2}
            fontWeight={semibold}
            fill={labelNameColor}
          >
            {name}
          </tspan>
          <tspan
            x={chipX + chipPadX}
            y={chipY + lineGap * 2 + fontSize + lineGap + (fontSize * (1 + capHeightRatio)) / 2}
            fontWeight={regular}
            fill={labelValueColor}
          >
            {labelValue}
          </tspan>
        </text>
      ) : (
        <text
          x={chipX + chipPadX}
          y={chipY + (chipH + fontSize * capHeightRatio) / 2}
          fontSize={fontSize}
          style={{ userSelect: 'none', fontFamily }}
        >
          <tspan fontWeight={semibold} fill={labelNameColor}>
            {name}
          </tspan>
          <tspan fontWeight={regular} fill={labelValueColor} dx={lineGap}>
            {labelValue}
          </tspan>
        </text>
      )}
    </>
  );
}

function renderPlainTextLabel({
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
}: NodeLabelArgs): React.ReactElement {
  if (shouldWrap) {
    return (
      <text fontSize={fontSize} style={{ userSelect: 'none', fontFamily }}>
        <tspan
          x={chipX}
          y={nodeMidY - (fontSize + lineGap) / 2}
          fontWeight={semibold}
          fill={labelNameColor}
        >
          {name}
        </tspan>
        <tspan
          x={chipX}
          y={nodeMidY + (fontSize + lineGap) / 2}
          fontWeight={regular}
          fill={labelValueColor}
        >
          {labelValue}
        </tspan>
      </text>
    );
  }
  return (
    <text
      x={chipX}
      y={nodeMidY + (fontSize * capHeightRatio) / 2}
      fontSize={fontSize}
      style={{ userSelect: 'none', fontFamily }}
    >
      <tspan fontWeight={semibold} fill={labelNameColor}>
        {name}
      </tspan>
      <tspan fontWeight={regular} fill={labelValueColor} dx={lineGap}>
        {labelValue}
      </tspan>
    </text>
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
  const CHIP_H = theme.typography.fonts.size[75] + theme.spacing[3] * 2; // 28px single-line
  const CHIP_GAP = theme.spacing[3]; // 8px
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
        // skipPadding: return the bare canvas pixel width so shouldWrap decisions
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

  // Dynamic right margin — based on widest chip across all nodes
  const dynamicRightMargin = useMemo(() => {
    if (!showLabels) return theme.spacing[3];
    if (!showLabelChip) {
      const maxTextW = data.nodes.reduce((max, node) => {
        const nameW = measureText(node.name, theme.typography.fonts.weight.semibold);
        return Math.max(max, nameW + theme.spacing[2] + CHIP_VALUE_BUDGET);
      }, 0);
      return Math.min(CHIP_MAX_WIDTH, maxTextW) + CHIP_GAP + theme.spacing[3];
    }
    const maxChipW = data.nodes.reduce((max, node) => {
      const nameW = measureText(node.name, theme.typography.fonts.weight.semibold);
      const chipW = Math.min(
        CHIP_MAX_WIDTH,
        Math.max(CHIP_MIN_WIDTH, nameW + theme.spacing[2] + CHIP_VALUE_BUDGET + CHIP_PAD_X * 2),
      );
      return Math.max(max, chipW);
    }, 0);
    return maxChipW + CHIP_GAP + theme.spacing[3];
  }, [showLabels, showLabelChip, data.nodes, measureText, theme, CHIP_PAD_X, CHIP_GAP]);

  // Node depth map + count per level — suppress percentage for sole node at a level
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
    depthOf.forEach((d) => countPerDepth.set(d, (countPerDepth.get(d) ?? 0) + 1));
    return { depthOf, countPerDepth };
  }, [data.nodes, data.links]);

  // Total value = sum of outflows from root nodes
  const totalValue = useMemo(() => {
    const targetIds = new Set(data.links.map((l) => l.target));
    return data.links.filter((l) => !targetIds.has(l.source)).reduce((sum, l) => sum + l.value, 0);
  }, [data.links]);

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
      const { x, y, width, height: nodeHeight, index, payload } = props;
      const nodeData = data.nodes[index] as SankeyDataNode | undefined;
      if (!nodeData) return <g />;

      const colorToken =
        nodeColorOverride ??
        nodeData.color ??
        defaultColorTokens[index % defaultColorTokens.length];
      const fill = resolveColor(colorToken);
      const opacity = getNodeOpacity(index);

      const nodeMidY = y + nodeHeight / 2;
      const chipX = x + width + CHIP_GAP;
      const nodeValue = payload.value ?? 0;
      const formatter = formatValue ?? humanizeIndian;
      const humanized = formatter(nodeValue);
      const nodeDepth = nodeDepthInfo.depthOf.get(nodeData.id) ?? 0;
      const levelCount = nodeDepthInfo.countPerDepth.get(nodeDepth) ?? 1;
      const pct = totalValue > 0 ? Math.round((nodeValue / totalValue) * 100) : 0;
      const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
      const labelValue = showPercentage && levelCount > 1 ? `${valueText}  (${pct}%)` : valueText;

      const fontSize = theme.typography.fonts.size[75];
      const nameW = measureText(nodeData.name, theme.typography.fonts.weight.semibold);
      const labelW = measureText(labelValue, theme.typography.fonts.weight.regular);
      const contentW = nameW + theme.spacing[2] + labelW;

      const shouldWrap = contentW + CHIP_PAD_X * 2 > CHIP_MAX_WIDTH;
      const chipW = shouldWrap
        ? Math.min(
            CHIP_MAX_WIDTH,
            Math.max(CHIP_MIN_WIDTH, Math.max(nameW, labelW) + CHIP_PAD_X * 2),
          )
        : Math.max(CHIP_MIN_WIDTH, contentW + CHIP_PAD_X * 2);

      const lineGap = theme.spacing[2]; // 4px — fixed y-formula gives 16px baseline-to-baseline at size[75]
      const chipH = shouldWrap
        ? theme.spacing[3] + fontSize + lineGap + fontSize + theme.spacing[3]
        : CHIP_H;

      const chipY = nodeMidY - chipH / 2;

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
                borderThin: theme.border.width.thin,
                capHeightRatio,
                name: nodeData.name,
                labelValue,
                shouldWrap,
                semibold: theme.typography.fonts.weight.semibold,
                regular: theme.typography.fonts.weight.regular,
              })}
            </g>
          )}
        </g>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // CHIP_MAX_WIDTH is a module-level constant — stable, intentionally omitted
    [
      data.nodes,
      nodeColorOverride,
      defaultColorTokens,
      resolveColor,
      getNodeOpacity,
      showLabels,
      showLabelChip,
      showPercentage,
      labelUnit,
      formatValue,
      capHeightRatio,
      CHIP_H,
      CHIP_PAD_X,
      CHIP_GAP,
      fontFamily,
      labelNameColor,
      labelValueColor,
      chipBg,
      chipBorderColor,
      chipRadius,
      motionDuration,
      measureText,
      totalValue,
      nodeDepthInfo,
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
        <Tooltip
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
 * <ChartSankeyWrapper height={420}>
 *   <ChartSankey
 *     data={{ nodes, links }}
 *     showLabels
 *     showLabelChip
 *     labelUnit="txn"
 *     onNodeClick={(node, i) => console.log(node, i)}
 *   />
 * </ChartSankeyWrapper>
 */
export const ChartSankey = assignWithoutSideEffects(_ChartSankey, {
  componentId: componentIds.ChartSankey,
});
