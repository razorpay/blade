import React from 'react';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';
import { CalendarIcon } from '~components/Icons';

import type { renderPresetDropdownProps } from './types';

const renderPresetDropdown = ({
  onSelection,
  onOpenCalendar,
  presetStates,
  selectedPresetLabel,
}: renderPresetDropdownProps): React.ReactElement => {
  return (
    <Dropdown>
      <InputDropdownButton value={selectedPresetLabel ?? 'Custom'} icon={CalendarIcon} />
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

export { renderPresetDropdown };
