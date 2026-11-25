/**
 * Pure helpers for the GenUI CHART renderer (`RenderChartComponent` in GenUIComponents.web.tsx).
 *
 * They fit a GenUI chart to the box it renders in. A chart in a 256 to 520px box (a chat side
 * panel, a phone, a card in a narrow column) used to be taller than it was wide, drew every
 * X label on top of each other and repeated Y ticks. At 560px and wider the chart keeps the
 * height it had before: 350px.
 *
 * No layout here, so every rule is unit-tested without a browser.
 */
import dayjs from 'dayjs';
import { formatNumber } from '@razorpay/i18nify-js';
import type { ChartYLabelPlacement } from '~components/Charts';
import {
  formatChartValueCompact,
  formatChartValueFull,
  formatPercentFull,
} from '~components/Charts/utils/chartValueFormat';

/** The full chart height before this change, and the height until the box is measured. */
const MAX_CHART_HEIGHT = 350;
const MIN_CHART_HEIGHT = 200;
/** Width ÷ height of a full chart between the min and the max height. */
const CHART_ASPECT_RATIO = 1.6;
const TINY_CHART_HEIGHT = 100;

/** About 1.4 X labels per 100px of chart width, never fewer than 2. */
const LABELS_PER_100PX = 1.4;
const MIN_X_LABELS = 2;

/** A donut ring is never in a box under this height, so a 2-row legend does not cut it. */
const DONUT_MIN_HEIGHT = 260;
/** Under this box width the donut takes the small radius. */
const DONUT_SMALL_RADIUS_WIDTH = 440;

/** At this box width and under, a chart with no `showBorder` has no border. */
const NO_BORDER_MAX_WIDTH = 640;

/** A pie with more slices than this is a bar list. */
const BAR_LIST_MIN_SLICES = 5;
/** In a box under this width, a pie is a bar list. */
const BAR_LIST_MAX_WIDTH = 300;

/** X tick text is 12px (font size 75). A wide average glyph, so the estimate errs long. */
const TICK_CHAR_PX = 7;
/** A Y axis with `width="auto"` and compact ticks takes about this much. */
const Y_AXIS_ESTIMATE_PX = 48;
/** Room kept between the last X label and the right edge of the plot. */
const LAST_LABEL_SLACK_PX = 2;

type ChartStep = 'day' | 'week' | 'month';
type ChartRow = Record<string, string | number>;

/** Calendar steps a date axis labels on, in points of its own step. */
const CALENDAR_STEPS: Record<ChartStep, number[]> = {
  day: [1, 2, 3, 4, 7, 14, 30],
  week: [1, 2, 4, 8],
  month: [1, 2, 3, 6, 12],
};

const ISO_DAY = /^\d{4}-\d{2}-\d{2}/;
const DAY_MS = 24 * 60 * 60 * 1000;
const NBSP = '\u00a0';

/**
 * height = clamp(200, width ÷ 1.6, 350). 350px, as before, until the box is measured (0).
 */
const getChartHeight = (width: number): number => {
  if (width <= 0) return MAX_CHART_HEIGHT;
  return Math.round(
    Math.min(MAX_CHART_HEIGHT, Math.max(MIN_CHART_HEIGHT, width / CHART_ASPECT_RATIO)),
  );
};

/** A donut box is never under 260px, so the ring keeps room for its legend. */
const getDonutHeight = (width: number): number => Math.max(DONUT_MIN_HEIGHT, getChartHeight(width));

/** The donut radius: small under 440px. Unmeasured (0) keeps medium, as before. */
const getDonutRadius = (width: number): 'small' | 'medium' =>
  width > 0 && width < DONUT_SMALL_RADIUS_WIDTH ? 'small' : 'medium';

const getMaxXLabels = (width: number): number =>
  Math.max(MIN_X_LABELS, Math.floor((width * LABELS_PER_100PX) / 100));

/** True when every x value is an ISO day, "2026-10-01". */
const isDateAxis = (xs: string[]): boolean => xs.length > 0 && xs.every((x) => ISO_DAY.test(x));

/** The step of a date axis, from the gap between its first two points. */
const getDateStep = (xs: string[]): ChartStep => {
  if (xs.length < 2) return 'day';
  const gap = Math.abs(Date.parse(xs[1].slice(0, 10)) - Date.parse(xs[0].slice(0, 10))) / DAY_MS;
  if (gap >= 28) return 'month';
  if (gap >= 7) return 'week';
  return 'day';
};

