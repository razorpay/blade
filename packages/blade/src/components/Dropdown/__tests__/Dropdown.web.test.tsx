import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownLink, DropdownOverlay } from '../index';
import { DropdownButton } from '../DropdownButton';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

const getActiveDescendant = (selectInput: HTMLElement): string | null | undefined => {
  const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
  const activeDescendantElement = document.querySelector(`#${activeDescendantId}`);
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

  it('should render dropdown with large size select input', () => {
    const { container } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" size="large" />
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

    expect(container).toMatchSnapshot();
  });

  it('should not open dropdown when input is disabled', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" isDisabled />
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
    expect(queryByRole('listbox')).toBeNull();
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

  // Skipped because flaky
  // https://github.com/razorpay/blade/issues/1721
  it.skip('should handle controlled props & disabled options with multi select', async () => {
    const ControlledDropdown = (): React.ReactElement => {
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
          <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Toggle Dropdown</Button>

          <Dropdown
            isOpen={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            selectionType="multiple"
          >
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
                <ActionListItem title="Delhi" value="delhi" isDisabled />
                <ActionListItem title="Bangalore" value="bangalore" />
                <ActionListItem title="Pune" value="pune" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    // JSDOM doesn't calculate layouts so always return 0 https://github.com/testing-library/react-testing-library/issues/353#issuecomment-481248489
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });

    const user = userEvent.setup();
    const { getByRole, queryAllByLabelText, queryByRole } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox', { name: 'Select City' });
    expect(selectInput).toHaveTextContent('Select Option');
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeFalsy();
    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

    await user.click(selectInput);

    expect(getByRole('option', { name: 'Delhi' })).toHaveAttribute('aria-disabled', 'true');

    await user.click(getByRole('option', { name: 'Pune' }));
    expect(queryAllByLabelText('Close Pune tag')?.[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Bangalore tag')?.[0]).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Select Bangalore' }));

    await user.click(getByRole('button', { name: 'Toggle Dropdown' }));
    await waitFor(() => expect(getByRole('listbox', { name: 'Select City' })).toBeVisible());
    await user.click(getByRole('button', { name: 'Toggle Dropdown' }));
    await waitFor(() => expect(queryByRole('listbox', { name: 'Select City' })).not.toBeVisible());
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 0 });
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
  // Skipping this test because the id that `useId` generates seems to be different and flaky between local and CI.
  // Have to figure out solution to that and then enable this again.
  it.skip('should render menu', () => {
    const profileClickHandler = jest.fn();

    const { container } = renderWithTheme(
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

    expect(container).toMatchSnapshot();
  });

  it('should make items clickable', async () => {
    const user = userEvent.setup();
    const profileClickHandler = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
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

  it('should support data-analytics-attribute', async () => {
    const user = userEvent.setup();
    const profileClickHandler = jest.fn();

    const { container, getByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton data-analytics-attribute="profile" onClick={profileClickHandler}>
          My Account
        </DropdownButton>
        <DropdownOverlay>
          <ActionList data-analytics-list="user-setting">
            <ActionListItem data-analytics-item="user-profile" title="Profile" value="profile" />
            <ActionListItem title="Settings" value="settings" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const dropdownTrigger = getByRole('button', { name: 'My Account' });

    expect(dropdownTrigger).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    await user.click(dropdownTrigger);
    expect(getByRole('menuitem', { name: 'Profile' })).toHaveAttribute(
      'data-analytics-item',
      'user-profile',
    );
    await user.click(getByRole('menuitem', { name: 'Profile' }));
    expect(profileClickHandler).toBeCalled();
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

    const { getByRole, queryByRole } = renderWithTheme(
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
    expect(getActiveDescendant(dropdownTrigger)).toBe('Profile');
    await user.keyboard('[Space]');
    expect(profileClickHandler).toBeCalled();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(dropdownTrigger)).toBe('Settings');
    window.open = jest.fn();
    await user.keyboard('[Space]');
    expect(window.open).toBeCalledWith('/settings', '_blank');
  });
});
