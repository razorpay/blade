import React from 'react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { DatesRangeValue } from '../types';
import { usePresetContext } from './PresetContext';

type PresetDropdownProps = {
  onSelection: (preset: (date: Date) => DatesRangeValue) => void;
};

const PresetDropdown = ({ onSelection }: PresetDropdownProps) => {
  const { presetStates, selectedPresetLabel } = usePresetContext();

  return (
    <Dropdown>
      <InputDropdownButton value={selectedPresetLabel || 'Custom'} />
      <DropdownOverlay>
        <ActionList>
          {presetStates.map(({ preset, isSelected }) => (
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
