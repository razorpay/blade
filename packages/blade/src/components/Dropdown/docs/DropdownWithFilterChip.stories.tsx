import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay } from '..';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Filter Chip',
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
  );
};

export const SelectionTypeMultiple = (): React.ReactElement => {
  const [value, setSelectedValue] = React.useState<string[]>([]);
  const handleOnClick = (name: string): void => {
    if (value.includes(name)) {
      setSelectedValue(value.filter((val) => val !== name));
    } else {
      setSelectedValue([...value, name]);
    }
  };
  const isSelected = (name: string): boolean => value.includes(name);
  return (
    <Dropdown selectionType="multiple">
      <FilterChipSelectInput
        label="Filter Chip"
        value={value}
        onClearButtonClick={(value) => {
          console.log('value', value);
          setSelectedValue([]);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem
            onClick={({ name }) => {
              handleOnClick(name);
            }}
            isSelected={isSelected('latest-added')}
            title="Latest Added"
            value="latest-added"
          />
          <ActionListItem
            onClick={({ name }) => {
              handleOnClick(name);
            }}
            isSelected={isSelected('latest-invoice')}
            title="Latest Invoice"
            value="latest-invoice"
          />

          <ActionListItem
            onClick={({ name }) => {
              handleOnClick(name);
            }}
            isSelected={isSelected('oldest-due-date')}
            title="Oldest Due Date"
            value="oldest-due-date"
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
