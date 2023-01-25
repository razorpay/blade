import React from 'react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListFooter, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', async () => {
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
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();
    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();
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
    expect(selectInput.textContent).toBe('Apple, Mango');
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
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(selectInput.textContent).toBe('Select Option');
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    const getActiveDescendant = (): string | null | undefined => {
      const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
      const activeDescendantElement = container.querySelector(`#${activeDescendantId}`);
      return activeDescendantElement?.textContent;
    };

    // Dropdown open
    selectInput.focus();
    await user.keyboard('{ArrowDown}');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant()).toBe('Apple');

    // Move to second item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant()).toBe('Mango');

    // Select option
    await user.keyboard('[Space]');
    expect(selectInput.textContent).toBe('Mango');
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

    const getActiveDescendant = (): string | null | undefined => {
      const activeDescendantId = selectInput.getAttribute('aria-activedescendant');
      const activeDescendantElement = container.querySelector(`#${activeDescendantId}`);
      return activeDescendantElement?.textContent;
    };

    // Dropdown open
    selectInput.focus();
    await user.keyboard('{ArrowDown}');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to first item
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant()).toBe('Apple');

    // Move to second item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant()).toBe('Mango');
    await user.keyboard('[Space]');

    expect(selectInput.textContent).toBe('Mango');

    // Ensure menu did not close
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Move to third item and select
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendant()).toBe('Orange');
    await user.keyboard('[Space]');

    expect(selectInput.textContent).toBe('Mango, Orange');
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
    expect(container.querySelector('[role=listbox]')).not.toBeVisible();

    await user.click(selectInput);
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    // Check focus
    await user.keyboard('{ArrowDown}');
    expect(selectInput).toHaveFocus();

    // Move focus to footer button
    await user.keyboard('{Tab}');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();
    expect(getByRole('button', { name: 'Apply' })).toHaveFocus();

    // Press footer button
    await user.keyboard('{Enter}');
    expect(applyClickHandler).toBeCalledTimes(1);
  });
});
