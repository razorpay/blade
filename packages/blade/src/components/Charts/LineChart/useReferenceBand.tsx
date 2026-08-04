import React, { useState, useMemo, useLayoutEffect, isValidElement } from 'react';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { getComponentId } from '~utils/isValidAllowedChildren';
import type {
  ChartReferenceBandProps,
  ReferenceBandLegendInfo,
} from '../CommonChartComponents/types';
import {
  componentId as commonComponentIds,
  REFERENCE_BAND_DEFAULT_COLOR,
  REFERENCE_BAND_FILL_OPACITY,
  REFERENCE_BAND_LOWER_CLASS,
  REFERENCE_BAND_UPPER_CLASS,
  REFERENCE_BAND_LAYER_CLASS,
} from '../CommonChartComponents/tokens';
import { parsePathAnchors } from '../utils/nullBridgeUtils';
import type { PixelPoint } from '../utils/nullBridgeUtils';
import { buildBandAreaPath } from '../utils/referenceBandUtils';

type ChartData = { [key: string]: unknown };

type ResolvedReferenceBand = {
  lowerDataKey: string;
  upperDataKey: string;
  name: string;
  colorToken: ReferenceBandLegendInfo['color'];
  showLegend: boolean;
  fillColor: string;
  upperLabel?: string;
  lowerLabel?: string;
  showRangeLabels: boolean;
};

type BandGeometry = {
  d: string;
  upperStart: PixelPoint | null;
  lowerStart: PixelPoint | null;
};

type UseReferenceBandResult = {
  hasReferenceBand: boolean;
  renderMinMaxBand: () => React.ReactElement | null;
  referenceBandLegendInfo: ReferenceBandLegendInfo | undefined;
};

/**
 * Detects an optional `<ChartReferenceBand>` child inside `ChartLineWrapper` and manages the
 * web-only band rendering pipeline: after Recharts lays out the two invisible bound lines, the
 * hook reads their pixel anchor points from the rendered SVG, builds a filled area path between
 * them (via `buildBandAreaPath`), and re-computes on DOM/resize changes — mirroring the
 * null-bridge approach because Recharts v3 doesn't expose axis scales to `<Customized>`.
 *
 * Returns a `renderMinMaxBand` callback for `<RechartsCustomized>`, a `hasReferenceBand` flag,
 * and legend info so the legend can show a swatch for the band.
 */
