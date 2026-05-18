import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type {
  SankeyGraph,
  SankeyNode as D3SankeyNode,
  SankeyLink as D3SankeyLink,
} from 'd3-sankey';
import { useChartsColorTheme } from '../utils';
import { SankeyChartProvider, useSankeyChartContext } from './SankeyChartContext';
import type { SankeyChartProps, SankeyLevelNode } from './types';
import { componentIds } from './componentIds';
import {
  LINK_DEFAULT_OPACITY,
  LINK_HOVER_OPACITY,
  LINK_DIMMED_OPACITY,
  NODE_DIMMED_OPACITY,
} from './tokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { castWebType } from '~utils';

// ─── Internal types ───────────────────────────────────────────────────────────

type FlatNode = SankeyLevelNode & { levelId: string };

type InternalNode = D3SankeyNode<{ originalIndex: number } & FlatNode, object>;

type InternalLink = D3SankeyLink<{ originalIndex: number } & FlatNode, object> & {
  originalIndex: number;
  label?: string;
};

type TooltipState = { visible: boolean; x: number; y: number; content: string };

// ── Label chip layout constants ───────────────────────────────────────────────
// Values are derived from Blade spacing tokens at render time (see nodeColor/chipGap below).
// CHIP_H    → theme.spacing[7] = 24px  (chip height)
// CHIP_PAD_X → theme.spacing[4] = 12px  (horizontal text padding inside chip)
// CHIP_GAP  → theme.spacing[3] = 8px   (gap between node bar and chip)

// ─── Inner chart ──────────────────────────────────────────────────────────────

