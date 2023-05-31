import React from 'react';
// import { Button } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { SelectInput } from '~components/Input/SelectInput';
import {
  ActionList,
  ActionListItem,
  ActionListHeader,
  ActionListFooter,
  ActionListHeaderIcon,
  ActionListFooterIcon,
} from '~components/ActionList';
import { SearchIcon, HistoryIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

describe('<Dropdown />', () => {
  it('should render dropdown', () => {
    const { toJSON } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListHeader
              title="Recent Searches"
              leading={<ActionListHeaderIcon icon={HistoryIcon} />}
            />
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListFooter
              title="Search Tips"
              leading={<ActionListFooterIcon icon={SearchIcon} />}
              trailing={<Button>Apply</Button>}
            />
          </ActionList>
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

    const { getByRole, getByTestId, getAllByRole, getByText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput name="fruits" label="Select Fruit" onChange={selectOnChangeHandler} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Banana" value="banana" />
            <ActionListFooter
              title="Search Tips"
              leading={<ActionListFooterIcon icon={SearchIcon} />}
              trailing={<Button onClick={applyClickHandler}>Apply</Button>}
            />
          </ActionList>
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
    expect(getByRole('combobox')).toHaveTextContent('Apple');

    // Click another item
    fireEvent.press(getAllByRole('menuitem')[2]);
    expect(selectOnChangeHandler).toBeCalledWith({ name: 'fruits', values: ['apple', 'banana'] });
    expect(getByRole('combobox')).toHaveTextContent('2 items selected');

    // Ensure overlay is still visible
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
    // Click outside
    fireEvent.press(getByTestId('closeable-area'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');

    // Apply button click
    fireEvent.press(getByText('Apply'));
    expect(applyClickHandler).toBeCalled();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" testID="select-test" />
        <DropdownOverlay testID="dropdown-overlay-test">
          <ActionList testID="action-list-test">
            <ActionListHeader
              title="Recent Searches"
              leading={<ActionListHeaderIcon icon={HistoryIcon} />}
              testID="action-list-header-test"
            />
            <ActionListItem title="Apple" value="apple" testID="action-list-item-test" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListFooter
              title="Search Tips"
              leading={<ActionListFooterIcon icon={SearchIcon} />}
              trailing={<Button>Apply</Button>}
              testID="action-list-footer-test"
            />
          </ActionList>
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
    const ControlledDropdown = (): JSX.Element => {
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
                <ActionListItem title="Pune" value="pune" testID="pune-option" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox');
    expect(selectInput).toHaveTextContent('Select Option');
    fireEvent.press(getByText('Select Bangalore'));
    expect(selectInput).toHaveTextContent('Bangalore');

    fireEvent.press(selectInput);
    fireEvent.press(getByText('Pune'));
    expect(selectInput).toHaveTextContent('Pune');

    fireEvent.press(getByText('Clear Selection'));
    expect(selectInput).toHaveTextContent('Select Option');
  });

  it('should handle controlled props with multi select', () => {
    const ControlledDropdown = (): JSX.Element => {
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
                <ActionListItem title="Pune" value="pune" testID="pune-option" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const { getByRole, getByText } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox');
    expect(selectInput).toHaveTextContent('Select Option');
    fireEvent.press(getByText('Select Bangalore'));
    expect(selectInput).toHaveTextContent('Bangalore');

    fireEvent.press(selectInput);
    fireEvent.press(getByText('Pune'));
    expect(selectInput).toHaveTextContent('2 items selected');

    fireEvent.press(getByText('Select Bangalore'));
    expect(selectInput).toHaveTextContent('2 items selected');
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
    const ControlledDropdownMenu = (): JSX.Element => {
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
});