const useReferenceBand = (
  children: React.ReactNode,
  data: ChartData[],
  containerRef: React.RefObject<HTMLDivElement | null>,
): UseReferenceBandResult => {
  const { theme } = useTheme();

  // Detect an optional <ChartReferenceBand> child and resolve its band config once. The band renders a
  // shaded region between two data-driven bounds (see the reference band layer below).
  const referenceBand = useMemo<ResolvedReferenceBand | undefined>(() => {
    let found: ChartReferenceBandProps | undefined;
    React.Children.forEach(children, (child) => {
      if (
        isValidElement(child) &&
        getComponentId(child) === commonComponentIds.chartReferenceBand
      ) {
        found = child.props as ChartReferenceBandProps;
      }
    });
    if (!found) return undefined;
    const colorToken =
      found.color ?? (REFERENCE_BAND_DEFAULT_COLOR as ReferenceBandLegendInfo['color']);
    return {
      lowerDataKey: found.lowerDataKey,
      upperDataKey: found.upperDataKey,
      name: found.name ?? 'Reference band',
      colorToken,
      showLegend: found.showLegend ?? true,
      fillColor: getIn(theme.colors, colorToken),
      upperLabel: found.upperLabel,
      lowerLabel: found.lowerLabel,
      showRangeLabels: found.showRangeLabels ?? true,
    };
  }, [children, theme]);

  const hasReferenceBand = Boolean(referenceBand);

  /**
   * The reference band is painted from Recharts' own computed geometry: <ChartReferenceBand>
   * renders two invisible bound lines, and after layout we read those two curves' pixel anchors
   * and fill the region between them. This mirrors the null-bridge approach (Recharts v3 doesn't
   * expose axis scales to <Customized>), and produces a data-driven band that follows the curve —
   * something Recharts' fixed-rectangle ReferenceArea can't do.
   */
  const [bandGeom, setBandGeom] = useState<BandGeometry>({
    d: '',
    upperStart: null,
    lowerStart: null,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !hasReferenceBand) {
      setBandGeom((prev) => (prev.d === '' ? prev : { d: '', upperStart: null, lowerStart: null }));
      return undefined;
    }

    const computeBand = (): void => {
      const surface = container.querySelector('svg.recharts-surface');
      if (!surface) return;
      const upperCurve = surface.querySelector<SVGPathElement>(
        `.${REFERENCE_BAND_UPPER_CLASS} .recharts-line-curve`,
      );
      const lowerCurve = surface.querySelector<SVGPathElement>(
        `.${REFERENCE_BAND_LOWER_CLASS} .recharts-line-curve`,
      );
      if (!upperCurve || !lowerCurve) return;
      const upperAnchors = parsePathAnchors(upperCurve.getAttribute('d') ?? '');
      const lowerAnchors = parsePathAnchors(lowerCurve.getAttribute('d') ?? '');
      const nextPath = buildBandAreaPath(upperAnchors, lowerAnchors);
      const upperStart = upperAnchors[0] ?? null;
      const lowerStart = lowerAnchors[0] ?? null;
      setBandGeom((prev) =>
        prev.d === nextPath &&
        prev.upperStart?.x === upperStart?.x &&
        prev.upperStart?.y === upperStart?.y &&
        prev.lowerStart?.x === lowerStart?.x &&
        prev.lowerStart?.y === lowerStart?.y
          ? prev
          : { d: nextPath, upperStart, lowerStart },
      );
    };

    computeBand();

    const cleanups: Array<() => void> = [];
    if (typeof MutationObserver !== 'undefined') {
      let rafId: number | null = null;
      const mutationObserver = new MutationObserver((mutations) => {
        // Ignore mutations from our own band layer to avoid a re-entrant loop.
        const isBandMutation = mutations.some(
          (m) => m.target instanceof Element && m.target.closest(`.${REFERENCE_BAND_LAYER_CLASS}`),
        );
        if (isBandMutation) return;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = null;
          computeBand();
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
      const resizeObserver = new ResizeObserver(() => computeBand());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [data, hasReferenceBand, referenceBand?.lowerDataKey, referenceBand?.upperDataKey]);

  const renderMinMaxBand = (): React.ReactElement | null => {
    if (!hasReferenceBand || !bandGeom.d) return null;
    const showLabels = referenceBand?.showRangeLabels;
    const labelColor = getIn(theme.colors, 'surface.text.gray.subtle');
    const labelProps = {
      fill: labelColor,
      fontSize: theme.typography.fonts.size[75],
      fontFamily: theme.typography.fonts.family.text,
      fontWeight: theme.typography.fonts.weight.medium,
      textAnchor: 'start' as const,
    };
    return (
      <g className={REFERENCE_BAND_LAYER_CLASS}>
        <path
          d={bandGeom.d}
          fill={referenceBand?.fillColor}
          fillOpacity={REFERENCE_BAND_FILL_OPACITY}
          stroke="none"
        />
        {showLabels && referenceBand?.upperLabel && bandGeom.upperStart ? (
          <text x={bandGeom.upperStart.x + 4} y={bandGeom.upperStart.y - 6} {...labelProps}>
            {referenceBand.upperLabel}
          </text>
        ) : null}
        {showLabels && referenceBand?.lowerLabel && bandGeom.lowerStart ? (
          <text x={bandGeom.lowerStart.x + 4} y={bandGeom.lowerStart.y + 14} {...labelProps}>
            {referenceBand.lowerLabel}
          </text>
        ) : null}
      </g>
    );
  };

  const referenceBandLegendInfo = useMemo<ReferenceBandLegendInfo | undefined>(() => {
    if (!referenceBand?.showLegend) return undefined;
    return {
      name: referenceBand.name,
      color: referenceBand.colorToken,
      fillOpacity: REFERENCE_BAND_FILL_OPACITY,
    };
  }, [referenceBand]);

  return { hasReferenceBand, renderMinMaxBand, referenceBandLegendInfo };
};

export { useReferenceBand };
export type { UseReferenceBandResult, ResolvedReferenceBand, BandGeometry };
