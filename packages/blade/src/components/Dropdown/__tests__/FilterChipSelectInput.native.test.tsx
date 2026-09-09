import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Dropdown, DropdownOverlay } from '../index';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { ActionList, ActionListItem } from '~components/ActionList';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<FilterChipSelectInput /> (native)', () => {
  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should open dropdown on press', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    fireEvent.press(getByText('Status'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
  });

  it('should select an option and display its value', () => {
    const onChange = jest.fn();
    const { getByText, getByTestId, getAllByRole } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" name="status" onChange={onChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    fireEvent.press(getByText('Status'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');
    fireEvent.press(getAllByRole('menuitem')[0]);
    expect(onChange).toHaveBeenCalledWith({ name: 'status', values: ['active'] });
  });

  it('should not open dropdown when disabled', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" isDisabled />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    fireEvent.press(getByText('Status'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" testID="filter-chip-test" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('filter-chip-test')).toBeTruthy();
  });

  it('should select multiple options and report all selected values', () => {
    const onChange = jest.fn();
    const { getByText, getAllByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput label="Status" name="status" onChange={onChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    fireEvent.press(getByText('Status'));
    const menuItems = getAllByRole('menuitem');
    fireEvent.press(menuItems[0]);
    fireEvent.press(menuItems[1]);

    expect(onChange).toHaveBeenLastCalledWith({
      name: 'status',
      values: ['active', 'inactive'],
    });
  });

  it('should clear the selected value when the clear button is pressed', () => {
    const onChange = jest.fn();
    const onClearButtonClick = jest.fn();
    const { getByText, getByLabelText, getAllByRole } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput
          label="Status"
          name="status"
          onChange={onChange}
          onClearButtonClick={onClearButtonClick}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    fireEvent.press(getByText('Status'));
    fireEvent.press(getAllByRole('menuitem')[0]);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'status', values: ['active'] });

    fireEvent.press(getByLabelText('Clear Status value'));

    expect(onClearButtonClick).toHaveBeenCalledWith({ name: 'status', values: ['active'] });
    expect(onChange).toHaveBeenLastCalledWith({ name: 'status', values: [] });
  });

  it('should not render the clear button when showClearButton is false, even when selected', () => {
    const { getByText, getAllByRole, queryByLabelText } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" name="status" showClearButton={false} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    fireEvent.press(getByText('Status'));
    fireEvent.press(getAllByRole('menuitem')[0]);

    // a value is selected but the per-chip clear (cross) button is hidden
    expect(queryByLabelText('Clear Status value')).toBeNull();
  });

  it('should reflect a controlled value as the selected chip value', () => {
    const { getAllByText, getByLabelText } = renderWithTheme(
      <Dropdown>
        <FilterChipSelectInput label="Status" name="status" value="active" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    // "Active" is rendered both in the chip trigger (selected value) and in the ActionList item.
    expect(getAllByText('Active').length).toBeGreaterThanOrEqual(2);
    // A selected chip renders the clear button.
    expect(getByLabelText('Clear Status value')).toBeTruthy();
  });

  it('should reflect a controlled single selection in multiple mode as the option name', () => {
    const { getAllByText, getByLabelText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput label="Status" name="status" value={['active']} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    // A single selection in multiple mode shows the option name (in the chip + ActionList), no counter.
    expect(getAllByText('Active').length).toBeGreaterThanOrEqual(2);
    expect(getByLabelText('Clear Status value')).toBeTruthy();
  });

  it('should reflect a controlled multiple value with counter and clear button', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput label="Status" name="status" value={['active', 'inactive']} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    // More than one selected → the chip collapses to a compact counter of the selection count.
    expect(getByText('2')).toBeTruthy();
    expect(getByLabelText('Clear Status value')).toBeTruthy();
  });
});
