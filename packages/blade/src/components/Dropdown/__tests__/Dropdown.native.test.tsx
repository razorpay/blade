import React from 'react';
// import { Button } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
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
    expect(selectOnChange).toBeCalledWith({ name: 'fruits', values: [''] });
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
    expect(selectOnChangeHandler).toBeCalledWith({ name: 'fruits', values: [''] });
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
});