/**
 * Label every k-th point, from the first. k is the smallest calendar step whose labels fit the
 * width. `ChartXAxis` then draws points 0, k, 2k ... through a number `interval` (k - 1), so the
 * labels are thinned once and each tick gets the width of the visible labels, not of all points.
 * At least 2 labels when there are 2 points or more. An unmeasured box (0) labels every point.
 */
const getXLabelStep = (count: number, width: number, step: ChartStep = 'day'): number => {
  if (count <= 1 || width <= 0) return 1;
  const max = getMaxXLabels(width);
  const candidate = CALENDAR_STEPS[step].find((k) => Math.ceil(count / k) <= max);
  if (candidate === undefined || Math.ceil(count / candidate) < MIN_X_LABELS) {
    // No calendar step fits: label the first and the last point.
    return count - 1;
  }
  return candidate;
};

/**
 * "1 Oct" for days and weeks, "Oct 26" for months. The space is non-breaking, so the tick never
 * wraps "1 Oct" in two.
 */
const formatDateTick = (value: string, step: ChartStep = 'day'): string => {
  const date = dayjs(String(value).slice(0, 10));
  if (!ISO_DAY.test(String(value)) || !date.isValid()) return String(value);
  return step === 'month' ? date.format(`MMM${NBSP}YY`) : date.format(`D${NBSP}MMM`);
};

/**
 * The room the last X label needs past the right edge of the plot, in px. 0 when it fits.
 * `ChartXAxis` end-aligns the label of the last point on a line or area chart, so that one always
 * fits. Any other last label is centred on its point or its bar, and can stick out.
 */
const getLastLabelOverhang = ({
  count,
  labelStep,
  lastLabel,
  width,
  chartType,
  yAxisWidth = Y_AXIS_ESTIMATE_PX,
}: {
  count: number;
  labelStep: number;
  lastLabel: string;
  width: number;
  chartType: 'bar' | 'line' | 'area';
  /** The width the Y axis takes from the plot. 0 for `overlap` Y labels with no border. */
  yAxisWidth?: number;
}): number => {
  if (count <= 1 || width <= 0) return 0;
  const lastIndex = Math.floor((count - 1) / labelStep) * labelStep;
  const plotWidth = Math.max(1, width - yAxisWidth);
  const halfLabel = (lastLabel.length * TICK_CHAR_PX) / 2;
  let room: number;
  if (chartType === 'bar') {
    room = (count - 1 - lastIndex + 0.5) * (plotWidth / count);
  } else {
    if (lastIndex === count - 1) return 0;
    room = (count - 1 - lastIndex) * (plotWidth / (count - 1));
  }
  const overhang = halfLabel - room;
  return overhang > 0 ? Math.ceil(overhang + LAST_LABEL_SLACK_PX) : 0;
};

/** Whole-number Y ticks for a `number` chart whose values are all whole: 0, 1, 2, 3, not 0.75. */
const isWholeNumberChart = (rows: ChartRow[], keys: string[], type?: string): boolean =>
  type === 'number' &&
  rows.every((row) =>
    keys.every((key) => typeof row[key] !== 'number' || Number.isInteger(row[key])),
  );

/**
 * INR compact in en-IN with at most 1 decimal and no ".0": ₹0, ₹50K, ₹1L, ₹1.5L, ₹2.8L, ₹1.2Cr.
 */
const formatINRCompact = (value: number): string =>
  formatChartValueCompact(value, { type: 'currency', currency: 'INR' });

/**
 * The border when the node sets none: no border in a box of 640px or less, where a Y axis takes
 * too much of the width. A border above, and until the box is measured (0), as before.
 */
const getDefaultShowBorder = (width: number): boolean =>
  !(width > 0 && width <= NO_BORDER_MAX_WIDTH);

/** The node's `showBorder` when it is a boolean, else the default for the width. */
const resolveShowBorder = (showBorder: unknown, width: number): boolean =>
  typeof showBorder === 'boolean' ? showBorder : getDefaultShowBorder(width);

/**
 * The node's `yLabelPlacement` when it is a known value, else `left`. A model can still send the
 * old `outside`: it is `right`.
 */
