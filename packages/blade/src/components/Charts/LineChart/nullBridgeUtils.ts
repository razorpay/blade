import type { ChartLineProps } from './types';

/**
 * Monotone cubic interpolation using d3's `curveMonotoneX` harmonic-mean tangent
 * formula — the same algorithm Recharts and `buildMonotonePath` use for `type="monotone"`.
 * Given the defined points `(xs[i], ys[i])` (xs ascending), it returns the interpolated
 * `y` at `xq`. Used to densely sample the null-bridge onto the real curve so the dashed
 * bridge follows the same shape as a solid connect instead of a straight line.
 */
const monotoneInterpolate = (xs: number[], ys: number[], xq: number): number => {
  const n = xs.length;
  if (n === 0) return 0;
  if (n === 1) return ys[0];

  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1] - xs[i];
    slope[i] = dx === 0 ? 0 : (ys[i + 1] - ys[i]) / dx;
  }

  // Tangents at each point — d3's curveMonotoneX harmonic-mean formula, matching
  // buildMonotonePath's algorithm so the dashed bridge follows the same curve as the solid line.
  const tangent: number[] = new Array(n);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    const m1 = slope[i - 1];
    const m2 = slope[i];
    if (m1 * m2 <= 0) {
      tangent[i] = 0;
    } else {
      const dx1 = xs[i] - xs[i - 1];
      const dx2 = xs[i + 1] - xs[i];
      const common = dx1 + dx2;
      tangent[i] = (3 * common) / ((common + dx2) / m1 + (common + dx1) / m2);
    }
  }

  // Locate the interval containing xq and evaluate the Hermite basis.
  let k = 0;
  while (k < n - 2 && xq > xs[k + 1]) k++;
  const h = xs[k + 1] - xs[k];
  const t = h === 0 ? 0 : (xq - xs[k]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * ys[k] + h10 * h * tangent[k] + h01 * ys[k + 1] + h11 * h * tangent[k + 1];
};

// Resolve a (possibly nested, e.g. `metrics.sales`) dataKey from a data row.
const resolveDataKeyValue = (
  row: Record<string, unknown>,
  dataKey: ChartLineProps['dataKey'],
): unknown => {
  const path = String(dataKey);
  if (!path) return undefined;
  return path.split('.').reduce<unknown>((accumulator, key) => {
    if (accumulator && typeof accumulator === 'object') {
      return (accumulator as Record<string, unknown>)[key];
    }
    return undefined;
  }, row);
};

type DefinedPoints = { indices: number[]; values: number[] };

// Extract the indices + numeric values of the non-null points for a dataKey.
const getDefinedNumericPoints = (
  data: Array<Record<string, unknown>>,
  dataKey: ChartLineProps['dataKey'],
): DefinedPoints => {
  const indices: number[] = [];
  const values: number[] = [];
  data.forEach((row, index) => {
    const raw = resolveDataKeyValue(row, dataKey);
    const numeric = raw === null || raw === undefined ? null : Number(raw);
    if (numeric !== null && !Number.isNaN(numeric)) {
      indices.push(index);
      values.push(numeric);
    }
  });
  return { indices, values };
};

// Positions (into the defined-points array) of adjacent defined points that have at least one null
// point between them, i.e. an interior gap that a null-bridge should span.
const getInteriorGaps = (indices: number[]): Array<{ from: number; to: number }> => {
  const gaps: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < indices.length - 1; i++) {
    if (indices[i + 1] - indices[i] > 1) {
      gaps.push({ from: i, to: i + 1 });
    }
  }
  return gaps;
};

/**
 * Build a dashed null-bridge `d` path (dense polyline) across a single interior gap, sampling the
 * monotone spline through the line's defined anchor points (in pixel space) so the bridge follows
 * the same curve Recharts draws for a solid connect instead of a straight chord.
 */
const buildBridgePathData = (anchors: PixelPoint[], from: number, to: number): string => {
  const xs = anchors.map((point) => point.x);
  const ys = anchors.map((point) => point.y);
  const start = anchors[from];
  const end = anchors[to];
  const sampleCount = Math.max(2, Math.round(Math.abs(end.x - start.x) / 3));
  let pathData = '';
  for (let step = 0; step <= sampleCount; step++) {
    const t = step / sampleCount;
    const x = start.x + (end.x - start.x) * t;
    const y = monotoneInterpolate(xs, ys, x);
    pathData += `${step === 0 ? 'M' : 'L'}${x},${y} `;
  }
  return pathData.trim();
};

type PixelPoint = { x: number; y: number };

/**
 * Parse the anchor (data) points out of an SVG path `d` string as rendered by Recharts for a line.
 * Handles `M`/`L` (linear) and `C` (monotone/natural cubic) commands — for a cubic the anchor is the
 * final control pair. Restart commands (`M`, from a gapped/`connectNulls={false}` line) contribute
 * their point too, so the result is the ordered list of the line's *defined* data points in pixel
 * space. Used to derive the null-bridge geometry from Recharts' own computed coordinates.
 */
const parsePathAnchors = (pathData: string): PixelPoint[] => {
  const anchors: PixelPoint[] = [];
  const commandPattern = /([MLC])([^MLC]*)/g;
  let match: RegExpExecArray | null = commandPattern.exec(pathData);
  while (match !== null) {
    const command = match[1];
    const numbers = (match[2].match(/-?[\d.]+(?:e-?\d+)?/g) ?? []).map(Number);
    if (command === 'M' || command === 'L') {
      if (numbers.length >= 2) anchors.push({ x: numbers[0], y: numbers[1] });
    } else if (command === 'C') {
      if (numbers.length >= 6) anchors.push({ x: numbers[4], y: numbers[5] });
    }
    match = commandPattern.exec(pathData);
  }
  return anchors;
};

export {
  monotoneInterpolate,
  resolveDataKeyValue,
  getDefinedNumericPoints,
  getInteriorGaps,
  parsePathAnchors,
  buildBridgePathData,
};
export type { DefinedPoints, PixelPoint };
