/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Dropdown, DropdownOverlay, DropdownFooter, DropdownHeader } from '../../../Dropdown';
import type { DropdownProps } from '../../../Dropdown';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const getActiveDescendant = (selectInput: HTMLElement): string | null | undefined => {
  const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
  const activeDescendantElement = document.querySelector(`#${activeDescendantId}`);
  return activeDescendantElement?.textContent;
};

const BasicDropdown = ({
  items = ['Mumbai', 'Bengaluru', 'Pune'],
  ...props
}: DropdownProps & {
  items?: string[];
}): React.ReactElement => (
  <Dropdown {...props}>
    <AutoComplete label="City" />
    <DropdownOverlay zIndex={1002} testID="dropdown-overlay">
      <DropdownHeader title="Recent Searches" />
      <ActionList>
        {items.map((item) => (
          <ActionListItem key={item} title={item} value={item.toLowerCase()} />
        ))}
      </ActionList>
      <DropdownFooter>
        <Box>
          <Button isFullWidth>Apply</Button>
        </Box>
      </DropdownFooter>
    </DropdownOverlay>
  </Dropdown>
);

export const ItemSelect: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return <BasicDropdown {...props} />;
};

ItemSelect.play = async () => {
  const { getByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'City' });
  await userEvent.click(selectInput);
  await waitFor(() => expect(getByRole('option', { name: 'Bengaluru' })).toBeVisible());
  await userEvent.click(getByRole('option', { name: 'Bengaluru' }));
  await waitFor(() => expect(getByRole('combobox', { name: 'City' })).toHaveValue('Bengaluru'));
};

export const ItemSort: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return <BasicDropdown {...props} />;
};

ItemSort.play = async () => {
  const { getByRole, queryByRole } = within(document.body);
  const autoComplete = getByRole('combobox', { name: 'City' });
  await userEvent.type(autoComplete, 'p');
  const bengaluruOption = queryByRole('option', { name: 'Bengaluru' });
  await waitFor(() => expect(bengaluruOption).not.toBeInTheDocument());
  const puneOption = getByRole('option', { name: 'Pune' });
  await waitFor(() => expect(puneOption).toBeVisible());
  await userEvent.click(puneOption);
  await waitFor(() => expect(getByRole('combobox', { name: 'City' })).toHaveValue('Pune'));
};

export const ItemMultiSelect: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return <BasicDropdown {...props} selectionType="multiple" />;
};

ItemMultiSelect.play = async () => {
  const { getByRole, getByLabelText, queryByLabelText } = within(document.body);
  const autoComplete = getByRole('combobox', { name: 'City' });
  await userEvent.type(autoComplete, 'b');
  await expect(queryByLabelText('Close Bengaluru tag')).toBeFalsy();
  await userEvent.click(getByRole('option', { name: 'Bengaluru' }));
  await userEvent.type(autoComplete, 'p');
  await userEvent.click(getByRole('option', { name: 'Pune' }));
  await expect(getByLabelText('Close Bengaluru tag')).toBeInTheDocument();
  await expect(getByLabelText('Close Pune tag')).toBeInTheDocument();
  await expect(queryByLabelText('Close Mumbai tag')).toBeFalsy();
  await userEvent.keyboard('{Backspace}');
  await expect(queryByLabelText('Close Pune tag')).toBeFalsy();
  await expect(getByLabelText('Close Bengaluru tag')).toBeInTheDocument();
};

export const Accessibility: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return (
    <BasicDropdown
      {...props}
      items={[
        'Mumbai',
        'Bengaluru',
        'Pune',
        'Delhi',
        'Hyderabad',
        'Chennai',
        'Kolkata',
        'Ahmedabad',
        'Jaipur',
        'Lucknow',
        'Kanpur',
        'Nagpur',
        'Patna',
      ]}
    />
  );
};

Accessibility.play = async () => {
  const { getByRole, getByTestId } = within(document.body);
  const autoComplete = getByRole('combobox', { name: 'City' });
  await userEvent.type(autoComplete, 'i');

  // keep 1st item as active
  await waitFor(() => expect(getActiveDescendant(autoComplete)).toBe('Mumbai'));

  // move to 2nd item
  await userEvent.keyboard('{ArrowDown}');
  await expect(getActiveDescendant(autoComplete)).toBe('Delhi');

  // move to 3rd item
  await userEvent.keyboard('{ArrowDown}');
  await expect(getActiveDescendant(autoComplete)).toBe('Chennai');

  // select item
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(getByRole('combobox', { name: 'City' })).toHaveValue('Chennai'));
  await waitFor(() => expect(getByTestId('dropdown-overlay')).not.toBeVisible());

  // close dropdown
  await userEvent.keyboard('{ArrowDown}');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).toBeVisible());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).not.toBeVisible());

  // Input focus test
  await expect(autoComplete).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await expect(autoComplete).not.toHaveFocus();
};

export const ControlledDropdownSingleSelect: StoryFn<typeof Dropdown> = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();
  const [inputValue, setInputValue] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const setSelection = (value: string): void => {
    setCurrentSelection(value.toLowerCase());
    setInputValue(value);
  };

  return (
    <>
      <Button onClick={() => setSelection('Bangalore')}>Select Bangalore</Button>
      <Button marginX="spacing.4" variant="secondary" onClick={() => setSelection('')}>
        Clear Selection
      </Button>
      <Button
        variant="tertiary"
        onClick={() => {
          setIsDropdownOpen(true);
        }}
      >
        Open Dropdown
      </Button>
      <Dropdown
        isOpen={isDropdownOpen}
        onOpenChange={(isOpen) => {
          setIsDropdownOpen(isOpen);
        }}
        selectionType="single"
      >
        <AutoComplete
          label="Select City"
          value={currentSelection}
          onChange={(args) => {
            setCurrentSelection(args.values[0]);
          }}
          inputValue={inputValue}
          onInputValueChange={({ value }) => setInputValue(value ?? '')}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Chennai" value="chennai" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Text testID="input-value">{inputValue}</Text>
    </>
  );
};

