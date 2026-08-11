import { monotoneInterpolate } from './nullBridgeUtils';
import type { PixelPoint } from './nullBridgeUtils';

/**
 * Build a closed SVG `d` path for a reference band, given the upper and lower bound points in
 * pixel space (both ordered left→right, x ascending). The top edge is sampled left→right and the
 * bottom edge right→left along the monotone spline through each bound's anchors, so the band's
 * edges follow the same curve the trend line does instead of straight chords, then closed with `Z`.
 *
 * Shared by web (anchors parsed from Recharts' rendered bound curves via `parsePathAnchors`) and
 * native (points computed directly from the chart scales), so the band geometry matches on both.
 */
const buildBandAreaPath = (upper: PixelPoint[], lower: PixelPoint[]): string => {
  if (upper.length < 2 || lower.length < 2) return '';

  const upperXs = upper.map((point) => point.x);
  const upperYs = upper.map((point) => point.y);
  const lowerXs = lower.map((point) => point.x);
  const lowerYs = lower.map((point) => point.y);

  const startX = upper[0].x;
  const endX = upper[upper.length - 1].x;
  const sampleCount = Math.max(2, Math.round(Math.abs(endX - startX) / 3));

  let pathData = '';
  // Top edge: left → right along the upper bound.
  for (let step = 0; step <= sampleCount; step++) {
    const t = step / sampleCount;
    const x = startX + (endX - startX) * t;
    const y = monotoneInterpolate(upperXs, upperYs, x);
    pathData += `${step === 0 ? 'M' : 'L'}${x},${y} `;
  }
  // Bottom edge: right → left along the lower bound, then close.
  for (let step = sampleCount; step >= 0; step--) {
    const t = step / sampleCount;
    const x = startX + (endX - startX) * t;
    const y = monotoneInterpolate(lowerXs, lowerYs, x);
    pathData += `L${x},${y} `;
  }
  pathData += 'Z';
  return pathData.trim();
};

/**
 * Sanitize a dataKey into a CSS-class-safe token (nested keys like `metrics.sales` contain dots,
 * which are invalid in a single className). Shared by the ChartLine bound-line renderer and the
 * reference-band hook so both derive the same className for a given line.
 */
const sanitizeBandKey = (dataKey: string): string => dataKey.replace(/[^a-zA-Z0-9_-]/g, '-');

/**
 * className applied to a per-line band's invisible lower/upper bound line, so the reference-band
 * hook can locate the rendered curve in the SVG. Kept in sync between the renderer and the reader.
 */
const perLineBandClass = (dataKey: string, edge: 'lower' | 'upper'): string =>
  `blade-reference-band-${sanitizeBandKey(dataKey)}-${edge}`;

export { buildBandAreaPath, sanitizeBandKey, perLineBandClass };
