import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

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
    await user.keyboard('{ }');
    expect(selectInput.textContent).toBe('Mango');
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

    // Dropdown Open and Jump to option starting with "M"
    await user.keyboard('{Tab}');
    expect(selectInput).not.toHaveFocus();
  });
});
