import { Time } from '@internationalized/date';
import type { TimeFormat } from './types';

/**
 * Converts a Date object to TimeValue for React Aria compatibility
 */
export const dateToTimeValue = (date: Date | null): Time | null => {
  if (!date) return null;
  return new Time(date.getHours(), date.getMinutes());
};

/**
 * Converts a TimeValue to Date object for external API
 */
export const timeValueToDate = (timeValue: Time | null): Date | null => {
  if (!timeValue) return null;
  const date = new Date();
  date.setHours(timeValue.hour, timeValue.minute, 0, 0);
  return date;
};

/**
 * Extracts individual time components from a Date object
 */
export const getTimeComponents = (time: Date | null, timeFormat: TimeFormat) => {
  if (!time) {
    return {
      selectedHour: 12,
      selectedMinute: 0,
      selectedPeriod: 'AM' as const,
    };
  }

  const hour = time.getHours();
  const minute = time.getMinutes();

  if (timeFormat === '12h') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
      selectedHour: displayHour,
      selectedMinute: minute,
      selectedPeriod: period,
    };
  } else {
    return {
      selectedHour: hour,
      selectedMinute: minute,
      selectedPeriod: 'AM' as const, // Not used in 24h format
    };
  }
};

/**
 * Creates a complete Date object from time components
 */
export const createCompleteTime = (
  selectedHour: number,
  selectedMinute: number,
  selectedPeriod: string,
  timeFormat: TimeFormat,
): Date | null => {
  // Validate values
  if (timeFormat === '12h') {
    if (selectedHour < 1 || selectedHour > 12 || selectedMinute < 0 || selectedMinute > 59)
      return null;
  } else {
    if (selectedHour < 0 || selectedHour > 23 || selectedMinute < 0 || selectedMinute > 59)
      return null;
  }

  const newDate = new Date();
  if (timeFormat === '12h') {
    const hour24 =
      selectedPeriod === 'AM'
        ? selectedHour === 12
          ? 0
          : selectedHour
        : selectedHour === 12
        ? 12
        : selectedHour + 12;
    newDate.setHours(hour24, selectedMinute, 0, 0);
  } else {
    newDate.setHours(selectedHour, selectedMinute, 0, 0);
  }

  return newDate;
};

/**
 * Calculates the nearest step value for dropdown positioning when minuteStep is used.
 *
 * This allows users to type any minute value (e.g., 03, 17, 42) while the dropdown
 * visually positions itself at the nearest valid step (e.g., 00, 15, 45).
 *
 * The actual typed value is preserved for form submission, but the dropdown shows
 * the nearest step for visual reference and consistency.
 *
 * @param actualValue - The actual minute value typed by user (0-59)
 * @param step - The minute step interval (1, 5, 15, 30)
 * @returns The nearest step value for dropdown positioning
 */
export const getNearestStepValue = (actualValue: number, step: number): number => {
  return Math.round(actualValue / step) * step;
};
