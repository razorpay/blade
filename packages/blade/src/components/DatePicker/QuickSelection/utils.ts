import { DatesRangeValue, CalendarProps } from '~components/DatePicker/types';

const CUSTOM_PRESET_LABEL = 'Custom' as const;

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

// Helper function to check if Custom preset should be selected
export const isCustomSelected = (
  selectedPreset: DatesRangeValue | null,
  currentDate: Date,
  presets: CalendarProps<'single'>['presets'],
): boolean => {
  if (!presets || presets.length === 0) return false;

  // If no preset is selected, Custom is selected
  if (!selectedPreset) return true;

  // Check if selectedPreset matches any non-Custom preset
  const nonCustomPresets = presets.filter((p) => p.label !== CUSTOM_PRESET_LABEL);
  const matchesAnyPreset = nonCustomPresets.some((preset) =>
    isSamePreset(selectedPreset, preset.value(currentDate)),
  );

  // Custom is selected if selectedPreset doesn't match any other preset
  return !matchesAnyPreset;
};