function SankeyChartInner({
  levels,
  links,
  height = 400,
  nodeWidth = 20,
  nodePadding = 10,
  nodeColorOverride,
  linkColorOverride,
  showTooltip = true,
  showLabels = true,
  labelUnit,
  testID,
  onNodeClick,
  onLinkClick,
  ...restProps
}: SankeyChartProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: '' });
  const {
    hoveredNodeId,
    hoveredLinkId,
    setHoveredNodeId,
    setHoveredLinkId,
  } = useSankeyChartContext();

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const { theme } = useTheme();

  // Use faint-first (bar/default) sequence for the light pastel look.
  // Filter out gray.faint (#F9FAFB) which is near-white and invisible as a node fill.
  const defaultColorTokens = useChartsColorTheme({
    colorTheme: 'categorical',
  }).filter((t) => t !== 'data.background.categorical.gray.faint');

  const resolveColor = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tokenPath: string): string => (getIn(theme.colors, tokenPath as any) as string) ?? tokenPath,
    [theme],
  );

  const tooltipBg = theme.colors.surface.icon.staticBlack.normal;
  const tooltipTextColor = theme.colors.surface.text.staticWhite.normal;
  const labelNameColor = theme.colors.surface.text.gray.normal;
  const labelValueColor = theme.colors.surface.text.gray.muted;
  const chipBg = theme.colors.surface.background.gray.subtle;
  const chipShadow = castWebType(theme.elevation.midRaised);
  const chipRadius = theme.border.radius.large;
  const motionDuration = theme.motion.duration.gentle;
  const fontFamily = theme.typography.fonts.family.text;

  // Chip layout — derived from Blade spacing tokens
  const CHIP_H = theme.spacing[7]; // 24px
  const CHIP_PAD_X = theme.spacing[4]; // 12px
  const CHIP_GAP = theme.spacing[3]; // 8px

  // ── Responsiveness ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  // ── Flatten levels → single node array for d3-sankey ─────────────────────
  const flatNodes = useMemo<FlatNode[]>(
    () => levels.flatMap((level) => level.nodes.map((node) => ({ ...node, levelId: level.id }))),
    [levels],
  );

  // Map node id → flat array index (O(1) lookups)
  const nodeIdToIndex = useMemo(() => new Map(flatNodes.map((n, i) => [n.id, i])), [flatNodes]);

  // ── Color helpers ─────────────────────────────────────────────────────────
  const nodeColor = useCallback(
    (node: FlatNode, index: number): string => {
      const tokenPath =
        nodeColorOverride ?? node.color ?? defaultColorTokens[index % defaultColorTokens.length];
      return resolveColor(tokenPath);
    },
    [nodeColorOverride, defaultColorTokens, resolveColor],
  );

  const linkColor = useCallback(
    (srcNode: FlatNode, srcIndex: number): string => {
      const tokenPath =
        linkColorOverride ??
        nodeColorOverride ??
        srcNode.color ??
        defaultColorTokens[srcIndex % defaultColorTokens.length];
      return resolveColor(tokenPath);
    },
    [linkColorOverride, nodeColorOverride, defaultColorTokens, resolveColor],
  );

  // ── d3-sankey layout ──────────────────────────────────────────────────────
  const graph = useMemo<SankeyGraph<
    { originalIndex: number } & FlatNode,
    { originalIndex: number; label?: string }
  > | null>(() => {
    if (width === 0) return null;

    const leftMargin = 8;
    // Reserve exactly enough space for the longest chip in the dataset.
    // Chip width = name + " " + value + unit, estimated at 6px/char + horizontal padding.
    // This keeps the chart extent tight so nodes fill the available width.
    const rightMargin = showLabels
      ? (() => {
          const longestChip = flatNodes.reduce((max, node) => {
            const text = labelUnit != null ? `${node.name} 00,000 ${labelUnit}` : node.name;
            return Math.max(max, text.length);
          }, 0);
          return Math.min(longestChip * 6 + CHIP_PAD_X * 2 + CHIP_GAP + 8, 240);
        })()
      : 8;

    const sankeyGen = sankey<
      { originalIndex: number } & FlatNode,
      { originalIndex: number; label?: string }
    >()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [leftMargin, 8],
        [width - rightMargin, height - 8],
      ]);

    // Convert name-based links to numeric indices for d3-sankey
    const d3Links = links
      .map((l, i) => {
        const source = nodeIdToIndex.get(l.from);
        const target = nodeIdToIndex.get(l.to);
        if (source === undefined || target === undefined) return null;
        return { source, target, value: l.value, originalIndex: i, label: l.label };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    return sankeyGen({
      nodes: flatNodes.map((n, i) => ({ ...n, originalIndex: i })),
      links: d3Links,
    });
  }, [width, height, nodeWidth, nodePadding, flatNodes, nodeIdToIndex, links, showLabels]);

  // ── Opacity helpers (mirrors LineChart dimming pattern) ───────────────────
  const getNodeOpacity = useCallback(
    (nodeIdx: number): number => {
      if (hoveredNodeId === null && hoveredLinkId === null) return 1;
      if (hoveredNodeId === nodeIdx) return 1;
      if (hoveredLinkId !== null && graph) {
        const link = graph.links[hoveredLinkId] as InternalLink | undefined;
        if (link) {
          const src = (link.source as InternalNode).originalIndex;
          const tgt = (link.target as InternalNode).originalIndex;
          if (nodeIdx === src || nodeIdx === tgt) return 1;
        }
      }
      return NODE_DIMMED_OPACITY;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoveredNodeId, hoveredLinkId, graph],
  );

  const getLinkOpacity = useCallback(
    (linkIdx: number): number => {
      if (hoveredNodeId === null && hoveredLinkId === null) return LINK_DEFAULT_OPACITY;
      if (hoveredLinkId === linkIdx) return LINK_HOVER_OPACITY;
      if (hoveredNodeId !== null && graph) {
        const link = graph.links[linkIdx] as InternalLink;
        const src = (link.source as InternalNode).originalIndex;
        const tgt = (link.target as InternalNode).originalIndex;
        if (src === hoveredNodeId || tgt === hoveredNodeId) return LINK_HOVER_OPACITY;
      }
      return LINK_DIMMED_OPACITY;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoveredNodeId, hoveredLinkId, graph],
  );

  // ── Tooltip helpers ───────────────────────────────────────────────────────
  const showNodeTooltip = (e: React.MouseEvent, node: InternalNode): void => {
    if (!showTooltip) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top - 8,
      content: `${node.name}: ${node.value?.toLocaleString()}${labelUnit ? ` ${labelUnit}` : ''}`,
    });
  };

  const showLinkTooltip = (e: React.MouseEvent, link: InternalLink): void => {
    if (!showTooltip) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const src = (link.source as InternalNode).name;
    const tgt = (link.target as InternalNode).name;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top - 8,
      content:
        link.label ??
        `${src} → ${tgt}: ${link.value?.toLocaleString()}${labelUnit ? ` ${labelUnit}` : ''}`,
    });
  };

  const hideTooltip = (): void => setTooltip((t) => ({ ...t, visible: false }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BaseBox
      {...metaAttribute({ name: componentIds.SankeyChart, testID })}
      {...makeAnalyticsAttribute(restProps as Record<string, unknown>)}
      position="relative"
      width="100%"
    >
      <div ref={containerRef} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {width > 0 && graph && (
          <svg
            width={width}
            height={height}
            style={{ overflow: 'hidden', display: 'block' }}
            aria-label="Sankey Chart"
            role="img"
          >
            {/* Links */}
            <g>
              {(graph.links as InternalLink[]).map((link, i) => {
                const path = sankeyLinkHorizontal()(link as never) ?? '';
                const srcNode = link.source as InternalNode;
                const stroke = linkColor(flatNodes[srcNode.originalIndex], srcNode.originalIndex);

                return (
                  <path
                    key={i}
                    d={path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={Math.max(1, link.width ?? 1)}
                    strokeOpacity={getLinkOpacity(i)}
                    style={{
                      cursor: 'pointer',
                      transition: `stroke-opacity ${motionDuration}ms ${castWebType(
                        theme.motion.easing.standard,
                      )}`,
                    }}
                    onMouseEnter={(e) => {
                      setHoveredLinkId(i);
                      setHoveredNodeId(null);
                      showLinkTooltip(e, link);
                    }}
                    onMouseMove={(e) => showLinkTooltip(e, link)}
                    onMouseLeave={() => {
                      setHoveredLinkId(null);
                      hideTooltip();
                    }}
                    onClick={() => onLinkClick?.(links[link.originalIndex], link.originalIndex)}
                  />
                );
              })}
            </g>

            {/* Nodes + Label chips */}
            <g>
              {(graph.nodes as InternalNode[]).map((node, i) => {
                const x0 = node.x0 ?? 0;
                const x1 = node.x1 ?? 0;
                const y0 = node.y0 ?? 0;
                const y1 = node.y1 ?? 0;
                const color = nodeColor(flatNodes[node.originalIndex], node.originalIndex);
                const nodeMidY = (y0 + y1) / 2;

                const labelValue =
                  labelUnit != null ? `${node.value?.toLocaleString()} ${labelUnit}` : null;
                const fullText = labelValue ? `${node.name} ${labelValue}` : node.name;
                const chipX = x1 + CHIP_GAP;
                // Cap chip width so it never extends past the SVG right edge
                const chipW = Math.min(
                  Math.max(80, fullText.length * 6 + CHIP_PAD_X * 2),
                  width - chipX - 4,
                );
                const chipY = nodeMidY - CHIP_H / 2;

                return (
                  <g
                    key={i}
                    opacity={getNodeOpacity(node.originalIndex)}
                    style={{
                      transition: `opacity ${motionDuration}ms ${castWebType(
                        theme.motion.easing.standard,
                      )}`,
                    }}
                  >
                    {/* Node bar */}
                    <rect
                      x={x0}
                      y={y0}
                      width={x1 - x0}
                      height={Math.max(1, y1 - y0)}
                      fill={color}
                      rx={theme.border.radius.small}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        setHoveredNodeId(node.originalIndex);
                        setHoveredLinkId(null);
                        showNodeTooltip(e, node);
                      }}
                      onMouseMove={(e) => showNodeTooltip(e, node)}
                      onMouseLeave={() => {
                        setHoveredNodeId(null);
                        hideTooltip();
                      }}
                      onClick={() =>
                        onNodeClick?.(flatNodes[node.originalIndex], node.originalIndex)
                      }
                    />

                    {/* Label chip */}
                    {showLabels && (
                      <g style={{ pointerEvents: 'none' }}>
                        <rect
                          x={chipX}
                          y={chipY}
                          width={chipW}
                          height={CHIP_H}
                          fill={chipBg}
                          rx={chipRadius}
                          style={{ filter: `drop-shadow(${chipShadow})` }}
                        />
                        <text
                          x={chipX + CHIP_PAD_X}
                          y={nodeMidY}
                          dominantBaseline="middle"
                          fontSize={theme.typography.fonts.size[75]}
                          style={{ userSelect: 'none', fontFamily }}
                        >
                          <tspan
                            fontWeight={theme.typography.fonts.weight.semibold}
                            fill={labelNameColor}
                          >
                            {node.name}
                          </tspan>
                          {labelValue && (
                            <tspan fill={labelValueColor} dx={6}>
                              {labelValue}
                            </tspan>
                          )}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Tooltip */}
        {showTooltip && tooltip.visible && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              background: tooltipBg,
              color: tooltipTextColor,
              borderRadius: theme.border.radius.medium,
              fontSize: theme.typography.fonts.size[75],
              padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 100,
              boxShadow: castWebType(theme.elevation.highRaised),
              fontFamily,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </BaseBox>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

const _SankeyChart = (props: SankeyChartProps): React.ReactElement => (
  <SankeyChartProvider>
    <SankeyChartInner {...props} />
  </SankeyChartProvider>
);

export const SankeyChart = assignWithoutSideEffects(_SankeyChart, {
  componentId: componentIds.SankeyChart,
  displayName: 'SankeyChart',
});
