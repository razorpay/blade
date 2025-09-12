import { Time } from '@internationalized/date';
import type { TimeFormat } from './types';

/**
 * Converts a Date object to TimeValue for React Aria compatibility
 * Used internally to bridge between external Date API and React Aria's Time objects
 *
 * @param date - The Date object to convert, or null
 * @returns Time object for React Aria, or null if input is null
 *
 * @example
 * // Convert Date to TimeValue
 * const date = new Date('2024-01-01T14:30:00');
 * dateToTimeValue(date)
 * // → Time { hour: 14, minute: 30 }
 *
 * @example
 * // Handle null input
 * dateToTimeValue(null)
 * // → null
 */
export const dateToTimeValue = (date: Date | null): Time | null => {
  if (!date) return null;
  return new Time(date.getHours(), date.getMinutes());
};

/**
 * Converts a TimeValue to Date object for external API
 * Used internally to bridge between React Aria's Time objects and external Date API
 *
 * @param timeValue - The Time object to convert, or null
 * @returns Date object with today's date and specified time, or null if input is null
 *
 * @example
 * // Convert TimeValue to Date
 * const timeValue = new Time(14, 30);
 * timeValueToDate(timeValue)
 * // → Date object with today's date at 2:30 PM
 *
 * @example
 * // Handle null input
 * timeValueToDate(null)
 * // → null
 */
export const timeValueToDate = (timeValue: Time | null): Date | null => {
  if (!timeValue) return null;
  const date = new Date();
  date.setHours(timeValue.hour, timeValue.minute, 0, 0);
  return date;
};

/**
 * Extracts individual time components from a Date object
 * Converts between 24-hour and 12-hour formats as needed for display
 *
 * @param time - The Date object to extract components from, or null
 * @param timeFormat - Whether to use 12-hour or 24-hour format
 * @returns Object with selectedHour, selectedMinute, and selectedPeriod
 *
 * @example
 * // Extract components in 12-hour format
 * const date = new Date('2024-01-01T14:30:00');
 * getTimeComponents(date, '12h')
 * // → { selectedHour: 2, selectedMinute: 30, selectedPeriod: 'PM' }
 *
 * @example
 * // Extract components in 24-hour format
 * const date = new Date('2024-01-01T14:30:00');
 * getTimeComponents(date, '24h')
 * // → { selectedHour: 14, selectedMinute: 30, selectedPeriod: 'AM' }
 *
 * @example
 * // Handle null input (returns default 12:00 AM)
 * getTimeComponents(null, '12h')
 * // → { selectedHour: 12, selectedMinute: 0, selectedPeriod: 'AM' }
 */
export const getTimeComponents = (
  time: Date | null,
  timeFormat: TimeFormat,
): {
  selectedHour: number;
  selectedMinute: number;
  selectedPeriod: string;
} => {
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

    // Convert 24-hour to 12-hour format
    let displayHour: number;
    if (hour === 0) {
      displayHour = 12; // Midnight becomes 12 AM
    } else if (hour > 12) {
      displayHour = hour - 12; // PM hours (1-11 PM)
    } else {
      displayHour = hour; // AM hours (1-11 AM) and noon (12 PM)
    }

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
 * Validates input values and converts 12-hour format to 24-hour as needed
 *
 * @param selectedHour - Hour value (1-12 for 12h format, 0-23 for 24h format)
 * @param selectedMinute - Minute value (0-59)
 * @param selectedPeriod - AM/PM indicator (only used in 12h format)
 * @param timeFormat - Whether to use 12-hour or 24-hour format
 * @returns Date object with today's date and specified time, or null if validation fails
 *
 * @example
 * // Create time in 12-hour format
 * createCompleteTime(2, 30, 'PM', '12h')
 * // → Date object with today's date at 2:30 PM (14:30)
 *
 * @example
 * // Create time in 24-hour format
 * createCompleteTime(14, 30, 'AM', '24h')
 * // → Date object with today's date at 14:30
 *
 * @example
 * // Handle midnight in 12-hour format
 * createCompleteTime(12, 0, 'AM', '12h')
 * // → Date object with today's date at 00:00
 *
 * @example
 * // Invalid input returns null
 * createCompleteTime(25, 30, 'AM', '24h')
 * // → null (hour 25 is invalid)
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
  } else if (selectedHour < 0 || selectedHour > 23 || selectedMinute < 0 || selectedMinute > 59) {
    return null;
  }

  const newDate = new Date();

  if (timeFormat === '12h') {
    // Convert 12-hour format to 24-hour format
    let hour24: number;

    if (selectedPeriod === 'AM') {
      // AM: 12 becomes 0, all others stay the same
      hour24 = selectedHour === 12 ? 0 : selectedHour;
    } else {
      // PM: 12 stays 12, all others add 12
      hour24 = selectedHour === 12 ? 12 : selectedHour + 12;
    }

    newDate.setHours(hour24, selectedMinute, 0, 0);
  } else {
    newDate.setHours(selectedHour, selectedMinute, 0, 0);
  }

  return newDate;
};

