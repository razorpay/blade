import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownLink, DropdownOverlay } from '../index';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

describe('<Dropdown />', () => {
  it('should render dropdown', () => {
    const { toJSON } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Button>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should show the dropdown on click', () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Select Fruit" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    fireEvent.press(getByRole('combobox'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
  });

  it('should click and select item', () => {
    const selectOnChange = jest.fn();

    const { getByRole, getByTestId, getAllByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput name="fruits" label="Select Fruit" onChange={selectOnChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Click on combobox
    fireEvent.press(getByRole('combobox'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
    expect(selectOnChange).not.toBeCalled();
    expect(getByRole('combobox')).toHaveTextContent('Select Option');

    // Click on item
    fireEvent.press(getAllByRole('menuitem')[1]);
    expect(selectOnChange).toBeCalledWith({ name: 'fruits', values: ['apple'] });
    expect(getByRole('combobox')).toHaveTextContent('Apple');
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
  });

  it('should be able to select multiple items with multiselect', () => {
    const selectOnChangeHandler = jest.fn();
    const applyClickHandler = jest.fn();

    const { getByRole, getByTestId, getAllByRole, getByLabelText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput name="fruits" label="Select Fruit" onChange={selectOnChangeHandler} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Banana" value="banana" />
          </ActionList>
          <DropdownFooter>
            <Button onClick={applyClickHandler}>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Click on combobox
    fireEvent.press(getByRole('combobox'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
    expect(selectOnChangeHandler).not.toBeCalled();
    expect(getByRole('combobox')).toHaveTextContent('Select Option');

    // Click on item
    fireEvent.press(getAllByRole('menuitem')[1]);
    expect(selectOnChangeHandler).toBeCalledWith({ name: 'fruits', values: ['apple'] });
    expect(getByLabelText('Close Apple tag')).toBeOnTheScreen();

    // Click another item
    fireEvent.press(getAllByRole('menuitem')[2]);
    expect(selectOnChangeHandler).toBeCalledWith({ name: 'fruits', values: ['apple', 'banana'] });
    expect(getByLabelText('Close Apple tag')).toBeOnTheScreen();
    expect(getByLabelText('Close Banana tag')).toBeOnTheScreen();

    // Ensure overlay is still visible
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');

    // Apply button click
    fireEvent.press(getByRole('button', { name: 'Apply' }));
    expect(applyClickHandler).toBeCalled();

    // Click outside
    fireEvent.press(getByTestId('closeable-area'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
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

    expect(getByTestId('select-test')).toBeTruthy();
    expect(getByTestId('dropdown-overlay-test')).toBeTruthy();
    expect(getByTestId('action-list-test')).toBeTruthy();
    expect(getByTestId('action-list-header-test')).toBeTruthy();
    expect(getByTestId('action-list-item-test')).toBeTruthy();
    expect(getByTestId('action-list-footer-test')).toBeTruthy();
  });

  it('should handle controlled props with single select', () => {
    const ControlledDropdown = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();
      const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setCurrentSelection('bangalore')}>Select Bangalore</Button>
          <Button onClick={() => setCurrentSelection('')}>Clear Selection</Button>
          <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Toggle Dropdown</Button>
          <Dropdown selectionType="single" isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
                <ActionListItem title="Pune" value="pune" testID="pune-option" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText, getByTestId } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox');
    expect(selectInput).toHaveTextContent('Select Option');
    fireEvent.press(getByText('Select Bangalore'));
    expect(selectInput).toHaveTextContent('Bangalore');

    fireEvent.press(selectInput);
    fireEvent.press(getByText('Pune'));
    expect(selectInput).toHaveTextContent('Pune');

    fireEvent.press(getByText('Clear Selection'));
    expect(selectInput).toHaveTextContent('Select Option');

    fireEvent.press(getByRole('button', { name: 'Toggle Dropdown' }));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
    fireEvent.press(getByRole('button', { name: 'Toggle Dropdown' }));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
  });

  it('should handle controlled props with multi select', () => {
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
                <ActionListItem title="Bangalore" value="bangalore" />
                <ActionListItem title="Pune" value="pune" testID="pune-option" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText, getByLabelText, getByTestId, queryByLabelText } = renderWithTheme(
      <ControlledDropdown />,
    );

    const selectInput = getByRole('combobox', { name: 'Select Option' });
    expect(queryByLabelText('Close Bangalore tag')).not.toBeOnTheScreen();
    fireEvent.press(getByRole('button', { name: 'Select Bangalore' }));
    expect(getByLabelText('Close Bangalore tag')).toBeOnTheScreen();

    fireEvent.press(selectInput);
    fireEvent.press(getByText('Pune'));
    expect(getByLabelText('Close Bangalore tag')).toBeOnTheScreen();
    expect(getByLabelText('Close Pune tag')).toBeOnTheScreen();

    fireEvent.press(getByText('Select Bangalore'));
    expect(getByLabelText('Close Bangalore tag')).toBeOnTheScreen();
    expect(getByLabelText('Close Pune tag')).toBeOnTheScreen();

    fireEvent.press(getByRole('button', { name: 'Toggle Dropdown' }));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    fireEvent.press(getByRole('button', { name: 'Toggle Dropdown' }));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
  });
});

describe('<Dropdown /> with <DropdownButton />', () => {
  it('should click and select item', () => {
    const profileClickHandler = jest.fn();

    const { getByTestId, getByText } = renderWithTheme(
      <Dropdown>
        <DropdownButton>My Account</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Profile" value="profile" onClick={profileClickHandler} />
            <ActionListItem title="Settings" value="settings" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Click on combobox
    fireEvent.press(getByText('My Account'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');

    // Click on item
    fireEvent.press(getByText('Profile'));
    expect(profileClickHandler).toBeCalled();
  });

  it('should handle controlled selections', () => {
    const ControlledDropdownMenu = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Text testID="current-selection-text">{currentSelection}</Text>
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

    const { getByTestId, getByText } = renderWithTheme(<ControlledDropdownMenu />);

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Click on combobox
    fireEvent.press(getByText('My Account'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');

    // Click on item
    fireEvent.press(getByText('Profile'));
    expect(getByTestId('current-selection-text')).toHaveTextContent('profile');
  });

  it('should handle controlled selections in DropdownLink', () => {
    const ControlledDropdownMenu = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string | undefined>(undefined);
      return (
        <>
          <Text testID="current-selection-text">{currentSelection}</Text>
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

    const { getByTestId, getByText } = renderWithTheme(<ControlledDropdownMenu />);

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Click on combobox
    fireEvent.press(getByText('My Account'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');

    // Click on item
    fireEvent.press(getByText('Profile'));
    expect(getByTestId('current-selection-text')).toHaveTextContent('profile');
  });
});
