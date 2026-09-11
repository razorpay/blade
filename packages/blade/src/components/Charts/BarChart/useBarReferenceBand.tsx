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
import type { PixelPoint } from '../utils/nullBridgeUtils';
import { perLineBandClass } from '../utils/referenceBandUtils';
import { componentIds, BAND_HIGHLIGHT_OPACITY, barSeriesClass } from './tokens';
import type { ChartBarProps } from './types';

type ChartData = { [key: string]: unknown };

/**
 * One band to draw. `lowerClass` / `upperClass` are the classNames of the invisible bound series
 * whose rendered geometry supplies the y pixels. `hoverOnly` bands are revealed only while their
 * bar is hovered — several grouped bars can each declare a range without the bands piling up.
 */
type BandSource = {
  id: string;
  lowerClass: string;
  upperClass: string;
  name: string;
  colorToken: ReferenceBandLegendInfo['color'];
  fillColor: string;
  showLegend: boolean;
  hoverOnly: boolean;
};

type BandGeometry = {
  id: string;
  d: string;
  fillColor: string;
};

type UseBarReferenceBandResult = {
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
 * Centre x of every bar rendered for one bar series, left→right.
 *
 * The series is found by its `barSeriesClass` rather than by position, so toggling another series
 * off in the legend (which renders no group at all) can't shift the lookup onto the wrong bars.
 *
 * `ChartBar`'s custom shape draws two `<rect>`s per bar (the body fill plus a thin accent edge at
 * the same x), so the raw list has duplicates — they're de-duplicated here, leaving one centre per
 * category.
 */
const getBarCentres = (surface: Element, dataKey: string): number[] | null => {
  const series = surface.querySelector(`.${barSeriesClass(dataKey)}`);
  if (!series) return null;
  const centres = Array.from(
    series.querySelectorAll<SVGRectElement>('.recharts-bar-rectangle rect'),
  )
    .map((rect) => {
      const x = Number(rect.getAttribute('x'));
      const width = Number(rect.getAttribute('width'));
      return Number.isFinite(x) && Number.isFinite(width) ? x + width / 2 : NaN;
    })
    .filter((centre) => Number.isFinite(centre));
  const unique = [...new Set(centres)];
  return unique.length > 0 ? unique : null;
};

/**
 * Closed polygon for a band: the upper bounds left→right, then the lower bounds right→left.
 *
 * Both edges are flat-extended to the plot's left and right edges so the band reads as a continuous
 * backdrop behind the bars rather than stopping at the first and last bar centre. Straight chords
 * throughout — a bar chart has no trend curve for the band edges to follow.
 */
const buildBarBandPath = (
  upper: PixelPoint[],
  lower: PixelPoint[],
  plotLeft: number,
  plotRight: number,
): string => {
  if (upper.length === 0 || lower.length === 0) return '';

  const extend = (points: PixelPoint[]): PixelPoint[] => [
    { x: plotLeft, y: points[0].y },
    ...points,
    { x: plotRight, y: points[points.length - 1].y },
  ];

  const topEdge = extend(upper);
  const bottomEdge = extend(lower).reverse();

  const toCommands = (points: PixelPoint[], startCommand: 'M' | 'L'): string =>
    points
      .map((point, index) => `${index === 0 ? startCommand : 'L'}${point.x},${point.y}`)
      .join(' ');

  return `${toCommands(topEdge, 'M')} ${toCommands(bottomEdge, 'L')} Z`;
};

/** Horizontal extent of the plot area, read from the axis line Recharts renders. */
const getPlotBounds = (surface: Element): { left: number; right: number } | null => {
  const axisLine = surface.querySelector('.recharts-xAxis .recharts-cartesian-axis-line');
  const left = Number(axisLine?.getAttribute('x1'));
  const right = Number(axisLine?.getAttribute('x2'));
  return Number.isFinite(left) && Number.isFinite(right) ? { left, right } : null;
};

/**
 * Vertical extent of one category column, plus its left edge — used for the shaded column drawn
 * behind the hovered category. Derived from the bars themselves so it lines up with the group.
 */