/**
 * Creates a Date object from time selection with optional parameter overrides
 * Used by TimePickerContent when individual wheels change values
 * Provides fallback handling to prevent crashes from invalid inputs
 *
 * @param currentHour - Current hour value (fallback)
 * @param currentMinute - Current minute value (fallback)
 * @param currentPeriod - Current period value (fallback)
 * @param timeFormat - Time format (12h or 24h)
 * @param hour - Optional hour override
 * @param minute - Optional minute override
 * @param period - Optional period override
 * @returns Date object with the specified time (never null)
 *
 * @example
 * // Update only the hour
 * createDateFromSelection(10, 30, 'AM', '12h', 11)
 * // → Date object with 11:30 AM
 *
 * @example
 * // Update only the minute
 * createDateFromSelection(10, 30, 'AM', '12h', undefined, 45)
 * // → Date object with 10:45 AM
 *
 * @example
 * // Update only the period
 * createDateFromSelection(10, 30, 'AM', '12h', undefined, undefined, 'PM')
 * // → Date object with 10:30 PM
 *
 * @example
 * // Use all current values (no overrides)
 * createDateFromSelection(2, 15, 'PM', '12h')
 * // → Date object with 2:15 PM
 */
export const createDateFromSelection = (
  currentHour: number,
  currentMinute: number,
  currentPeriod: string,
  timeFormat: TimeFormat,
  hour?: number,
  minute?: number,
  period?: string,
): Date => {
  const useHour = hour ?? currentHour;
  const useMinute = minute ?? currentMinute;
  const usePeriod = period ?? currentPeriod;

  const result = createCompleteTime(useHour, useMinute, usePeriod, timeFormat);

  // createCompleteTime can return null, but in TimePickerContent context we always expect a valid date
  // If validation fails, fall back to current time to prevent crashes
  return result ?? new Date();
};

/**
 * Calculates the nearest step value for dropdown positioning when minuteStep is used
 * Allows users to type any minute while dropdown shows nearest valid step
 *
 * This enables a better UX where typed values are preserved for form submission,
 * but the dropdown visually aligns to the nearest step for consistency.
 *
 * @param actualValue - The actual minute value typed by user (0-59)
 * @param step - The minute step interval (1, 5, 15, 30)
 * @returns The nearest step value for dropdown positioning
 *
 * @example
 * // 15-minute steps
 * getNearestStepValue(17, 15)
 * // → 15 (user typed 17, dropdown shows 15)
 *
 * @example
 * // 30-minute steps
 * getNearestStepValue(42, 30)
 * // → 30 (user typed 42, dropdown shows 30)
 *
 * @example
 * // 5-minute steps
 * getNearestStepValue(23, 5)
 * // → 25 (user typed 23, dropdown shows 25)
 *
 * @example
 * // 1-minute steps (no change needed)
 * getNearestStepValue(17, 1)
 * // → 17 (exact match, no rounding)
 */
export const getNearestStepValue = (actualValue: number, step: number): string => {
  const nearestValue = Math.round(actualValue / step) * step;

  // If calculated value is 60 or more, wrap to 0 (since 60 minutes doesn't exist)
  const finalValue = nearestValue >= 60 ? 0 : nearestValue;

  return String(finalValue).padStart(2, '0');
};
