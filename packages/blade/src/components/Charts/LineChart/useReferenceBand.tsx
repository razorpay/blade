import React, { useState, useMemo, useLayoutEffect, isValidElement } from 'react';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { getComponentId } from '~utils/isValidAllowedChildren';
import type {
  ChartReferenceBandProps,
  ReferenceBandLegendInfo,
  DataColorMapping,
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
import { buildBandAreaPath, perLineBandClass } from '../utils/referenceBandUtils';
import { componentIds } from './componentIds';
import type { ChartLineProps } from './types';

type ChartData = { [key: string]: unknown };

/**
 * A single band to be drawn — either the standalone `<ChartReferenceBand>` or one derived from a
 * `<ChartLine>` that declares `rangeLowerDataKey` / `rangeUpperDataKey`. `lowerClass` / `upperClass`
 * are the classNames of the invisible bound lines whose rendered geometry we read.
 */
type BandSource = {
  id: string;
  lowerClass: string;
  upperClass: string;
  name: string;
  colorToken: ReferenceBandLegendInfo['color'];
  fillColor: string;
  showLegend: boolean;
};

type BandGeometry = {
  id: string;
  d: string;
  fillColor: string;
};

type UseReferenceBandResult = {
  hasReferenceBand: boolean;
  renderReferenceBands: () => React.ReactElement | null;
  referenceBandLegendInfos: ReferenceBandLegendInfo[];
};

const geomsEqual = (a: BandGeometry[], b: BandGeometry[]): boolean =>
  a.length === b.length &&
  a.every((item, index) => {
    const other = b[index];
    return item.id === other.id && item.d === other.d && item.fillColor === other.fillColor;
  });

/**
 * Manages the web-only reference-band rendering pipeline for `ChartLineWrapper`. Collects every band
 * source — the standalone `<ChartReferenceBand>` plus each `<ChartLine>` that declares a range — and,
 * after Recharts lays out the invisible bound lines, reads their pixel anchors from the rendered SVG
 * and fills the area between each pair (via `buildBandAreaPath`), recomputing on DOM/resize changes.
 * Per-line bands are color-matched to their line via `dataColorMapping`. This mirrors the null-bridge
 * approach because Recharts v3 doesn't expose axis scales to `<Customized>`.
 */
const useReferenceBand = (
  children: React.ReactNode,
  data: ChartData[],
  containerRef: React.RefObject<HTMLDivElement | null>,
  dataColorMapping: DataColorMapping,
): UseReferenceBandResult => {
  const { theme } = useTheme();

  const bandSources = useMemo<BandSource[]>(() => {
    const sources: BandSource[] = [];

    React.Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const id = getComponentId(child);

      // Standalone <ChartReferenceBand> (single band not tied to a specific line).
      if (id === commonComponentIds.chartReferenceBand) {
        const props = child.props as ChartReferenceBandProps;
        const colorToken =
          props.color ?? (REFERENCE_BAND_DEFAULT_COLOR as ReferenceBandLegendInfo['color']);
        sources.push({
          id: 'standalone',
          lowerClass: REFERENCE_BAND_LOWER_CLASS,
          upperClass: REFERENCE_BAND_UPPER_CLASS,
          name: props.name ?? 'Reference band',
          colorToken,
          fillColor: getIn(theme.colors, colorToken),
          showLegend: props.showLegend ?? true,
        });
        return;
      }

      // Per-line band: a <ChartLine> that declares both range bounds.
      if (id === componentIds.ChartLine) {
        const props = child.props as ChartLineProps;
        const dataKey = props.dataKey as string;
        if (!dataKey || !props.rangeLowerDataKey || !props.rangeUpperDataKey) return;
        // Color-match to the line: explicit rangeColor wins, else the line's resolved color.
        const colorToken =
          props.rangeColor ??
          dataColorMapping[dataKey]?.colorToken ??
          (REFERENCE_BAND_DEFAULT_COLOR as ReferenceBandLegendInfo['color']);
        sources.push({
          id: dataKey,
          lowerClass: perLineBandClass(dataKey, 'lower'),
          upperClass: perLineBandClass(dataKey, 'upper'),
          name: props.rangeName ?? 'Industry range',
          colorToken,
          fillColor: getIn(theme.colors, colorToken),
          showLegend: props.showRangeLegend ?? props.showLegend ?? true,
        });
      }
    });

    return sources;
  }, [children, theme, dataColorMapping]);

  const hasReferenceBand = bandSources.length > 0;

  const [bandGeoms, setBandGeoms] = useState<BandGeometry[]>([]);

  // Stable key of the sources' identity so the effect re-runs when bands are added/removed/recolored.
  const sourceSignature = useMemo(
    () => bandSources.map((s) => `${s.id}:${s.fillColor}`).join('|'),
    [bandSources],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !hasReferenceBand) {
      setBandGeoms((prev) => (prev.length === 0 ? prev : []));
      return undefined;
    }

    const computeBands = (): void => {
      const surface = container.querySelector('svg.recharts-surface');
      if (!surface) return;
      const next: BandGeometry[] = [];
      bandSources.forEach((source) => {
        const upperCurve = surface.querySelector<SVGPathElement>(
          `.${source.upperClass} .recharts-line-curve`,
        );
        const lowerCurve = surface.querySelector<SVGPathElement>(
          `.${source.lowerClass} .recharts-line-curve`,
        );
        if (!upperCurve || !lowerCurve) return;
        const upperAnchors = parsePathAnchors(upperCurve.getAttribute('d') ?? '');
        const lowerAnchors = parsePathAnchors(lowerCurve.getAttribute('d') ?? '');
        const d = buildBandAreaPath(upperAnchors, lowerAnchors);
        if (!d) return;
        next.push({
          id: source.id,
          d,
          fillColor: source.fillColor,
        });
      });
      setBandGeoms((prev) => (geomsEqual(prev, next) ? prev : next));
    };

    computeBands();

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
          computeBands();
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
      const resizeObserver = new ResizeObserver(() => computeBands());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hasReferenceBand, sourceSignature]);

  const renderReferenceBands = (): React.ReactElement | null => {
    if (!hasReferenceBand || bandGeoms.length === 0) return null;
    return (
      <g className={REFERENCE_BAND_LAYER_CLASS}>
        {bandGeoms.map((band) => (
          <path
            key={`reference-band-${band.id}`}
            d={band.d}
            fill={band.fillColor}
            fillOpacity={REFERENCE_BAND_FILL_OPACITY}
            stroke="none"
          />
        ))}
      </g>
    );
  };

  const referenceBandLegendInfos = useMemo<ReferenceBandLegendInfo[]>(
    () =>
      bandSources
        .filter((source) => source.showLegend)
        .map((source) => ({
          name: source.name,
          color: source.colorToken,
          fillOpacity: REFERENCE_BAND_FILL_OPACITY,
        })),
    [bandSources],
  );

  return { hasReferenceBand, renderReferenceBands, referenceBandLegendInfos };
};

export { useReferenceBand };
export type { UseReferenceBandResult, BandSource, BandGeometry };
