import type { DatesRangeValue, CalendarProps } from '../types';

type presets = CalendarProps<'range'>['presets'];
type selectedPreset = DatesRangeValue | null;

type PresetProviderProps = {
  children: React.ReactNode;
  presets: presets;
  selectedPreset: selectedPreset;
  currentDate: Date;
};

type renderPresetDropdownProps = {
  onSelection: (preset: (date: Date) => DatesRangeValue) => void;
  onOpenCalendar?: () => void;
  presetStates: PresetState[];
  selectedPresetLabel: string | null;
};

type PresetState = {
  preset: NonNullable<CalendarProps<'range'>['presets']>[0];
  value: DatesRangeValue | null;
  isSelected: boolean;
  isCustomType: boolean;
};

type PresetContextValue = {
  presetStates: PresetState[];
  selectedPresetIndex: number | null;
  selectedPresetLabel: string | null;
  isCustomSelected: boolean;
  effectiveSelectionType: 'single' | 'range' | null;
};

type PresetSideBarProps = {
  isMobile?: boolean;
  onSelection: (value: (date: Date) => DatesRangeValue) => void;
  presetStates: PresetState[];
};

type UsePresetStateProps = {
  presets: presets;
  selectedPreset: selectedPreset;
  currentDate: Date;
  /**
   * Controls how the selected date is displayed in the input field.
   * - `compact`: Shows only the preset label instead of the actual dates.
   * - `default`: Shows the actual date values in the input field.
   */
  displayFormat?: 'compact' | 'default';
};

type UsePresetStateReturn = {
  presetStates: PresetState[];
  selectedPresetIndex: number | null;
  selectedPresetLabel: string | null;
  isCustomSelected: boolean;
  effectiveSelectionType: 'single' | 'range' | null;
  shouldHideDateOnSelection: boolean;
};

export type {
  PresetProviderProps,
  presets,
  selectedPreset,
  renderPresetDropdownProps,
  PresetState,
  PresetContextValue,
  PresetSideBarProps,
  UsePresetStateProps,
  UsePresetStateReturn,
};