ControlledDropdownSingleSelect.play = async () => {
  const { getByRole, getByTestId, findByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Select City' });

  // external button control selection test
  await userEvent.click(getByRole('button', { name: 'Select Bangalore' }));
  await waitFor(() => expect(selectInput).toHaveValue('Bangalore'));

  // select input's control test
  await userEvent.click(selectInput);
  await userEvent.click(await findByRole('option', { name: 'Pune' }));
  await waitFor(() => expect(selectInput).toHaveValue('Pune'));

  // input value change test
  await expect(getByTestId('input-value')).toHaveTextContent('Pune');
  await userEvent.type(selectInput, 'XYZ');
  await expect(getByTestId('input-value')).toHaveTextContent('PuneXYZ');

  // Clear button test
  await userEvent.click(getByRole('button', { name: 'Clear Selection' }));
  await waitFor(() => expect(selectInput).toHaveValue(''));

  // toggle dropdown test
  await userEvent.click(getByRole('button', { name: 'Open Dropdown' }));
  await waitFor(() => expect(getByRole('listbox', { name: 'Select City' })).toBeVisible());
};

export const ControlledDropdownMultiSelect: StoryFn<typeof Dropdown> = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => {
          if (!currentSelection.includes('bangalore')) {
            setCurrentSelection([...currentSelection, 'bangalore']);
          }
        }}
      >
        Select Bangalore
      </Button>
      <Button
        variant="secondary"
        marginLeft="spacing.4"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Open Dropdown
      </Button>

      <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen} selectionType="multiple">
        <AutoComplete
          label="Select City"
          value={currentSelection}
          onChange={(args) => {
            if (args) {
              setCurrentSelection(args.values);
            }
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Chennai" value="chennai" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </>
  );
};

ControlledDropdownMultiSelect.play = async () => {
  const { getByRole, queryAllByLabelText, findByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Select City' });

  // Select 1 item controlled
  await expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeFalsy();
  await userEvent.click(getByRole('button', { name: 'Select Bangalore' }));
  await waitFor(() => expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument());

  // select 2nd item from actionlist
  await userEvent.click(selectInput);
  await userEvent.click(await findByRole('option', { name: 'Pune' }));
  await waitFor(() => expect(queryAllByLabelText('Close Pune tag')?.[0]).toBeInTheDocument());
  await expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

  await userEvent.type(selectInput, 'c');
  await waitFor(() => expect(getActiveDescendant(selectInput)).toBe('Chennai'));
  await userEvent.click(getByRole('option', { name: 'Chennai' }));
  await waitFor(() => expect(queryAllByLabelText('Close Chennai tag')?.[0]).toBeInTheDocument());

  // dropdown open test
  await userEvent.click(getByRole('button', { name: 'Open Dropdown' }));
  await waitFor(() => expect(getByRole('listbox', { name: 'Select City' })).toBeVisible());
};

const filteredMap = [
  {
    title: 'Mumbai',
    value: 'mumbai',
    keywords: ['maharashtra'],
  },
  {
    title: 'Pune',
    value: 'pune',
    keywords: ['maharashtra'],
  },
  {
    title: 'Bengaluru',
    value: 'bengaluru',
    keywords: ['karnataka', 'bangalore'],
  },
];

export const ControlledFiltering: StoryFn<typeof Dropdown> = (): React.ReactElement => {
  const cityValues = filteredMap.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
    <Dropdown selectionType="multiple">
      <AutoComplete
        label="Cities"
        onInputValueChange={({ value }) => {
          if (value) {
            const filteredItems = filteredMap
              .filter(
                (city) =>
                  city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                  city.keywords.find((keyword) =>
                    keyword.toLowerCase().includes(value.toLowerCase()),
                  ),
              )
              .map((city) => city.value);

            if (filteredItems.length > 0) {
              setFilteredValues(filteredItems);
            } else {
              setFilteredValues([]);
            }
          } else {
            setFilteredValues(cityValues);
          }
        }}
        filteredValues={filteredValues}
        helpText="Try typing 'maharashtra' in input"
      />
      {filteredValues.length > 0 ? (
        <DropdownOverlay>
          <ActionList>
            {filteredMap.map((city) => (
              <ActionListItem key={city.value} title={city.title} value={city.value} />
            ))}
          </ActionList>
        </DropdownOverlay>
      ) : null}
    </Dropdown>
  );
};

ControlledFiltering.play = async () => {
  const { getByRole, queryByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Cities' });

  await userEvent.click(selectInput);
  await waitFor(() => expect(getByRole('listbox', { name: 'Cities' })).toBeVisible());
  await expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();
  await expect(getByRole('option', { name: 'Pune' })).toBeVisible();
  await expect(getByRole('option', { name: 'Bengaluru' })).toBeVisible();

  // typing maharashtra should filter mumbai and pune and remove other options
  await userEvent.keyboard('maha');

  await expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();
  await expect(getByRole('option', { name: 'Pune' })).toBeVisible();
  await expect(queryByRole('option', { name: 'Bengaluru' })).not.toBeInTheDocument();

  await expect(getByRole('option', { name: 'Pune' })).toHaveAttribute('aria-selected', 'false');
  await userEvent.click(getByRole('option', { name: 'Pune' }));
  await expect(getByRole('option', { name: 'Pune' })).toHaveAttribute('aria-selected', 'true');
};

export default {
  title: 'Components/Interaction Tests/AutoComplete',
  component: AutoComplete,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
