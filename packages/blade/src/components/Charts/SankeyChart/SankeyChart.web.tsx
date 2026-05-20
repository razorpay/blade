import React, { useCallback, useMemo, useState } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { NodeProps, LinkProps } from 'recharts/types/chart/Sankey';
import type { SankeyNode as RechartsSankeyNode } from 'recharts/types/util/types';
import { useChartsColorTheme } from '../utils';
import { CommonChartComponentsContext } from '../CommonChartComponents/CommonChartComponentsContext';
import type { DataColorMapping, ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { SankeyChartProps, SankeyDataNode } from './types';
import { componentIds } from './componentIds';
import {
  LINK_DEFAULT_OPACITY,
  LINK_HOVER_OPACITY,
  LINK_DIMMED_OPACITY,
  NODE_DEFAULT_OPACITY,
  NODE_DIMMED_OPACITY,
  NODE_WIDTH,
  CHIP_MIN_WIDTH,
  CHIP_MAX_WIDTH,
  CHIP_VALUE_BUDGET,
  CHIP_PX_PER_CHAR,
  NODE_MIN_HEIGHT,
  TOOLTIP_Z_INDEX,
  MIN_CHART_WIDTH,
} from './tokens';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

// ─── Hover state ──────────────────────────────────────────────────────────────

type HoverState = { type: 'node' | 'link'; index: number } | null;

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

  // Recharts Sankey passes node payload under payload[0].payload
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

// ─── Indian number humanizer ─────────────────────────────────────────────────
// Truncates (never rounds up) to avoid overstating values.
// Examples: 2550→2.5k, 17100→17.1k, 124500→1.24L, 1000000→10L, 15000000→1.5Cr

function humanizeIndian(value: number): string {
  if (value >= 1_00_00_000) {
    // Crore — truncate to 2 dp, strip trailing zeros
    const v = Math.floor((value / 1_00_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}Cr`;
  }
  if (value >= 1_00_000) {
    // Lakh — truncate to 2 dp, strip trailing zeros
    const v = Math.floor((value / 1_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}L`;
  }
  if (value >= 1_000) {
    // Thousands — truncate to 1 dp, strip trailing zeros
    const v = Math.floor((value / 1_000) * 10) / 10;
    return `${parseFloat(v.toFixed(1))}k`;
  }
  return String(value);
}

// ─── Inner chart ──────────────────────────────────────────────────────────────

function SankeyChartInner({
  data,
  height = 400,
  nodeColorOverride,
  linkColorOverride,
  showTooltip = true,
  showLabels = true,
  showLabelChip = true,
  labelUnit,
  testID,
  onNodeClick,
  onLinkClick,
  ...restProps
}: SankeyChartProps & TestID & DataAnalyticsAttribute): React.ReactElement {
  const [hovered, setHovered] = useState<HoverState>(null);

  // ── Theme tokens ────────────────────────────────────────────────────────
  const { theme } = useTheme();

  const defaultColorTokens = useChartsColorTheme({
    colorTheme: 'categorical',
  }).filter((t) => t !== 'data.background.categorical.gray.faint');

  const resolveColor = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tokenPath: string): string => (getIn(theme.colors, tokenPath as any) as string) ?? tokenPath,
    [theme],
  );

  // Chip layout — derived from Blade spacing tokens
  const CHIP_PAD_X = theme.spacing[3]; // 8px horizontal padding
  const CHIP_H = theme.typography.fonts.size[75] + theme.spacing[3] * 2; // 12 + 16 = 28px (8px top/bottom)
  const CHIP_GAP = theme.spacing[3]; // 8px
  const fontFamily = theme.typography.fonts.family.text;

  // Accurate text width measurement via Canvas API — avoids flat px-per-char estimates
  // that over/under-shoot on proportional fonts (narrow: i,l,1 / wide: W,M)
  const measureText = useCallback(
    (text: string, weight: number | string): number => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return text.length * CHIP_PX_PER_CHAR;
        ctx.font = `${weight} ${theme.typography.fonts.size[75]}px ${fontFamily}`;
        return ctx.measureText(text).width;
      } catch {
        return text.length * CHIP_PX_PER_CHAR;
      }
    },
    [fontFamily, theme],
  );
  const labelNameColor = theme.colors.surface.text.gray.normal;
  const labelValueColor = theme.colors.surface.text.gray.muted;
  const chipBg = theme.colors.surface.background.gray.intense;
  const chipBorderColor = theme.colors.interactive.border.gray.faded;
  const chipRadius = theme.border.radius.small;
  // NODE_PADDING derives from the Blade spacing scale
  const nodePadding = theme.spacing[4]; // 12px
  const motionDuration = theme.motion.duration.quick;

  // ── Color mapping ────────────────────────────────────────────────────────
  const dataColorMapping = useMemo<DataColorMapping>(() => {
    const mapping: DataColorMapping = {};
    data.nodes.forEach((node, i) => {
      const colorToken = (nodeColorOverride ??
        node.color ??
        defaultColorTokens[i % defaultColorTokens.length]) as ChartsCategoricalColorToken;
      mapping[node.id] = {
        colorToken,
        isCustomColor: Boolean(node.color ?? nodeColorOverride),
      };
    });
    return mapping;
  }, [data.nodes, nodeColorOverride, defaultColorTokens]);

  // ── Transform data to Recharts format ───────────────────────────────────
  const nodeIdToIndex = useMemo(() => new Map(data.nodes.map((n, i) => [n.id, i])), [data.nodes]);

  const rechartsLinks = useMemo(
    () =>
      data.links
        .map((l, i) => {
          const source = nodeIdToIndex.get(l.source);
          const target = nodeIdToIndex.get(l.target);
          if (source === undefined || target === undefined) return null;
          return { source, target, value: l.value, _originalIndex: i, label: l.label };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [data.links, nodeIdToIndex],
  );

  // Dynamic right margin — based on the widest chip across all nodes.
  // The value/percentage part budget (120px) covers "X.XXL unit  (100.0%)".
  // Falls back to CHIP_MIN_WIDTH for very short names.
  const dynamicRightMargin = useMemo(() => {
    if (!showLabels) return theme.spacing[3];
    if (!showLabelChip) {
      // Plain text — budget for widest (name + value+pct) just like chip mode, minus the chip padding
      const maxTextW = data.nodes.reduce((max, node) => {
        const nameW = measureText(node.name, theme.typography.fonts.weight.semibold);
        // Use same CHIP_VALUE_BUDGET for the value+pct portion
        return Math.max(max, nameW + theme.spacing[2] + CHIP_VALUE_BUDGET);
      }, 0);
      return Math.min(CHIP_MAX_WIDTH, maxTextW) + CHIP_GAP + theme.spacing[3];
    }
    // Chip mode — budget for name + value + percentage
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

  // Node depth map + count per level — used to suppress percentage when a
  // level has only one node (showing "100%" adds no information).
  const nodeDepthInfo = useMemo(() => {
    const incomingCount = new Map<string, number>(data.nodes.map((n) => [n.id, 0]));
    data.links.forEach((l) => incomingCount.set(l.target, (incomingCount.get(l.target) ?? 0) + 1));

    const outgoing = new Map<string, string[]>(data.nodes.map((n) => [n.id, []]));
    data.links.forEach((l) => outgoing.get(l.source)?.push(l.target));

    // BFS from root nodes (no incoming links)
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

    // Count nodes per depth level
    const countPerDepth = new Map<number, number>();
    depthOf.forEach((d) => countPerDepth.set(d, (countPerDepth.get(d) ?? 0) + 1));

    return { depthOf, countPerDepth };
  }, [data.nodes, data.links]);

  // Total value = sum of outflows from root nodes (nodes with no incoming links)
  // Used to compute each node's percentage of the overall flow
  const totalValue = useMemo(() => {
    const targetIds = new Set(data.links.map((l) => l.target));
    return data.links
      .filter((l) => !targetIds.has(l.source))
      .reduce((sum, l) => sum + l.value, 0);
  }, [data.links]);

  // ── Opacity helpers ──────────────────────────────────────────────────────
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

  // ── Custom node render ───────────────────────────────────────────────────
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
      const humanized = humanizeIndian(nodeValue);
      const nodeDepth = nodeDepthInfo.depthOf.get(nodeData.id) ?? 0;
      const levelCount = nodeDepthInfo.countPerDepth.get(nodeDepth) ?? 1;
      const pct = totalValue > 0 ? ((nodeValue / totalValue) * 100).toFixed(1) : '0.0';
      const valueText = labelUnit != null ? `${humanized} ${labelUnit}` : humanized;
      // Suppress percentage when this node is the only one at its depth level
      const labelValue = levelCount > 1 ? `${valueText}  (${pct}%)` : valueText;

      // ── Chip sizing ───────────────────────────────────────────────────────
      const fontSize = theme.typography.fonts.size[75]; // 12px
      const nameW = measureText(nodeData.name, theme.typography.fonts.weight.semibold);
      const labelW = measureText(labelValue, theme.typography.fonts.weight.regular);
      const contentW = nameW + theme.spacing[2] + labelW; // total inline width

      // Wrap when content + padding would exceed CHIP_MAX_WIDTH
      const shouldWrap = contentW + CHIP_PAD_X * 2 > CHIP_MAX_WIDTH;
      const chipW = shouldWrap
        // Hug the widest line — don't fill the full max width unnecessarily
        ? Math.min(CHIP_MAX_WIDTH, Math.max(CHIP_MIN_WIDTH, Math.max(nameW, labelW) + CHIP_PAD_X * 2))
        : Math.max(CHIP_MIN_WIDTH, contentW + CHIP_PAD_X * 2);

      // Two-line height: pad + line1 + gap + line2 + pad
      const lineGap = theme.spacing[2]; // 4px
      const chipH = shouldWrap
        ? theme.spacing[3] + fontSize + lineGap + fontSize + theme.spacing[3] // 8+12+4+12+8 = 44px
        : CHIP_H; // 28px single-line

      const chipY = nodeMidY - chipH / 2;
      const showChip = showLabels;

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

          {/* Label */}
          {showChip && (
            <g style={{ pointerEvents: 'none' }}>
              {showLabelChip ? (
                // ── Chip mode: styled card with value + percentage ──────────
                <>
                  <rect
                    x={chipX + theme.border.width.thin / 2}
                    y={chipY + theme.border.width.thin / 2}
                    width={chipW - theme.border.width.thin}
                    height={chipH - theme.border.width.thin}
                    fill={chipBg}
                    rx={chipRadius}
                    stroke={chipBorderColor}
                    strokeWidth={theme.border.width.thin}
                  />
                  {shouldWrap ? (
                    // Two-line: name on line 1, value+pct on line 2
                    <text
                      dominantBaseline="central"
                      fontSize={fontSize}
                      style={{ userSelect: 'none', fontFamily }}
                    >
                      <tspan
                        x={chipX + CHIP_PAD_X}
                        y={chipY + theme.spacing[3] + fontSize / 2}
                        fontWeight={theme.typography.fonts.weight.semibold}
                        fill={labelNameColor}
                      >
                        {nodeData.name}
                      </tspan>
                      <tspan
                        x={chipX + CHIP_PAD_X}
                        y={chipY + theme.spacing[3] + fontSize + lineGap + fontSize / 2}
                        fill={labelValueColor}
                      >
                        {labelValue}
                      </tspan>
                    </text>
                  ) : (
                    // Single-line: name + value inline
                    <text
                      x={chipX + CHIP_PAD_X}
                      y={chipY + chipH / 2}
                      dominantBaseline="central"
                      fontSize={fontSize}
                      style={{ userSelect: 'none', fontFamily }}
                    >
                      <tspan
                        fontWeight={theme.typography.fonts.weight.semibold}
                        fill={labelNameColor}
                      >
                        {nodeData.name}
                      </tspan>
                      <tspan fill={labelValueColor} dx={theme.spacing[2]}>
                        {labelValue}
                      </tspan>
                    </text>
                  )}
                </>
              ) : (
                // ── Plain text mode: same info as chip, no background rect ───
                shouldWrap ? (
                  // Two-line: name on line 1, value+pct on line 2
                  <text
                    dominantBaseline="central"
                    fontSize={fontSize}
                    style={{ userSelect: 'none', fontFamily }}
                  >
                    <tspan
                      x={chipX}
                      y={nodeMidY - fontSize / 2 - lineGap / 2}
                      fontWeight={theme.typography.fonts.weight.semibold}
                      fill={labelNameColor}
                    >
                      {nodeData.name}
                    </tspan>
                    <tspan
                      x={chipX}
                      y={nodeMidY + fontSize / 2 + lineGap / 2}
                      fontWeight={theme.typography.fonts.weight.regular}
                      fill={labelValueColor}
                    >
                      {labelValue}
                    </tspan>
                  </text>
                ) : (
                  // Single-line: name + value inline
                  <text
                    x={chipX}
                    y={nodeMidY}
                    dominantBaseline="central"
                    fontSize={fontSize}
                    style={{ userSelect: 'none', fontFamily }}
                  >
                    <tspan
                      fontWeight={theme.typography.fonts.weight.semibold}
                      fill={labelNameColor}
                    >
                      {nodeData.name}
                    </tspan>
                    <tspan
                      fontWeight={theme.typography.fonts.weight.regular}
                      fill={labelValueColor}
                      dx={theme.spacing[2]}
                    >
                      {labelValue}
                    </tspan>
                  </text>
                )
              )}
            </g>
          )}
        </g>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data.nodes,
      nodeColorOverride,
      defaultColorTokens,
      resolveColor,
      getNodeOpacity,
      showLabels,
      showLabelChip,
      labelUnit,
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
      CHIP_MAX_WIDTH,
      theme,
    ],
  );

  // ── Custom link render ───────────────────────────────────────────────────
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

      const srcNodeIndex =
        typeof payload.source === 'number'
          ? payload.source
          : (payload.source as RechartsSankeyNode & { index?: number })?.depth ?? 0;
      const srcNode = data.nodes[
        typeof payload.source === 'object'
          ? nodeIdToIndex.get(((payload.source as unknown) as { id?: string })?.id ?? '') ??
            srcNodeIndex
          : payload.source
      ] as SankeyDataNode | undefined;

      const colorToken =
        linkColorOverride ??
        nodeColorOverride ??
        (srcNode
          ? srcNode.color ??
            defaultColorTokens[data.nodes.indexOf(srcNode) % defaultColorTokens.length]
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

  // ── Event handlers ───────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(
    (item: NodeProps | LinkProps, type: 'node' | 'link'): void => {
      setHovered({ type, index: item.index });
    },
    [],
  );

  const handleMouseLeave = useCallback((): void => {
    setHovered(null);
  }, []);

  const handleClick = useCallback(
    (item: NodeProps | LinkProps, type: 'node' | 'link'): void => {
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <CommonChartComponentsContext.Provider value={{ chartName: 'sankey', dataColorMapping }}>
      <BaseBox
        {...metaAttribute({ name: componentIds.SankeyChart, testID })}
        {...makeAnalyticsAttribute(restProps as Record<string, unknown>)}
        position="relative"
        width="100%"
      >
        {/* Scroll wrapper — ensures minimum width on narrow viewports */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: MIN_CHART_WIDTH }}>
            <ResponsiveContainer width="100%" height={height}>
              <Sankey
                data={{ nodes: data.nodes, links: rechartsLinks }}
                nodeWidth={NODE_WIDTH}
                nodePadding={nodePadding}
                node={renderNode}
                link={renderLink}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onMouseEnter={handleMouseEnter as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onMouseLeave={handleMouseLeave as any}
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
            </ResponsiveContainer>
          </div>
        </div>
      </BaseBox>
    </CommonChartComponentsContext.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

const _SankeyChart = (
  props: SankeyChartProps & TestID & DataAnalyticsAttribute,
): React.ReactElement => <SankeyChartInner {...props} />;

export const SankeyChart = assignWithoutSideEffects(_SankeyChart, {
  componentId: componentIds.SankeyChart,
  displayName: 'SankeyChart',
});
