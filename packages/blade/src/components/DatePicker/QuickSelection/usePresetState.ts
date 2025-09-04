import { useMemo } from 'react';
import type { DatesRangeValue } from '../types';
import { isSamePreset } from './utils';
import type { PresetState, UsePresetStateProps, UsePresetStateReturn } from './types';

export const usePresetState = ({
  presets,
  selectedPreset,
  currentDate,
}: UsePresetStateProps): UsePresetStateReturn => {
  return useMemo(() => {
    // No presets provided → return empty state
    if (!presets) {
      return {
        presetStates: [],
        selectedPresetIndex: null,
        selectedPresetLabel: null,
        isCustomSelected: false,
        effectiveSelectionType: null, // Default when no presets
      };
    }

    // STEP 1: Calculate each preset's value and type
    // Example: "Last 7 days" → [2024-01-01, 2024-01-08], isCustomType: false
    // Example: "Custom" → [null, null], isCustomType: true
    const presetStates: PresetState[] = presets.map((preset) => {
      let presetValue: DatesRangeValue | null = null;
      let isCustomType = false;

      presetValue = preset.value(currentDate); // Call function: "Last 7 days" → [startDate, endDate]
      // Check if preset returns valid dates (defined) or null (custom)
      isCustomType = !(presetValue?.[0] instanceof Date && presetValue?.[1] instanceof Date);

      return {
        preset, // Original preset object { label: "Last 7 days", value: fn }
        value: presetValue, // Calculated dates [2024-01-01, 2024-01-08] or [null, null]
        isSelected: false, // ⏳ Will calculate this next
        isCustomType, // true = Custom preset, false = Defined preset
      };
    });

    // STEP 2: Figure out which preset is currently selected
    // Example: User selected [2024-01-01, 2024-01-08] → matches "Last 7 days" preset
    let selectedPresetIndex: number | null = null;
    let isCustomSelected = false;

    if (!selectedPreset) {
      // No dates selected → find and select "Custom" preset by default
      selectedPresetIndex = presetStates.findIndex((state) => state.isCustomType);
      isCustomSelected = selectedPresetIndex !== -1;
    } else {
      // User has selected dates → see if they match any defined preset
      // Example: selectedPreset = [2024-01-01, 2024-01-08], check if matches "Last 7 days"
      selectedPresetIndex = presetStates.findIndex(
        (state) => !state.isCustomType && isSamePreset(selectedPreset, state.value),
      );

      if (selectedPresetIndex === -1) {
        // No match found → user made custom selection → select "Custom" preset
        selectedPresetIndex = presetStates.findIndex((state) => state.isCustomType);
        isCustomSelected = true;
      }
    }

    // STEP 3: Mark the selected preset as selected
    if (selectedPresetIndex !== -1) {
      presetStates[selectedPresetIndex].isSelected = true;
    }

    // STEP 4: Get the label for display
    // Example: selectedPresetIndex = 0 → presetStates[0].preset.label = "Last 7 days"
    const selectedPresetLabel =
      selectedPresetIndex !== -1 ? presetStates[selectedPresetIndex].preset.label : null;

    // STEP 5: Calculate effective selection type based on selected preset
    // If preset returns same-day range (like "Today"), display as single date
    let effectiveSelectionType: 'single' | 'range' = 'range'; // Default to range

    if (selectedPresetIndex !== -1) {
      const selectedPresetState = presetStates[selectedPresetIndex];

      // Check if selected preset represents same day (like "Today" preset)
      if (
        selectedPresetState.value?.[0] &&
        selectedPresetState.value?.[1] &&
        selectedPresetState.value[0].toDateString() === selectedPresetState.value[1].toDateString()
      ) {
        effectiveSelectionType = 'single'; // Same day = display as single
      } else {
        effectiveSelectionType = 'range'; // Different days = display as range
      }
    }

    // Return final calculated state - this gets shared with all components
    return {
      presetStates, // Array: [{ preset, value, isSelected, isCustomType }, ...]
      selectedPresetIndex, // Number: 0, 1, 2... or null
      selectedPresetLabel, // String: "Last 7 days" or "Custom" or null
      isCustomSelected, // Boolean: true if custom dates selected
      effectiveSelectionType, // 'single' | 'range' based on preset analysis
    };
  }, [presets, selectedPreset, currentDate]); // Recalculate when any of these change
};
