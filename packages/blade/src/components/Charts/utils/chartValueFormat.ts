/**
 * Value formats for chart ticks and tooltips, in en-IN.
 *
 * - Ticks are compact: ₹1.5L, ₹1.2Cr, 1.5K, 12.5%. At most 1 decimal, no ".0".
 * - Tooltips are full: ₹1,23,450.00, 1,23,450, 12.5%.
 *
 * A chart wrapper takes one of these through its `valueFormat` prop. ChartYAxis then uses the
 * compact form for its ticks, and ChartTooltip the full form, unless they get their own
 * `tickFormatter` or `formatter`.
 */

type ChartValueFormat = {
  /**
   * - `currency`: an amount in `currency`.
   * - `count`: a number of things. Whole numbers, with grouping.
   * - `percent`: a value already in percent, 12.5 for 12.5%.
   */
  type: 'currency' | 'count' | 'percent';
  /**
   * ISO 4217 code of the currency, for `type: 'currency'`.
   * @default 'INR'
   */
  currency?: string;
};

const LOCALE = 'en-IN';

const toNumber = (value: unknown): number =>
  typeof value === 'number' ? value : parseFloat(String(value));

/** A share with 1 decimal and a % sign: 57.5%, 100.0%. */
const formatPercentFull = (value: number): string =>
  `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;

/** The compact form, for axis ticks: ₹1.5L, 1.5K, 12.5%. A value that is not a number stays. */
const formatChartValueCompact = (value: unknown, format: ChartValueFormat): string => {
  const num = toNumber(value);
  if (Number.isNaN(num)) return String(value);
  const compact: Intl.NumberFormatOptions = {
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };
  if (format.type === 'currency') {
    return new Intl.NumberFormat(LOCALE, {
      ...compact,
      style: 'currency',
      currency: format.currency ?? 'INR',
    }).format(num);
  }
  if (format.type === 'percent') {
    return `${new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(num)}%`;
  }
  return new Intl.NumberFormat(LOCALE, compact).format(num);
};

/**
 * The full form, for tooltips: ₹1,23,450.00, 1,23,450, 12.5%. A count with a fraction keeps up to
 * 2 decimals. A value that is not a number stays.
 */
const formatChartValueFull = (value: unknown, format: ChartValueFormat): string => {
  const num = toNumber(value);
  if (Number.isNaN(num)) return String(value);
  if (format.type === 'currency') {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: format.currency ?? 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  if (format.type === 'percent') return formatPercentFull(num);
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num);
};

export { formatChartValueCompact, formatChartValueFull, formatPercentFull };
export type { ChartValueFormat };
