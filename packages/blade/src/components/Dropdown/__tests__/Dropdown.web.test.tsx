import React from 'react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import {
  ActionList,
  ActionListFooter,
  ActionListFooterIcon,
  ActionListHeader,
  ActionListHeaderIcon,
  ActionListItem,
} from '~components/ActionList';
import { Button } from '~components/Button';
import { HistoryIcon, SearchIcon } from '~components/Icons';

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

    const { container, getByRole } = renderWithTheme(
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

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(container.querySelector('[role=dialog]')).not.toBeVisible();
    await user.click(selectInput);
    expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  // MOUSE CLICK TESTS
  it('should select item with mouse clicks', async () => {
    const user = userEvent.setup();

    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();
    expect(selectInput.textContent).toBe('Orange');
  });

  it('should trigger focus and blur events for SelectInput', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput name="dropdown-select" label="Fruits" onFocus={onFocus} onBlur={onBlur} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Banana" value="banana" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    await user.click(selectInput);
    expect(onFocus).toHaveBeenCalledWith({ name: 'dropdown-select', value: '' });
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(onBlur).toHaveBeenCalledWith({ name: 'dropdown-select', value: 'Orange' });
  });

  it('should handle accessibility of multiselect', async () => {
    const user = userEvent.setup();
    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('false');

    await user.click(getByRole('option', { name: 'Apple' }));
    expect(selectInput.textContent).toBe('Apple');
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('true');

    await user.click(getByRole('option', { name: 'Mango' }));
    expect(selectInput.textContent).toBe('2 items selected');
    expect(getByRole('option', { name: 'Mango' }).getAttribute('aria-selected')).toBe('true');
  });

  // KEYBOARD ACCESSIBILITY TESTS
  it('should close with escape', async () => {
    const user = userEvent.setup();

    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    await user.keyboard('{Escape}');
    expect(getByRole('listbox', { name: 'Fruits' })).not.toBeVisible();
  });

  it('should move focus between items with arrow key', async () => {
    const user = userEvent.setup();
    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    // Dropdown open
    selectInput.focus();
    await user.keyboard('{ArrowDown}');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

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
    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    // Dropdown open
    selectInput.focus();
    await user.keyboard('{ArrowDown}');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Apple');

    // Move to second item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Mango');
    await user.keyboard('[Space]');

    expect(selectInput.textContent).toBe('Mango');

    // Ensure menu did not close
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to third item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant(selectInput, container)).toBe('Orange');
    await user.keyboard('[Space]');

    expect(selectInput.textContent).toBe('2 items selected');
    expect(getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('false');
    expect(getByRole('option', { name: 'Mango' }).getAttribute('aria-selected')).toBe('true');
    expect(getByRole('option', { name: 'Orange' }).getAttribute('aria-selected')).toBe('true');
  });

  it('should work with type ahead', async () => {
    const user = userEvent.setup();
    const { container, getByRole } = renderWithTheme(
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
    expect(selectInput.textContent).toBe('Select Option');
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    // Dropdown Open and Jump to option starting with "M"
    selectInput.focus();
    await user.keyboard('m');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

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
    const { container, getByRole } = renderWithTheme(
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    await user.keyboard('{ArrowDown}');
    expect(selectInput).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(selectInput).not.toHaveFocus();
  });

  it('should move focus to footer button', async () => {
    const user = userEvent.setup();
    const applyClickHandler = jest.fn();
    const { container, getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mingo" value="mingo" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListFooter trailing={<Button onClick={applyClickHandler}>Apply</Button>} />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(container.querySelector('[role=dialog]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible();

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
});
