import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay } from '..';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

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
            title="Latest Added"
            value="latest-added"
          />
          <ActionListItem
            onClick={({ name }) => {
              handleOnClick(name);
            }}
            title="Latest Invoice"
            value="latest-invoice"
          />

          <ActionListItem
            onClick={({ name }) => {
              handleOnClick(name);
            }}
            title="Oldest Due Date"
            value="oldest-due-date"
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const UncontrolledFilterChipSelectInput = (): React.ReactElement => {
  return (
    <Box>
      <Text size="small" weight="semibold" color="interactive.text.primary.normal">
        Uncontrolled Filter Chip Select Input - Single
      </Text>
      <Dropdown selectionType="single">
        <FilterChipSelectInput
          label="Filter Chip"
          onChange={(value) => {
            console.log('value', value);
          }}
          onClearButtonClick={(value) => {
            console.log('value', value);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Latest Added" value="latest-added" />
            <ActionListItem title="Latest Invoice" value="latest-invoice" />
            <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Text size="small" weight="semibold" color="interactive.text.primary.normal">
        Uncontrolled Filter Chip Select Input - Multiple
      </Text>
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput
          label="Filter Chip"
          onChange={(value) => {
            console.log('value', value);
          }}
          onClearButtonClick={(value) => {
            console.log('value', value);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Latest Added" value="latest-added" />
            <ActionListItem title="Latest Invoice" value="latest-invoice" />
            <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const FilterChipSelectInputControlled = (): React.ReactElement => {
  const [singleFilterChipSelectInputValue, setSingleFilterChipSelectInputValue] = React.useState<
    string | undefined
  >('latest-added');
  const [
    multipleFilterChipSelectInputValue,
    setMultipleFilterChipSelectInputValue,
  ] = React.useState<string[]>(['latest-added', 'latest-invoice']);

  return (
    <Box>
      <Text size="small" weight="semibold" color="interactive.text.primary.normal">
        Controlled Filter Chip Select Input - Single
      </Text>
      <Dropdown selectionType="single">
        <FilterChipSelectInput
          label="Filter Chip"
          value={singleFilterChipSelectInputValue}
          onChange={({ values }) => {
            setSingleFilterChipSelectInputValue(values[0]);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Latest Added" value="latest-added" />
            <ActionListItem title="Latest Invoice" value="latest-invoice" />

            <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Text> Controlled Filter Chip Select Input - Multiple </Text>
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput
          label="Filter Chip"
          value={multipleFilterChipSelectInputValue}
          onClearButtonClick={() => {
            setMultipleFilterChipSelectInputValue([]);
          }}
          onChange={({ values }) => {
            setMultipleFilterChipSelectInputValue(values);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Latest Added" value="latest-added" />
            <ActionListItem title="Latest Invoice" value="latest-invoice" />
            <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const FilterChipSelectInputDisabled = (): React.ReactElement => {
  return (
    <Dropdown selectionType="single">
      <FilterChipSelectInput label="Filter Chip" isDisabled />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Latest Added" value="latest-added" />
          <ActionListItem title="Latest Invoice" value="latest-invoice" />
          <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
