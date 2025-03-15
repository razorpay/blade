import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay, FilterChipGroup } from '..';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { FilterChipDatePicker } from '~components/DatePicker';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Filter Chip Group',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

export const Default = (): React.ReactElement => {
  const [value, setSelectedValue] = React.useState<string | undefined>(undefined);

  return (
    <FilterChipGroup>
      <Dropdown>
        <FilterChipSelectInput
          label="Filter"
          value={value}
          onClearButtonClick={() => {
            setSelectedValue(undefined);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={status === 'latest-added'}
              title="Latest Added"
              value="latest-added"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={value === 'latest-invoice'}
              title="Latest Invoice"
              value="latest-invoice"
            />

            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={value === 'oldest-due-date'}
              title="Oldest Due Date"
              value="oldest-due-date"
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <FilterChipDatePicker label="Date" selectionType="range" />
    </FilterChipGroup>
  );
};

export default DropdownStoryMeta;
