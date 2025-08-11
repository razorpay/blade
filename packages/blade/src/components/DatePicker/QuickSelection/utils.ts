import { DatesRangeValue } from '~components/DatePicker/types';

// Helper function to check if two preset values are the same
export const isSamePreset = (
  value1: DatesRangeValue | null,
  value2: DatesRangeValue | null,
): boolean => {
  if (!value1?.[0] || !value1?.[1]) return false;
  if (!value2?.[0] || !value2?.[1]) return false;

  return (
    value1[0].toDateString() === value2[0].toDateString() &&
    value1[1].toDateString() === value2[1].toDateString()
  );
};
