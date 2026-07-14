import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOverlay, FilterChipGroup, FilterChipSelectInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { ActionList, ActionListItem } from '~components/ActionList';
import { ListViewFiltersProvider } from '~components/ListView/ListViewFiltersContext.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const renderGroup = (ui: React.ReactElement) =>
  renderWithTheme(
    <ListViewFiltersProvider
      value={{
        listViewSelectedFilters: {},
        setListViewSelectedFilters: (): void => {},
        selectedFiltersCount: 0,
      }}
    >
      {ui}
    </ListViewFiltersProvider>,
  );

describe('<FilterChipGroup />', () => {
  it('should render the default "Clear Filter" button text when a filter is selected', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderGroup(
      <FilterChipGroup>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(getByText('Clear Filter')).toBeTruthy();
  });

  it('should use custom clearButtonText when provided', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderGroup(
      <FilterChipGroup clearButtonText="Reset All">
        <Dropdown>
          <FilterChipSelectInput label="Fruits" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(getByText('Reset All')).toBeTruthy();
  });

  it('should default to "Reset" button text when clearButtonBehavior="reset" and no clearButtonText', async () => {
    const onClearButtonClick = jest.fn();
    const { getByText } = renderGroup(
      <FilterChipGroup clearButtonBehavior="reset" onClearButtonClick={onClearButtonClick}>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" value="apple" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await waitFor(() => {
      expect(getByText('Reset')).toBeTruthy();
    });
  });

  it('should call onClearButtonClick without clearing child chip state in reset mode', async () => {
    const user = userEvent.setup();
    const onClearButtonClick = jest.fn();
    const onChangeMock = jest.fn();

    const { getByText } = renderGroup(
      <FilterChipGroup clearButtonBehavior="reset" onClearButtonClick={onClearButtonClick}>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" value="apple" onChange={onChangeMock} />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await waitFor(() => {
      expect(getByText('Reset')).toBeTruthy();
    });

    await user.click(getByText('Reset'));

    expect(onClearButtonClick).toHaveBeenCalledTimes(1);
    // In reset mode, onChange([]) should NOT be fired on child chips
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('should fire onClearButtonClick and clear child chips in clear mode (default)', async () => {
    const user = userEvent.setup();
    const onClearButtonClick = jest.fn();

    const { getByRole, getByText } = renderGroup(
      <FilterChipGroup onClearButtonClick={onClearButtonClick}>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(getByText('Clear Filter')).toBeTruthy();

    await user.click(getByText('Clear Filter'));

    expect(onClearButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should hide the action button after reset when no more filters are selected', async () => {
    const user = userEvent.setup();
    const onClearButtonClick = jest.fn();

    const { getByText, queryByText } = renderGroup(
      <FilterChipGroup clearButtonBehavior="reset" onClearButtonClick={onClearButtonClick}>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" value="apple" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    await waitFor(() => {
      expect(getByText('Reset')).toBeTruthy();
    });

    await user.click(getByText('Reset'));

    await waitFor(() => {
      expect(queryByText('Reset')).toBeFalsy();
    });
  });

  it('should not show the action button when showClearButton is false', () => {
    const { queryByText } = renderGroup(
      <FilterChipGroup showClearButton={false}>
        <Dropdown>
          <FilterChipSelectInput label="Fruits" value="apple" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </FilterChipGroup>,
    );

    expect(queryByText('Clear Filter')).toBeFalsy();
  });
});
