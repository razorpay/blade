/**
 * Long values on one line, cut in the middle: `pay_Rk3v…Zp2Lw`, `customer.na…@example.com`.
 * Pure helpers for GenUILongValue.
 * The cut keeps the start and the end, and happens only when the value does not fit its width.
 */

/** The kinds of value cut in the middle. Any other text wraps as before. */
type LongValueKind = 'email' | 'url' | 'identifier';

const ELLIPSIS = '…';

/** An email or a VPA: `name@domain` or `name@bank`. */
const EMAIL_OR_VPA = /^[^\s@]+@[^\s@]+$/;
const URL_PATTERN = /^(https?:\/\/|www\.)\S+$/i;
/** A prefixed id: `pay_Rk3vXXXXXXZp2Lw`, `order_…`, `rfnd_…`. */
const PREFIXED_ID = /^[a-z]{2,10}_[A-Za-z0-9]{6,}$/;
/** Any other id: 12 or more id characters with a digit, such as a UTR or a UUID. */
const OTHER_ID = /^(?=.*\d)[A-Za-z0-9][A-Za-z0-9_\-.:/]{11,}$/;
/** A date or a time is not an id. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/** The kind of a long value, or null for text that wraps as before. */
const getLongValueKind = (value: unknown): LongValueKind | null => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text !== value || text.length === 0) return null;
  if (URL_PATTERN.test(text)) return 'url';
  if (EMAIL_OR_VPA.test(text)) return 'email';
  if (ISO_DATE.test(text)) return null;
  if (PREFIXED_ID.test(text) || OTHER_ID.test(text)) return 'identifier';
  return null;
};

/** The start keeps 60% of the characters kept, the end 40%: `pay_Rk3v…Zp2Lw`. */
const START_SHARE = 0.6;
/** An email keeps its whole domain while the name keeps at least this many characters. */
const MIN_EMAIL_NAME = 3;

type MeasureText = (text: string) => number;

/** The largest n in [low, high] for which fits(n) holds, or low - 1. fits must be monotone. */
const largestFitting = (low: number, high: number, fits: (n: number) => boolean): number => {
  let best = low - 1;
  let lo = low;
  let hi = high;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (fits(mid)) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
};

const cutKeeping = (value: string, kept: number): string => {
  const start = Math.max(1, Math.round(kept * START_SHARE));
  const end = kept - start;
  return `${value.slice(0, start)}${ELLIPSIS}${end > 0 ? value.slice(value.length - end) : ''}`;
};

/**
 * The value as it fits `maxWidth`: whole when it fits, else cut in the middle. An email keeps its
 * whole domain when it can. A width of 0 (not measured yet) keeps the value whole.
 */
const middleTruncate = (
  value: string,
  maxWidth: number,
  measure: MeasureText,
  kind: LongValueKind,
): string => {
  if (maxWidth <= 0 || measure(value) <= maxWidth) return value;

  if (kind === 'email') {
    const at = value.lastIndexOf('@');
    const name = value.slice(0, at);
    const domain = value.slice(at);
    const keep = largestFitting(
      MIN_EMAIL_NAME,
      name.length - 1,
      (n) => measure(`${name.slice(0, n)}${ELLIPSIS}${domain}`) <= maxWidth,
    );
    if (keep >= MIN_EMAIL_NAME) return `${name.slice(0, keep)}${ELLIPSIS}${domain}`;
  }

  const kept = largestFitting(
    2,
    value.length - 1,
    (n) => measure(cutKeeping(value, n)) <= maxWidth,
  );
  return cutKeeping(value, Math.max(2, kept));
};

let canvasContext: CanvasRenderingContext2D | null | undefined;

/** The width of `text` in `font`, from a canvas. 0 where there is no canvas (jsdom). */
const measureTextWidth = (text: string, font: string): number => {
  if (canvasContext === undefined) {
    try {
      canvasContext = document.createElement('canvas').getContext('2d') ?? null;
    } catch {
      canvasContext = null;
    }
  }
  if (!canvasContext) return 0;
  canvasContext.font = font;
  return canvasContext.measureText(text).width;
};

/** The canvas font of an element, from its longhands. Some browsers leave `font` empty. */
const getFontOf = (element: Element): string => {
  try {
    const style = window.getComputedStyle(element);
    return [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily]
      .filter(Boolean)
      .join(' ');
  } catch {
    return '';
  }
};

/** The CSS letter-spacing of an element, in px. 0 for `normal` or on an error. */
const getLetterSpacingOf = (element: Element): number => {
  try {
    const spacing = parseFloat(window.getComputedStyle(element).letterSpacing);
    return Number.isFinite(spacing) ? spacing : 0;
  } catch {
    return 0;
  }
};

export {
  ELLIPSIS,
  getLongValueKind,
  middleTruncate,
  measureTextWidth,
  getFontOf,
  getLetterSpacingOf,
};
export type { LongValueKind, MeasureText };
