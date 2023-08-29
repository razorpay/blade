import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor, act } from '@testing-library/react';
import { Dropdown, DropdownLink, DropdownOverlay } from '../index';
import { DropdownButton } from '../DropdownButton';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

const getActiveDescendant = (
  selectInput: HTMLElement,
  container: HTMLElement,
): string | null | undefined => {
  const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
  const activeDescendantElement = container.querySelector(`#${activeDescendantId}`);
  return activeDescendantElement?.textContent;
};

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', async () => {
    const user = userEvent.setup();

    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay zIndex={1002}>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Box>
              <Button isFullWidth>Apply</Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByRole('dialog')).toBeNull();
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible());
    expect(container).toMatchSnapshot();
  });

  // MOUSE CLICK TESTS
  it('should select item with mouse clicks', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Banana" value="banana" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(selectInput.textContent).toBe('Select Option');
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());
    await user.click(getByRole('option', { name: 'Orange' }));
    await waitFor(() => expect(queryByRole('listbox')).toBeNull());
    expect(selectInput.textContent).toBe('Orange');
  });

  it('should trigger focus and blur events for SelectInput', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { getByRole } = renderWithTheme(
      <>
        <Dropdown>
          <SelectInput name="dropdown-select" label="Fruits" onFocus={onFocus} onBlur={onBlur} />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Banana" value="banana" />
              <ActionListItem title="Orange" value="orange" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Button>Outer Button</Button>
      </>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    await user.click(selectInput);
    expect(onFocus).toHaveBeenCalledWith({ name: 'dropdown-select', value: '' });
    await user.click(getByRole('option', { name: 'Orange' }));
    await user.click(getByRole('button', { name: 'Outer Button' })); // Focusing on outer button to blur the select input
    expect(onBlur).toHaveBeenCalledWith({ name: 'dropdown-select', value: 'orange' });
  });

  it('should handle accessibility of multiselect', async () => {
    const user = userEvent.setup();
    const { queryByRole, getByRole, queryAllByLabelText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="mingo" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('false');

    await user.click(getByRole('option', { name: 'Apple' }));
    expect(queryAllByLabelText('Close Apple tag')?.[0]).toBeInTheDocument();
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('true');

    await user.click(getByRole('option', { name: 'Mango' }));
    expect(queryAllByLabelText('Close Apple tag')?.[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Mango tag')?.[0]).toBeInTheDocument();
    expect(getByRole('option', { name: 'Mango' }).getAttribute('aria-selected')).toBe('true');
  });

  // KEYBOARD ACCESSIBILITY TESTS
  it('should close with escape', async () => {
    const user = userEvent.setup();

    const { queryByRole, getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(queryByRole('listbox', { name: 'Fruits' })).toBeNull());
  });

  it('should move focus between items with arrow key', async () => {
    const user = userEvent.setup();
    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Orange" value="orange" />
            <ActionListItem title="Banana" value="banana" />
            <ActionListItem title="Guava" value="guava" />
            <ActionListItem title="Watermelon" value="watermelon" />
            <ActionListItem title="Strawberry" value="strawberry" />
            <ActionListItem title="Green Apple" value="green-apple" />
            <ActionListItem title="Peach" value="peach" />
            <ActionListItem title="Pineapple" value="pineapple" />
            <ActionListItem title="Grape" value="grape" />
            <ActionListItem title="Cherry" value="cherry" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(selectInput.textContent).toBe('Select Option');
    expect(queryByRole('listbox')).toBeNull();

    // Dropdown open
    await act(() => selectInput.focus());
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Apple');

    // Move to second item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Mango');

    // Pressing 'Home' should jump us to first item
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Home}');
    expect(getActiveDescendant(selectInput, container)).toBe('Apple');

    // PageDown press should jump us 10 items ahead
    await user.keyboard('{PageDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Grape');

    // PageUp press should jump us 10 items back
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{PageUp}');
    expect(getActiveDescendant(selectInput, container)).toBe('Mango');

    // 'End' should jump us to last item
    await user.keyboard('{End}');
    expect(getActiveDescendant(selectInput, container)).toBe('Cherry');

    // Select option
    await user.keyboard('[Space]');
    expect(selectInput.textContent).toBe('Cherry');
  });

  it('should move focus between items with arrow key in multiselect', async () => {
    const user = userEvent.setup();
    const { container, getByRole, queryByRole, queryAllByLabelText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(selectInput.textContent).toBe('Select Option');
    expect(queryByRole('listbox')).toBeNull();

    // Dropdown open
    await act(() => selectInput.focus());
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Apple');

    // Move to second item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Mango');
    await user.keyboard('[Space]');

    expect(queryAllByLabelText('Close Mango tag')?.[0]).toBeInTheDocument();

    // Ensure menu did not close
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to third item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Orange');
    await user.keyboard('[Space]');

    expect(queryAllByLabelText('Close Mango tag')?.[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Orange tag')?.[0]).toBeInTheDocument();
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('false');
    expect(getByRole('option', { name: 'Mango' }).getAttribute('aria-selected')).toBe('true');
    expect(getByRole('option', { name: 'Orange' }).getAttribute('aria-selected')).toBe('true');
  });

  it('should work with type ahead', async () => {
    const user = userEvent.setup();
    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(selectInput.textContent).toBe('Select Option');
    expect(queryByRole('listbox')).toBeNull();

    // Dropdown Open and Jump to option starting with "M"
    await act(() => selectInput.focus());
    await user.keyboard('m');
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());

    // Jump to option starting with "Ma"
    await user.keyboard('a');
    const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
    const activeDescendantElement = container.querySelector(`#${activeDescendantId}`);
    expect(activeDescendantElement?.textContent).toBe('Mango');
    expect(activeDescendantElement).toHaveClass('active-focus');

    // Select active option
    await user.keyboard('{Enter}');
    expect(selectInput.textContent).toBe('Mango');
    expect(getByRole('option', { name: 'Mango' }).getAttribute('aria-selected')).toBe('true');
  });

  it('should move focus away on TAB', async () => {
    const user = userEvent.setup();
    const { queryByRole, getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mingo" value="mingo" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());

    await user.keyboard('{ArrowDown}');
    expect(selectInput).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(selectInput).not.toHaveFocus();
  });

  it('should move focus to footer button', async () => {
    const user = userEvent.setup();
    const applyClickHandler = jest.fn();
    const { queryByRole, getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mingo" value="mingo" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Button onClick={applyClickHandler}>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('dialot')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible());

    // Check focus
    await user.keyboard('{ArrowDown}');
    expect(selectInput).toHaveFocus();

    // Move focus to footer button
    await user.keyboard('{Tab}');
    expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible();
    expect(getByRole('button', { name: 'Apply' })).toHaveFocus();

    // Press footer button
    await user.keyboard('{Enter}');
    expect(applyClickHandler).toBeCalledTimes(1);
  });

  it('should handle controlled props with single select', async () => {
    const ControlledDropdown = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();

      return (
        <>
          <Button onClick={() => setCurrentSelection('bangalore')}>Select Bangalore</Button>
          <Button onClick={() => setCurrentSelection('')}>Clear Selection</Button>
          <Dropdown selectionType="single">
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

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox', { name: 'Select City' });
    expect(selectInput).toHaveTextContent('Select Option');
    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(selectInput).toHaveTextContent('Bangalore');

    await user.click(selectInput);
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(selectInput).toHaveTextContent('Pune');

    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(selectInput).toHaveTextContent('Bangalore');

    await user.click(getByRole('button', { name: 'Clear Selection' }));
    expect(selectInput).toHaveTextContent('Select Option');
  });

  it('should handle controlled props with multi select', async () => {
    const ControlledDropdown = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);

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
          <Dropdown selectionType="multiple">
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

    const user = userEvent.setup();
    const { getByRole, queryAllByLabelText } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox', { name: 'Select City' });
    expect(selectInput).toHaveTextContent('Select Option');
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeFalsy();
    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

    await user.click(selectInput);
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(queryAllByLabelText('Close Pune tag')?.[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Select Bangalore' }));
  });

  it('should accept testID', async () => {
    const { getByTestId, getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" testID="select-test" />
        <DropdownOverlay testID="dropdown-overlay-test">
          <DropdownHeader title="Recent Searches" testID="action-list-header-test" />
          <ActionList testID="action-list-test">
            <ActionListItem title="Apple" value="apple" testID="action-list-item-test" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter testID="action-list-footer-test">
            <Button>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );
    const user = userEvent.setup();

    const selectInput = getByRole('combobox', { name: 'Fruits' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    expect(getByTestId('dropdown-overlay-test')).toBeTruthy();
    expect(getByTestId('action-list-test')).toBeTruthy();
    expect(getByTestId('action-list-header-test')).toBeTruthy();
    expect(getByTestId('action-list-item-test')).toBeTruthy();
    expect(getByTestId('action-list-footer-test')).toBeTruthy();
  });
});

describe('<Dropdown /> with <DropdownButton />', () => {
  it('should render menu and make items clickable', async () => {
    const user = userEvent.setup();
    const profileClickHandler = jest.fn();

    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton>My Account</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Profile" value="profile" onClick={profileClickHandler} />
            <ActionListItem title="Settings" value="settings" href="/settings" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const dropdownTrigger = getByRole('button', { name: 'My Account' });

    expect(dropdownTrigger).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByRole('menu')).toBeNull();
    await user.click(dropdownTrigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(profileClickHandler).not.toBeCalled();
    await user.click(getByRole('menuitem', { name: 'Profile' }));
    expect(profileClickHandler).toBeCalled();
    expect(getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
    expect(getByRole('link', { name: 'Settings' }).tagName).toBe('A');
    expect(container).toMatchSnapshot();
  });

  it('should handle controlled selection in menu', async () => {
    const user = userEvent.setup();

    const ControlledDropdownMenu = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Text>selection: {currentSelection}</Text>
          <Dropdown>
            <DropdownButton>My Account</DropdownButton>
            <DropdownOverlay>
              <ActionList>
                <ActionListItem
                  isSelected={currentSelection === 'profile'}
                  onClick={() => setCurrentSelection('profile')}
                  title="Profile"
                  value="profile"
                />
                <ActionListItem
                  isSelected={currentSelection === 'settings'}
                  onClick={() => setCurrentSelection('settings')}
                  title="Settings"
                  value="settings"
                />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText } = renderWithTheme(<ControlledDropdownMenu />);

    await user.click(getByRole('button', { name: 'My Account' }));
    await user.click(getByRole('menuitem', { name: 'Settings' }));
    expect(getByText('selection: settings')).toBeInTheDocument();
  });

  it('should handle controlled selection in link trigger menu', async () => {
    const user = userEvent.setup();

    const ControlledDropdownMenu = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Text>selection: {currentSelection}</Text>
          <Dropdown>
            <DropdownLink>My Account</DropdownLink>
            <DropdownOverlay>
              <ActionList>
                <ActionListItem
                  isSelected={currentSelection === 'profile'}
                  onClick={() => setCurrentSelection('profile')}
                  title="Profile"
                  value="profile"
                />
                <ActionListItem
                  isSelected={currentSelection === 'settings'}
                  onClick={() => setCurrentSelection('settings')}
                  title="Settings"
                  value="settings"
                />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText } = renderWithTheme(<ControlledDropdownMenu />);

    await user.click(getByRole('button', { name: 'My Account' }));
    await user.click(getByRole('menuitem', { name: 'Settings' }));
    expect(getByText('selection: settings')).toBeInTheDocument();
  });

  it('should render menu and allow keyboard navigations', async () => {
    const user = userEvent.setup();
    const profileClickHandler = jest.fn();

    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton>My Account</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Profile" value="profile" onClick={profileClickHandler} />
            <ActionListItem title="Settings" value="settings" href="/settings" target="_blank" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const dropdownTrigger = getByRole('button', { name: 'My Account' });

    expect(dropdownTrigger).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByRole('menu')).toBeNull();

    dropdownTrigger.focus();
    await user.keyboard('{ArrowDown}');

    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(profileClickHandler).not.toBeCalled();

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(dropdownTrigger, container)).toBe('Profile');
    await user.keyboard('[Space]');
    expect(profileClickHandler).toBeCalled();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(dropdownTrigger, container)).toBe('Settings');
    window.open = jest.fn();
    await user.keyboard('[Space]');
    expect(window.open).toBeCalledWith('/settings', '_blank');
  });
});
