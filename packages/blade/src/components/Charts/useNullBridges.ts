import { useState, useRef, useLayoutEffect } from 'react';
import {
  getDefinedNumericPoints,
  getInteriorGaps,
  parsePathAnchors,
  buildBridgePathData,
} from './nullBridgeUtils';

type BridgePath = { id: string; dataKey: string; d: string; stroke: string };

type ChartSeriesOrder = Array<{ dataKey: string; bridge: 'none' | 'dashed' }>;

type UseNullBridgesOptions = {
  data: Array<Record<string, unknown>>;
  chartSeriesOrder: ChartSeriesOrder;
  hasBridge: boolean;
  selectedDataKeys: string[] | undefined;
  curveSelector: string;
};

/**
 * Shared hook that encapsulates the MutationObserver/ResizeObserver + RAF debounce
 * pattern for computing dashed null-bridge paths from Recharts' rendered SVG geometry.
 * Used by both AreaChart.web.tsx and LineChart.web.tsx to avoid code duplication.
 *
 * Returns a container ref to attach to the chart wrapper div and the computed bridge paths.
 */
const useNullBridges = ({
  data,
  chartSeriesOrder,
  hasBridge,
  selectedDataKeys,
  curveSelector,
}: UseNullBridgesOptions): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bridgePaths: BridgePath[];
} => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bridgePaths, setBridgePaths] = useState<BridgePath[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !hasBridge) {
      setBridgePaths((prev) => (prev.length === 0 ? prev : []));
      return undefined;
    }

    const computeBridges = (): void => {
      const surface = container.querySelector('svg.recharts-surface');
      if (!surface) return;
      const visibleSeries = chartSeriesOrder.filter((series) =>
        selectedDataKeys ? selectedDataKeys.includes(series.dataKey) : true,
      );
      const topLineCurves = Array.from(
        surface.querySelectorAll<SVGPathElement>(curveSelector),
      ).filter((curve) => {
        const stroke = (curve.getAttribute('stroke') ?? '').toLowerCase();
        return stroke !== '' && stroke !== 'transparent' && stroke !== 'none';
      });
      if (topLineCurves.length !== visibleSeries.length) return;

      const nextPaths: BridgePath[] = [];
      visibleSeries.forEach((series, position) => {
        if (series.bridge === 'none') return;
        const curve = topLineCurves[position];
        const stroke = curve.getAttribute('stroke') ?? '';
        const anchors = parsePathAnchors(curve.getAttribute('d') ?? '');
        const { indices } = getDefinedNumericPoints(data, series.dataKey);
        if (anchors.length !== indices.length) return;

        getInteriorGaps(indices).forEach(({ from, to }) => {
          nextPaths.push({
            id: `null-bridge-${series.dataKey}-${indices[from]}`,
            dataKey: series.dataKey,
            d: buildBridgePathData(anchors, from, to),
            stroke,
          });
        });
      });

      setBridgePaths((previous) => {
        const isSame =
          previous.length === nextPaths.length &&
          previous.every(
            (item, index) =>
              item.id === nextPaths[index].id &&
              item.d === nextPaths[index].d &&
              item.stroke === nextPaths[index].stroke,
          );
        return isSame ? previous : nextPaths;
      });
    };

    computeBridges();

    // The line geometry isn't available synchronously (ResponsiveContainer renders the chart in a
    // later commit) and keeps changing while the chart's draw-in animation runs, so we recompute
    // whenever the chart's DOM or the line paths (`d`) mutate, and on resize.
    const cleanups: Array<() => void> = [];
    if (typeof MutationObserver !== 'undefined') {
      let rafId: number | null = null;
      const mutationObserver = new MutationObserver((mutations) => {
        // Skip mutations that originate from our own bridge layer (the dashed paths we render),
        // which would otherwise cause re-entrant computeBridges calls on every bridge update.
        const isBridgeMutation = mutations.some(
          (m) => m.target instanceof Element && m.target.closest('.blade-null-bridge-layer'),
        );
        if (isBridgeMutation) return;
        // Debounce: coalesce multiple mutations in a single animation frame so that hover-related
        // DOM changes (tooltips, active dots, crosshair) don't each trigger a separate computation.
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          computeBridges();
        });
      });
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['d'],
      });
      cleanups.push(() => {
        mutationObserver.disconnect();
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    }
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => computeBridges());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [data, chartSeriesOrder, hasBridge, selectedDataKeys, curveSelector]);

  return { containerRef, bridgePaths };
};

export { useNullBridges };
export type { BridgePath, ChartSeriesOrder };
