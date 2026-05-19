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
  NODE_PADDING,
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

// ─── Inner chart ──────────────────────────────────────────────────────────────

function SankeyChartInner({
  data,
  height = 400,
  nodeColorOverride,
  linkColorOverride,
  showTooltip = true,
  showLabels = true,
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
  const CHIP_H = theme.spacing[7]; // 24px
  const CHIP_PAD_X = theme.spacing[3]; // 8px
  const CHIP_GAP = theme.spacing[3]; // 8px
  const fontFamily = theme.typography.fonts.family.text;
  const labelNameColor = theme.colors.surface.text.gray.normal;
  const labelValueColor = theme.colors.surface.text.gray.muted;
  const chipBg = theme.colors.surface.background.gray.subtle;
  const chipShadowColor = theme.colors.surface.border.gray.muted;
  const chipRadius = theme.border.radius.small;
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
      const labelValue =
        labelUnit != null ? `${payload.value?.toLocaleString()} ${labelUnit}` : null;
      const fullText = labelValue ? `${nodeData.name} ${labelValue}` : nodeData.name;
      const chipW = Math.max(80, fullText.length * 6 + CHIP_PAD_X * 2);
      const chipY = nodeMidY - CHIP_H / 2;
      // Show chips whenever labels are enabled — the SVG viewport clips any overflow
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
            height={Math.max(1, nodeHeight)}
            fill={fill}
            rx={0}
            style={{ cursor: 'pointer' }}
          />

          {/* Label chip */}
          {showChip && (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={chipX}
                y={chipY}
                width={chipW}
                height={CHIP_H}
                fill={chipBg}
                rx={chipRadius}
                style={{ filter: `drop-shadow(0px ${theme.spacing[1]}px ${theme.spacing[3]}px ${chipShadowColor})` }}
              />
              <text
                x={chipX + CHIP_PAD_X}
                y={nodeMidY}
                dominantBaseline="middle"
                fontSize={theme.typography.fonts.size[75]}
                style={{ userSelect: 'none', fontFamily }}
              >
                <tspan fontWeight={theme.typography.fonts.weight.semibold} fill={labelNameColor}>
                  {nodeData.name}
                </tspan>
                {labelValue && (
                  <tspan fill={labelValueColor} dx={theme.spacing[2]}>
                    {labelValue}
                  </tspan>
                )}
              </text>
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
      labelUnit,
      CHIP_H,
      CHIP_PAD_X,
      CHIP_GAP,
      fontFamily,
      labelNameColor,
      labelValueColor,
      chipBg,
      chipShadowColor,
      chipRadius,
      motionDuration,
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
                nodePadding={NODE_PADDING}
                node={renderNode}
                link={renderLink}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onMouseEnter={handleMouseEnter as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onMouseLeave={handleMouseLeave as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={handleClick as any}
                margin={{ top: theme.spacing[3], right: showLabels ? 160 : theme.spacing[3], bottom: theme.spacing[3], left: theme.spacing[3] }}
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