const getCategoryColumn = (
  surface: Element,
  centres: number[],
  activeIndex: number,
): { x: number; width: number; y: number; height: number } | null => {
  if (activeIndex < 0 || centres.length === 0) return null;
  const bounds = getPlotBounds(surface);
  const gridLines = Array.from(
    surface.querySelectorAll<SVGLineElement>('.recharts-cartesian-grid-horizontal line'),
  ).map((line) => Number(line.getAttribute('y1')));
  const axisLine = surface.querySelector('.recharts-xAxis .recharts-cartesian-axis-line');
  const baseline = Number(axisLine?.getAttribute('y1'));
  if (!bounds || !Number.isFinite(baseline)) return null;

  const top = gridLines.length > 0 ? Math.min(...gridLines) : 0;
  const width = (bounds.right - bounds.left) / centres.length;
  return {
    x: bounds.left + activeIndex * width,
    width,
    y: top,
    height: baseline - top,
  };
};

/**
 * Reference-band rendering for `ChartBarWrapper` (web).
 *
 * Collects every band declared in the chart — the standalone `<ChartReferenceBand>` plus each
 * `<ChartBar>` that declares a min–max range — and, once Recharts has laid out the invisible bound
 * series, reads their pixel geometry and fills the region between each pair.
 *
 * The bounds' **y** comes from those bound series, so the range folds into the chart's y-domain and
 * a band wider than the bars is never clipped. The bounds' **x** is replaced with the owning
 * series' bar centres: a bound series sits at the *category* centre, which is right for a single
 * centred bar but would stack every band on the same x in a grouped chart.
 */