const resolveYLabelPlacement = (yLabelPlacement: unknown): ChartYLabelPlacement => {
  if (yLabelPlacement === 'left' || yLabelPlacement === 'right' || yLabelPlacement === 'overlap') {
    return yLabelPlacement;
  }
  return yLabelPlacement === 'outside' ? 'right' : 'left';
};

/** A pie is a bar list above 4 slices, or in a box under 300px. Unmeasured (0) counts as wide. */
const shouldShowBarList = (slices: number, width: number): boolean =>
  slices >= BAR_LIST_MIN_SLICES || (width > 0 && width < BAR_LIST_MAX_WIDTH);

type ChartValueFormatter = {
  type?: 'currency' | 'percentage' | 'number' | 'string';
  currency?: string;
  suffix?: string;
};

/** A share with 1 decimal and a % sign: 57.5%, 100.0%. */
const formatShare = formatPercentFull;

/**
 * The full value, for the tooltip and the bar list. The axis ticks stay compact.
 * - INR: ₹1,23,450.00. Indian grouping and 2 decimals. Other currencies: 2 decimals, in the
 *   format `formatNumber` gives that currency.
 * - `number`: 1,23,450. Indian grouping. A value with a fraction keeps up to 2 decimals.
 * - `percentage`: 12.5%. 1 decimal.
 * The suffix is added as on the ticks. A `percentage` with the suffix "%" does not get it twice.
 */
const formatChartValue = (
  value: number | string,
  valueFormatter: ChartValueFormatter = {},
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  const { type, currency, suffix } = valueFormatter;
  const withSuffix = (text: string): string => `${text}${suffix ?? ''}`;
  if (type === 'percentage') {
    const text = formatChartValueFull(num, { type: 'percent' });
    return suffix === '%' ? text : withSuffix(text);
  }
  if (type === 'currency') {
    const code = currency ? currency : 'INR';
    if (code === 'INR') {
      return withSuffix(formatChartValueFull(num, { type: 'currency', currency: 'INR' }));
    }
    return withSuffix(
      formatNumber(num, {
        currency: code as 'INR',
        intlOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      }),
    );
  }
  if (type === 'string') return withSuffix(String(num));
  return withSuffix(formatChartValueFull(num, { type: 'count' }));
};

type BarListRow = {
  label: string;
  value: number;
  /** The share of the total, 0 to 100. The bar is this wide. */
  share: number;
};

/**
 * The rows of the bar list that takes the place of a pie. Each bar is the row's share of the
 * total, not of the largest row: UPI at ₹5,20,000 of ₹9,05,000 is 57.5%. A value under 0 counts
 * as 0. Every row stays a row, in its order. Nothing folds into "Other".
 */
const getBarListRows = (
  rows: ChartRow[],
  nameKey: string,
  valueKey: string,
): { total: number; rows: BarListRow[] } => {
  const values = rows.map((row) => {
    const value = row[valueKey];
    return typeof value === 'number' && !Number.isNaN(value) ? Math.max(0, value) : 0;
  });
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    total,
    rows: rows.map((row, index) => ({
      label: String(row[nameKey]),
      value: values[index],
      share: total > 0 ? (values[index] / total) * 100 : 0,
    })),
  };
};

export {
  BAR_LIST_MAX_WIDTH,
  BAR_LIST_MIN_SLICES,
  NO_BORDER_MAX_WIDTH,
  formatChartValue,
  formatShare,
  getBarListRows,
  getDefaultShowBorder,
  resolveShowBorder,
  resolveYLabelPlacement,
  shouldShowBarList,
  CHART_ASPECT_RATIO,
  DONUT_MIN_HEIGHT,
  DONUT_SMALL_RADIUS_WIDTH,
  MAX_CHART_HEIGHT,
  MIN_CHART_HEIGHT,
  NBSP,
  TINY_CHART_HEIGHT,
  formatDateTick,
  formatINRCompact,
  getChartHeight,
  getDateStep,
  getDonutHeight,
  getDonutRadius,
  getLastLabelOverhang,
  getMaxXLabels,
  getXLabelStep,
  isDateAxis,
  isWholeNumberChart,
};
export type { BarListRow, ChartRow, ChartStep, ChartValueFormatter };
