/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { StoryFn } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Dropdown, DropdownOverlay, DropdownFooter } from '../';
import type { DropdownProps } from '../';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';

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
    <SelectInput label="City" />
    <DropdownOverlay testID="dropdown-overlay">
      <ActionList>
        {items.map((item) => (
          <ActionListItem key={item} title={item} value={item.toLowerCase()} />
        ))}
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
);

export const BasicSelectItem: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return <BasicDropdown {...props} />;
};

BasicSelectItem.play = async () => {
  const { getByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'City' });
  await userEvent.click(selectInput);
  const option = getByRole('option', { name: 'Bengaluru' });
  await userEvent.click(option);
  await expect(getByRole('combobox', { name: 'City' })).toHaveTextContent('Bengaluru');
};

export const MultiSelectItem: StoryFn<typeof Dropdown> = (props): React.ReactElement => {
  return <BasicDropdown {...props} selectionType="multiple" />;
};

MultiSelectItem.play = async () => {
  const { getByRole, getByLabelText, queryByLabelText } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'City' });
  await userEvent.click(selectInput);
  await expect(queryByLabelText('Close Bengaluru tag')).toBeFalsy();
  await userEvent.click(getByRole('option', { name: 'Bengaluru' }));
  await userEvent.click(getByRole('option', { name: 'Pune' }));
  await expect(getByLabelText('Close Bengaluru tag')).toBeInTheDocument();
  await expect(getByLabelText('Close Pune tag')).toBeInTheDocument();
  await expect(queryByLabelText('Close Mumbai tag')).toBeFalsy();
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
  const selectInput = getByRole('combobox', { name: 'City' });
  selectInput.focus();
  await userEvent.keyboard('{ArrowDown}');

  // move to 1st item
  await userEvent.keyboard('{ArrowDown}');
  await expect(getActiveDescendant(selectInput)).toBe('Mumbai');

  // move to 2nd item
  await userEvent.keyboard('{ArrowDown}');
  await expect(getActiveDescendant(selectInput)).toBe('Bengaluru');

  // move to 1st item
  await userEvent.keyboard('{Home}');
  await expect(getActiveDescendant(selectInput)).toBe('Mumbai');

  // move 10 items down or to last item
  await userEvent.keyboard('{PageDown}');
  await expect(getActiveDescendant(selectInput)).toBe('Kanpur');
  await userEvent.keyboard('{PageDown}');
  await expect(getActiveDescendant(selectInput)).toBe('Patna');

  // move 10 items up
  await userEvent.keyboard('{PageUp}');
  await expect(getActiveDescendant(selectInput)).toBe('Pune');

  // Move to last item
  await userEvent.keyboard('{End}');
  await expect(getActiveDescendant(selectInput)).toBe('Patna');

  // [TypeAhead tests] Move to item starting with "P"
  await userEvent.keyboard('p');
  await expect(getActiveDescendant(selectInput)).toBe('Pune');
  await userEvent.keyboard('a');
  await expect(getActiveDescendant(selectInput)).toBe('Patna');

  // select item
  await userEvent.keyboard('{Enter}');
  await expect(getByRole('combobox', { name: 'City' })).toHaveTextContent('Patna');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).not.toBeVisible());

  // close dropdown
  await userEvent.keyboard('{ArrowDown}');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).toBeVisible());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).not.toBeVisible());

  // Input focus test
  await expect(selectInput).toHaveFocus();
  await userEvent.keyboard('{TAB}');
  await expect(selectInput).not.toHaveFocus();
};

export const FooterActions: StoryFn<typeof Dropdown> = (): React.ReactElement => {
  const [hasApplied, setHasApplied] = React.useState(false);
  return (
    <Dropdown>
      <SelectInput label="Fruits" />
      <DropdownOverlay testID="dropdown-overlay">
        <ActionList>
          <ActionListItem title="Apple" value="apple" />
          <ActionListItem title="Mango" value="mango" />
        </ActionList>
        <DropdownFooter>
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <Button onClick={() => setHasApplied(true)}>{hasApplied ? 'Applied' : 'Apply'}</Button>
          <Button marginLeft="spacing.4" variant="secondary" onClick={() => setHasApplied(false)}>
            Cancel
          </Button>
        </DropdownFooter>
      </DropdownOverlay>
    </Dropdown>
  );
};

FooterActions.play = async () => {
  const { getByRole, queryByRole, getByTestId } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Fruits' });
  await userEvent.click(selectInput);
  await waitFor(() => expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible());
  await userEvent.keyboard('{ArrowDown}');
  // virtual focus on first item, actual focus on select
  await expect(getActiveDescendant(selectInput)).toBe('Apple');
  await expect(selectInput).toHaveFocus();

  // move focus to next interactive item in footer without closing the dropdown
  await userEvent.keyboard('{TAB}');
  await expect(getByRole('button', { name: 'Apply' })).toHaveFocus();
  await expect(queryByRole('button', { name: 'Applied' })).toBeFalsy();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(getByRole('button', { name: 'Applied' })).toBeInTheDocument());

  await userEvent.keyboard('{TAB}');
  await expect(getByRole('button', { name: 'Cancel' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(getByTestId('dropdown-overlay')).not.toBeVisible());
};

export const ControlledDropdownSingleSelect: StoryFn<typeof Dropdown> = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setCurrentSelection('bangalore')}>Select Bangalore</Button>
      <Button marginX="spacing.4" variant="secondary" onClick={() => setCurrentSelection('')}>
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
        <SelectInput
          label="Select City"
          value={currentSelection}
          onChange={(args) => {
            setCurrentSelection(args.values[0]);
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

ControlledDropdownSingleSelect.play = async () => {
  const { getByRole } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Select City' });

  // external button control selection test
  await expect(selectInput).toHaveTextContent('Select Option');
  await userEvent.click(getByRole('button', { name: 'Select Bangalore' }));
  await waitFor(() => expect(selectInput).toHaveTextContent('Bangalore'));

  // select input's control test
  await userEvent.click(selectInput);
  await userEvent.click(getByRole('option', { name: 'Pune' }));
  await waitFor(() => expect(selectInput).toHaveTextContent('Pune'));

  // Clear button test
  await userEvent.click(getByRole('button', { name: 'Clear Selection' }));
  await waitFor(() => expect(selectInput).toHaveTextContent('Select Option'));

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
      <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Open Dropdown</Button>

      <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen} selectionType="multiple">
        <SelectInput
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
  const { getByRole, queryAllByLabelText } = within(document.body);
  const selectInput = getByRole('combobox', { name: 'Select City' });

  // Select 1 item programatically
  await expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeFalsy();
  await userEvent.click(getByRole('button', { name: 'Select Bangalore' }));
  await waitFor(() => expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument());

  // select 2nd item from actionlist
  await userEvent.click(selectInput);
  await userEvent.click(getByRole('option', { name: 'Pune' }));
  await waitFor(() => expect(queryAllByLabelText('Close Pune tag')?.[0]).toBeInTheDocument());
  await expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

  // dropdown open test
  await userEvent.click(getByRole('button', { name: 'Open Dropdown' }));
  await waitFor(() => expect(getByRole('listbox', { name: 'Select City' })).toBeVisible());
};

export default {
  title: 'Components/Interaction Tests/Dropdown',
  component: Dropdown,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
