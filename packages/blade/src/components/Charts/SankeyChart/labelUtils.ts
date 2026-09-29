/**
 * Pure helpers for SankeyChart label text. Platform-agnostic: measurement is injected so the
 * web (canvas) and native (advance-width table) callers can share the same rules.
 */

const ELLIPSIS = '…';

/**
 * Formats a share of the total for a label chip.
 *
 * Shares are rounded to whole percentages, except that a share between 0 and 1 renders as
 * `<1` instead of `0` — a node that carries real volume must never read as nothing.
 *
 * @example formatSharePercentage(12.4) // '12'
 * @example formatSharePercentage(0.4)  // '<1'
 */
export const formatSharePercentage = (share: number): string => {
  if (!Number.isFinite(share) || share <= 0) return '0';
  if (share < 1) return `<${1}`;
  return String(Math.round(share));
};

/**
 * Formats a share for the detailed breakdown in a group's tooltip: one decimal place, so
 * members that all round to the same whole percentage can still be told apart.
 *
 * @example formatShareDetailed(12.34) // '12.3'
 * @example formatShareDetailed(4)     // '4'
 * @example formatShareDetailed(0.04)  // '<0.1'
 */
export const formatShareDetailed = (share: number): string => {
  if (!Number.isFinite(share) || share <= 0) return '0';
  if (share < 0.1) return '<0.1';
  return String(Math.round(share * 10) / 10);
};

/**
 * Trims `text` so that its measured width fits `maxWidth`, appending an ellipsis.
 *
 * Returns the text unchanged when it already fits. When even a single character plus the
 * ellipsis does not fit, returns the ellipsis alone. `measure` must return a width in the same
 * unit as `maxWidth` and be monotonic in text length — a shorter string never measures wider.
 * If the measurer cannot see a difference between strings (for example a fixed fallback width
 * where the canvas API is unavailable), the text is returned untouched rather than mangled.
 */
export const truncateTextToWidth = (
  text: string,
  maxWidth: number,
  measure: (text: string) => number,
): string => {
  if (text.length === 0) return text;
  if (maxWidth <= 0) return ELLIPSIS;

  const fullWidth = measure(text);
  if (fullWidth <= maxWidth) return text;

  // A measurer that reports the same width for a single character as for the whole string
  // cannot guide truncation — bail out instead of trimming to nothing.
  if (measure(text.slice(0, 1)) >= fullWidth) return text;

  // Binary search on the character count: the widest prefix whose width, with the ellipsis, fits.
  let low = 0;
  let high = text.length - 1;
  let best = '';
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = `${text.slice(0, mid)}${ELLIPSIS}`;
    if (measure(candidate) <= maxWidth) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best.length > 0 ? best : ELLIPSIS;
};

/**
 * Splits the single-line content budget of a label between the node name and the value text.
 *
 * The value text (humanised value, unit, share) carries the numbers, so it is kept whole
 * whenever it fits and the name absorbs the truncation. Only when the value text alone
 * exceeds the budget is the value truncated too and the name reduced to an ellipsis.
 */
export const fitLabelToWidth = ({
  name,
  valueText,
  maxContentWidth,
  gap,
  measureName,
  measureValue,
}: {
  name: string;
  valueText: string;
  /** Width available for `name + gap + valueText` */
  maxContentWidth: number;
  /** Space between the name and the value text */
  gap: number;
  measureName: (text: string) => number;
  measureValue: (text: string) => number;
}): { name: string; valueText: string; nameWidth: number; valueWidth: number } => {
  const valueWidth = measureValue(valueText);
  const nameBudget = maxContentWidth - gap - valueWidth;

  if (nameBudget >= measureName(ELLIPSIS)) {
    const fittedName = truncateTextToWidth(name, nameBudget, measureName);
    return {
      name: fittedName,
      valueText,
      nameWidth: measureName(fittedName),
      valueWidth,
    };
  }

  // The value alone does not leave room for any name: keep a bare ellipsis as the name and
  // truncate the value into whatever is left.
  const ellipsisWidth = measureName(ELLIPSIS);
  const fittedValue = truncateTextToWidth(
    valueText,
    Math.max(0, maxContentWidth - gap - ellipsisWidth),
    measureValue,
  );
  return {
    name: ELLIPSIS,
    valueText: fittedValue,
    nameWidth: ellipsisWidth,
    valueWidth: measureValue(fittedValue),
  };
};
