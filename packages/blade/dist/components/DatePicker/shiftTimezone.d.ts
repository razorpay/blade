import { DateValue, DatesRangeValue } from './types';
type TimeShiftDirection = 'add' | 'remove';
export declare function shiftTimezone<T extends DateValue | Date[] | DatesRangeValue | undefined>(direction: TimeShiftDirection, date: T, timezone?: string, disabled?: boolean): T;
export {};