const useBarReferenceBand = (
  children: React.ReactNode,
  data: ChartData[],
  containerRef: React.RefObject<HTMLDivElement | null>,
  dataColorMapping: DataColorMapping,
  hoveredDataKey: string | null,
  hoveredBarIndex: number | null,
  selectedDataKeys: string[] | undefined,
): UseBarReferenceBandResult => {
  const { theme } = useTheme();

  const bandSources = useMemo<BandSource[]>(() => {
    const sources: BandSource[] = [];

    React.Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const id = getComponentId(child);

      // Standalone <ChartReferenceBand> — one band for the whole chart, always visible.
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
          hoverOnly: false,
        });
        return;
      }

      // Per-bar band: a <ChartBar> declaring both range bounds. Colour-matched to the bar.
      if (id === componentIds.chartBar) {
        const props = child.props as ChartBarProps;
        const dataKey = props.dataKey as string;
        if (!dataKey || !props.rangeLowerDataKey || !props.rangeUpperDataKey) return;
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
          // Per-bar bands are only on screen while their bar is hovered, so a permanent legend
          // swatch would advertise something that usually isn't visible. Opt in with
          // `showRangeLegend` if the chart needs it spelled out.
          showLegend: props.showRangeLegend ?? false,
          hoverOnly: true,
        });
      }
    });

    return sources;
  }, [children, theme, dataColorMapping]);

  const hasReferenceBand = bandSources.length > 0;

  const [bandGeoms, setBandGeoms] = useState<BandGeometry[]>([]);
  const [highlight, setHighlight] = useState<{
    x: number;
    width: number;
    y: number;
    height: number;
  } | null>(null);

  // Stable key of the sources' identity so the effect re-runs when bands are added/removed/recolored.
  const sourceSignature = useMemo(
    () => bandSources.map((source) => `${source.id}:${source.fillColor}`).join('|'),
    [bandSources],
  );

  // Stable key of which series are visible. Toggling one off in the legend re-lays out the whole
  // bar group — every remaining bar shifts — so the anchored bands have to be rebuilt.
  const visibilitySignature = selectedDataKeys?.join('|');

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !hasReferenceBand) {
      setBandGeoms((prev) => (prev.length === 0 ? prev : []));
      setHighlight(null);
      return undefined;
    }

    const computeBands = (): void => {
      const surface = container.querySelector('svg.recharts-surface');
      if (!surface) return;
      const bounds = getPlotBounds(surface);
      if (!bounds) return;

      const next: BandGeometry[] = [];
      let highlightCentres: number[] | null = null;

      bandSources.forEach((source) => {
        // Hover-reveal: a per-bar band is drawn only while its own bar is hovered.
        if (source.hoverOnly && source.id !== hoveredDataKey) return;

        const upperCurve = surface.querySelector<SVGPathElement>(
          `.${source.upperClass} .recharts-line-curve`,
        );
        const lowerCurve = surface.querySelector<SVGPathElement>(
          `.${source.lowerClass} .recharts-line-curve`,
        );
        if (!upperCurve || !lowerCurve) return;

        const upperAnchors = parsePathAnchors(upperCurve.getAttribute('d') ?? '');
        const lowerAnchors = parsePathAnchors(lowerCurve.getAttribute('d') ?? '');
        if (upperAnchors.length === 0 || lowerAnchors.length === 0) return;

        // Re-anchor to this series' bar centres where they line up 1:1 with the bounds; otherwise
        // keep the bound series' own x (the single centred bar case).
        const centres = source.hoverOnly ? getBarCentres(surface, source.id) : null;
        const reanchor = (anchors: PixelPoint[]): PixelPoint[] =>
          centres && centres.length === anchors.length
            ? anchors.map((anchor, index) => ({ x: centres[index], y: anchor.y }))
            : anchors;

        const d = buildBarBandPath(
          reanchor(upperAnchors),
          reanchor(lowerAnchors),
          bounds.left,
          bounds.right,
        );
        if (!d) return;

        if (source.hoverOnly && centres) highlightCentres = centres;
        next.push({ id: source.id, d, fillColor: source.fillColor });
      });

      setBandGeoms((prev) => (geomsEqual(prev, next) ? prev : next));

      // Shaded column behind the hovered category — only meaningful alongside a hovered band.
      const nextHighlight =
        highlightCentres !== null && hoveredBarIndex !== null
          ? getCategoryColumn(surface, highlightCentres, hoveredBarIndex)
          : null;
      setHighlight((prev) => {
        const isSame =
          (prev === null && nextHighlight === null) ||
          (prev !== null &&
            nextHighlight !== null &&
            prev.x === nextHighlight.x &&
            prev.width === nextHighlight.width &&
            prev.y === nextHighlight.y &&
            prev.height === nextHighlight.height);
        return isSame ? prev : nextHighlight;
      });
    };

    computeBands();

    const cleanups: Array<() => void> = [];
    if (typeof MutationObserver !== 'undefined') {
      // Debounced with a timer rather than requestAnimationFrame: Recharts finishes laying the bars
      // out a commit or two after a legend toggle, so this callback is what settles the band on its
      // final anchors — and rAF never fires while the document is hidden, which would leave a
      // background chart showing a stale band.
      let timerId: ReturnType<typeof setTimeout> | null = null;
      const mutationObserver = new MutationObserver((mutations) => {
        // Ignore mutations from our own band layer to avoid a re-entrant loop.
        const isBandMutation = mutations.some(
          (mutation) =>
            mutation.target instanceof Element &&
            mutation.target.closest(`.${REFERENCE_BAND_LAYER_CLASS}`),
        );
        if (isBandMutation) return;
        if (timerId !== null) clearTimeout(timerId);
        timerId = setTimeout(() => {
          timerId = null;
          computeBands();
        }, 0);
      });
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['d', 'x', 'width'],
      });
      cleanups.push(() => {
        mutationObserver.disconnect();
        if (timerId !== null) clearTimeout(timerId);
      });
    }
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => computeBands());
      resizeObserver.observe(container);
      cleanups.push(() => resizeObserver.disconnect());
    }
    return () => cleanups.forEach((cleanup) => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    hasReferenceBand,
    sourceSignature,
    hoveredDataKey,
    hoveredBarIndex,
    visibilitySignature,
  ]);

  const renderReferenceBands = (): React.ReactElement | null => {
    if (!hasReferenceBand || bandGeoms.length === 0) return null;
    return (
      <g className={REFERENCE_BAND_LAYER_CLASS}>
        {highlight ? (
          <rect
            x={highlight.x}
            y={highlight.y}
            width={highlight.width}
            height={highlight.height}
            fill={theme.colors.surface.background.gray.moderate}
            opacity={BAND_HIGHLIGHT_OPACITY}
          />
        ) : null}
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

export { useBarReferenceBand, buildBarBandPath, getBarCentres };
export type { UseBarReferenceBandResult, BandSource, BandGeometry };
