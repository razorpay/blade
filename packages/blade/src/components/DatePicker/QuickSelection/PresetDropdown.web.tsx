import React from 'react';
import type { DatesRangeValue } from '../types';
import { usePresetContext } from './PresetContext';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';

type PresetDropdownProps = {
  onSelection: (preset: (date: Date) => DatesRangeValue) => void;
  onOpenCalendar?: () => void;
};

const PresetDropdown = ({
  onSelection,
  onOpenCalendar,
}: PresetDropdownProps): React.ReactElement => {
  const { presetStates, selectedPresetLabel } = usePresetContext();

  return (
    <Dropdown>
      <InputDropdownButton value={selectedPresetLabel ?? 'Custom'} />
      <DropdownOverlay>
        <ActionList>
          {presetStates.map(({ preset, isSelected, isCustomType }) => (
            <ActionListItem
              key={preset.label}
              title={preset.label}
              value={preset.label}
              isSelected={isSelected}
              onClick={() => {
                onSelection(preset.value);
                // If this is a custom preset selection, also trigger calendar opening
                if (isCustomType && onOpenCalendar) {
                  onOpenCalendar();
                }
              }}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export { PresetDropdown };
