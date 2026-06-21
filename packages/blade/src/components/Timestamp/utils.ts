// Types defined here (not imported from Timestamp.tsx) to avoid circular dependency.
export type TimestampFormat = 'relative' | 'date' | 'time' | 'dateTime';
export type TimestampDateStyle = 'short' | 'medium' | 'long' | 'full';
export type TimestampPrecision = 'second' | 'minute' | 'hour' | 'day';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// Below this threshold, always show "now" regardless of precision.
const JUST_NOW_THRESHOLD_MS = 10 * SECOND_MS;

/**
 * Converts a value prop to a Date object.
 * Accepts Date, ISO string, or Unix timestamp in milliseconds.
 */
export const toDate = (value: Date | string | number): Date => {
  if (value instanceof Date) return value;
  return new Date(value);
};

type RelativeUnit = 'second' | 'minute' | 'hour' | 'day';

const getRelativeUnit = (
  diffMs: number,
  precision: TimestampPrecision,
): { value: number; unit: RelativeUnit } => {
  const absMs = Math.abs(diffMs);

  // < 10s always returns 0 seconds → Intl renders "now" with numeric:'auto'.
  // This prevents "1 second ago" flickering on fresh timestamps.
  if (absMs < JUST_NOW_THRESHOLD_MS) {
    return { value: 0, unit: 'second' };
  }

  // Use Math.floor (not Math.round) so "59 seconds ago" never jumps to "1 minute ago"
  // before a full minute has elapsed.
  if (precision === 'second') {
    if (absMs < MINUTE_MS) return { value: Math.floor(diffMs / SECOND_MS), unit: 'second' };
    if (absMs < HOUR_MS) return { value: Math.floor(diffMs / MINUTE_MS), unit: 'minute' };
    if (absMs < DAY_MS) return { value: Math.floor(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.floor(diffMs / DAY_MS), unit: 'day' };
  }

  if (precision === 'minute') {
    if (absMs < HOUR_MS) return { value: Math.floor(diffMs / MINUTE_MS), unit: 'minute' };
    if (absMs < DAY_MS) return { value: Math.floor(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.floor(diffMs / DAY_MS), unit: 'day' };
  }

  if (precision === 'hour') {
    if (absMs < DAY_MS) return { value: Math.floor(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.floor(diffMs / DAY_MS), unit: 'day' };
  }

  // precision === 'day'
  return { value: Math.floor(diffMs / DAY_MS), unit: 'day' };
};

// Maps the explicit `precision` prop to Intl.DateTimeFormat timeStyle.
// Only 'minute' and 'second' are meaningful for absolute formats.
const precisionToTimeStyle = (precision: TimestampPrecision): 'short' | 'medium' =>
  precision === 'second' ? 'medium' : 'short';

export type FormatTimestampOptions = {
  date: Date;
  format: TimestampFormat;
  dateStyle: TimestampDateStyle;
  hourCycle?: '12h' | '24h';
  precision: TimestampPrecision;
  locale: string;
};

/**
 * Formats a Date into a human-readable string based on the provided options.
 * Uses `Intl.DateTimeFormat` for absolute formats and `Intl.RelativeTimeFormat` for relative.
 */
export const formatTimestamp = ({
  date,
  format,
  dateStyle,
  hourCycle,
  precision,
  locale,
}: FormatTimestampOptions): string => {
  if (format === 'relative') {
    const diffMs = date.getTime() - Date.now();
    const { value, unit } = getRelativeUnit(diffMs, precision);
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
  }

  const hour12 =
    hourCycle === '12h' ? true : hourCycle === '24h' ? false : (undefined as boolean | undefined);

  const options: Intl.DateTimeFormatOptions = { hour12 };

  if (format === 'date' || format === 'dateTime') {
    options.dateStyle = dateStyle;
  }

  if (format === 'time' || format === 'dateTime') {
    options.timeStyle = precisionToTimeStyle(precision);
  }

  const raw = new Intl.DateTimeFormat(locale, options).format(date);
  // Normalise am/pm to uppercase — en-IN CLDR uses lowercase British style by default.
  return raw.replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
};

/**
 * Returns the full absolute datetime string used as tooltip content.
 * Always shows the complete picture regardless of what the visible text shows.
 * e.g. "Saturday, 30 May 2026 at 6:33 PM"
 *
 * The Intl API for en-IN (and other en-* locales) outputs lowercase "am/pm".
 * We normalise to uppercase to match the industry standard (Stripe, GitHub, etc.)
 * and keep the tooltip consistent with any absolute-format visible text.
 */
export const getFullAbsoluteLabel = (date: Date, locale: string): string => {
  const raw = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(
    date,
  );
  // Uppercase standalone am/pm markers (whole-word, case-insensitive).
  // Matches "6:33 am" → "6:33 AM", "6:33pm" → "6:33PM", leaves other text untouched.
  return raw.replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
};

/**
 * Returns the adaptive auto-update interval in ms for a relative timestamp.
 * Interval decreases for fresher timestamps so updates feel responsive.
 *
 * < 1 min old → update every 10s
 * < 1 hr old  → update every 1 min
 * older       → update every 1 hr
 */
export const getRelativeUpdateInterval = (date: Date): number => {
  const ageMs = Math.abs(Date.now() - date.getTime());
  if (ageMs < MINUTE_MS) return SECOND_MS * 10;
  if (ageMs < HOUR_MS) return MINUTE_MS;
  return HOUR_MS;
};
