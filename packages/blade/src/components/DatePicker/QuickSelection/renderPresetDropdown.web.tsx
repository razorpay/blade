import React from 'react';
import type { renderPresetDropdownProps } from './types';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { InputDropdownButton } from '~components/Dropdown/InputDropdownButton';
import { CalendarIcon } from '~components/Icons';

const renderPresetDropdown = ({
  onSelection,
  onOpenCalendar,
  presetStates,
  selectedPresetLabel,
}: renderPresetDropdownProps): React.ReactElement => {
  // Filter out presets that should be hidden when selected (e.g., "Custom" preset)
  const visiblePresetStates = presetStates.filter(
    ({ preset, isSelected }) => !(preset.hideLabelOnSelection && isSelected),
  );

  return (
    <Dropdown>
      <InputDropdownButton value={selectedPresetLabel ?? 'Custom'} icon={CalendarIcon} />
      <DropdownOverlay>
        <ActionList>
          {visiblePresetStates.map(({ preset, isSelected, isCustomType }) => (
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
