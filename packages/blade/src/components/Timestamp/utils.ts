import type { TimestampProps } from './Timestamp';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

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
  precision: NonNullable<TimestampProps['precision']>,
): { value: number; unit: RelativeUnit } => {
  const absMs = Math.abs(diffMs);

  if (precision === 'second') {
    if (absMs < MINUTE_MS) return { value: Math.round(diffMs / SECOND_MS), unit: 'second' };
    if (absMs < HOUR_MS) return { value: Math.round(diffMs / MINUTE_MS), unit: 'minute' };
    if (absMs < DAY_MS) return { value: Math.round(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.round(diffMs / DAY_MS), unit: 'day' };
  }

  if (precision === 'minute') {
    if (absMs < HOUR_MS) return { value: Math.round(diffMs / MINUTE_MS), unit: 'minute' };
    if (absMs < DAY_MS) return { value: Math.round(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.round(diffMs / DAY_MS), unit: 'day' };
  }

  if (precision === 'hour') {
    if (absMs < DAY_MS) return { value: Math.round(diffMs / HOUR_MS), unit: 'hour' };
    return { value: Math.round(diffMs / DAY_MS), unit: 'day' };
  }

  // precision === 'day'
  return { value: Math.round(diffMs / DAY_MS), unit: 'day' };
};

type FormatTimestampOptions = {
  date: Date;
  format: NonNullable<TimestampProps['format']>;
  dateStyle: NonNullable<TimestampProps['dateStyle']>;
  timeStyle: NonNullable<TimestampProps['timeStyle']>;
  hourCycle: TimestampProps['hourCycle'];
  precision: NonNullable<TimestampProps['precision']>;
};

/**
 * Formats a Date into a human-readable string based on the provided options.
 * Uses `Intl.DateTimeFormat` for absolute formats and `Intl.RelativeTimeFormat` for relative.
 */
export const formatTimestamp = ({
  date,
  format,
  dateStyle,
  timeStyle,
  hourCycle,
  precision,
}: FormatTimestampOptions): string => {
  if (format === 'relative') {
    const diffMs = date.getTime() - Date.now();
    const { value, unit } = getRelativeUnit(diffMs, precision);
    return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(value, unit);
  }

  const hour12 =
    hourCycle === '12h' ? true : hourCycle === '24h' ? false : (undefined as boolean | undefined);

  const options: Intl.DateTimeFormatOptions = { hour12 };

  if (format === 'date' || format === 'dateTime') {
    options.dateStyle = dateStyle;
  }

  if (format === 'time' || format === 'dateTime') {
    options.timeStyle = timeStyle;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
};
