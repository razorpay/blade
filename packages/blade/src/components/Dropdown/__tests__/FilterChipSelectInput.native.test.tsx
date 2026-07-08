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
});
