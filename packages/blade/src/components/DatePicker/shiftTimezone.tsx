import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import type { DateValue, DatesRangeValue } from './types';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

function getTimezoneOffset(date: Date, timezone?: string): number {
  if (timezone) {
    return dayjs(date).tz(timezone).utcOffset() + date.getTimezoneOffset();
  }
  return 0;
}

type TimeShiftDirection = 'add' | 'remove';

const updateTimezone = (
  date: DateValue | undefined,
  timezone?: string,
  direction?: TimeShiftDirection,
): DateValue => {
  if (!date) {
    return null;
  }
  if (!timezone) {
    return date;
  }
  let offset = getTimezoneOffset(date, timezone);
  if (direction === 'remove') {
    offset *= -1;
  }
  return dayjs(date).add(offset, 'minutes').toDate();
};

export function shiftTimezone<T extends DateValue | Date[] | DatesRangeValue | undefined>(
  direction: TimeShiftDirection,
  date: T,
  timezone?: string,
  disabled?: boolean,
): T {
  if (disabled || !date) {
    return date;
  }
  if (Array.isArray(date)) {
    return date.map((d) => updateTimezone(d, timezone, direction)) as T;
  }
  return updateTimezone(date, timezone, direction) as T;
}
