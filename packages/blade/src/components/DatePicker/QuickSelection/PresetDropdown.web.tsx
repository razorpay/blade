import React, { useMemo } from 'react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { CalendarProps, DatesRangeValue } from '../types';
import { isCustomSelected, isSamePreset } from './utils';

const CUSTOM_PRESET_LABEL = 'Custom' as const;

type PresetDropdownProps = {
  date: Date;
  presets: CalendarProps<'range'>['presets'];
  selectedPreset: DatesRangeValue | null;
  onSelection: (preset: (date: Date) => DatesRangeValue) => void;
};

const PresetDropdown = ({ presets, selectedPreset, date, onSelection }: PresetDropdownProps) => {
  if (!presets) return null;

  const presetData = useMemo(() => {
    const results = presets.map((preset) => {
      const presetValue = preset.value(date);
      const isSelected =
        preset.label === CUSTOM_PRESET_LABEL
          ? isCustomSelected(selectedPreset, date, presets)
          : isSamePreset(selectedPreset, presetValue);

      return {
        preset,
        presetValue,
        isSelected,
      };
    });

    // Find selected preset label
    const selectedLabel = (() => {
      if (isCustomSelected(selectedPreset, date, presets)) {
        return CUSTOM_PRESET_LABEL;
      }

      const selectedPresetData = results.find(({ isSelected }) => isSelected);
      return selectedPresetData?.preset.label || CUSTOM_PRESET_LABEL;
    })();

    return { results, selectedLabel };
  }, [presets, selectedPreset, date]);

  return (
    <Dropdown>
      <InputDropdownButton defaultValue={presetData.selectedLabel} />
      <DropdownOverlay>
        <ActionList>
          {presetData.results.map(({ preset, isSelected }) => (
            <ActionListItem
              key={preset.label}
              title={preset.label}
              value={preset.label}
              isSelected={isSelected}
              onClick={() => onSelection(preset.value)}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export { PresetDropdown };
