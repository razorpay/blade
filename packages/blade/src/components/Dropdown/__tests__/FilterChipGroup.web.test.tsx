import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay, FilterChipGroup, FilterChipSelectInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { ActionList, ActionListItem } from '~components/ActionList';

const renderGroup = (
  props: Omit<React.ComponentProps<typeof FilterChipGroup>, 'children'> = {},
): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <FilterChipGroup {...props}>
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

describe('<FilterChipGroup />', () => {
  it('shows the default "Clear Filter" action only after a filter is selected', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText, findByText } = renderGroup();

    // No selection yet -> no group action button
    expect(queryByText('Clear Filter')).toBeNull();

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(await findByText('Clear Filter')).toBeInTheDocument();
  });

  it('renders a custom clearButtonText label', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText, queryByText } = renderGroup({ clearButtonText: 'Reset' });

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(await findByText('Reset')).toBeInTheDocument();
    expect(queryByText('Clear Filter')).toBeNull();
  });

  it('does not render the action button when showClearAction is false', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByText } = renderGroup({ showClearAction: false });

    // Capture the chip trigger before selection (accessible name is exactly the label).
    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    // chip is selected (its value shows in the trigger) but the group action link never renders
    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    expect(queryByText('Clear Filter')).toBeNull();
  });

  it('in "clear" mode (default) empties the child chip and hides the action button', async () => {
    const user = userEvent.setup();
    const onClearButtonClick = jest.fn();
    const { getByRole, findByText, queryByText } = renderGroup({ onClearButtonClick });

    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    // chip now shows the selected value
    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    const clearAction = await findByText('Clear Filter');

    await user.click(clearAction);

    expect(onClearButtonClick).toHaveBeenCalledTimes(1);
    // clear empties the (uncontrolled) chip and the action button disappears
    await waitFor(() => expect(queryByText('Clear Filter')).toBeNull());
    expect(trigger).not.toHaveTextContent('Apple');
  });

  it('the Reset action fires onResetButtonClick, keeps the child chip value, and hides the action', async () => {
    const user = userEvent.setup();
    const onResetButtonClick = jest.fn();
    const { getByRole, findByText, queryByText } = renderGroup({
      showClearAction: false,
      onResetButtonClick,
    });

    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    const resetAction = await findByText('Reset');

    await user.click(resetAction);

    expect(onResetButtonClick).toHaveBeenCalledTimes(1);
    // reset clears only the group's own bookkeeping so the action hides...
    await waitFor(() => expect(queryByText('Reset')).toBeNull());
    // ...but the chip is NOT force-cleared (consumer owns restoring defaults), so it keeps its value
    expect(trigger).toHaveTextContent('Apple');
  });

  it('renders a custom resetButtonText label', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = renderGroup({
      showClearAction: false,
      onResetButtonClick: jest.fn(),
      resetButtonText: 'Restore defaults',
    });

    await user.click(getByRole('button', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    expect(await findByText('Restore defaults')).toBeInTheDocument();
  });

  it('can render both Reset and Clear actions together', async () => {
    const user = userEvent.setup();
    const onClearButtonClick = jest.fn();
    const onResetButtonClick = jest.fn();
    const { getByRole, findByText, getByText } = renderGroup({
      onClearButtonClick,
      onResetButtonClick,
    });

    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    // both actions are shown once a filter is selected
    expect(await findByText('Reset')).toBeInTheDocument();
    expect(getByText('Clear Filter')).toBeInTheDocument();

    // clicking Reset fires only its own callback and does not empty the chip
    await user.click(getByText('Reset'));
    expect(onResetButtonClick).toHaveBeenCalledTimes(1);
    expect(onClearButtonClick).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent('Apple');
  });

  it('does not render Reset or Clear actions when showResetAction and showClearAction are both false', async () => {
    const user = userEvent.setup();
    const onResetButtonClick = jest.fn();
    const { getByRole, queryByText } = renderGroup({
      showClearAction: false,
      onResetButtonClick,
      showResetAction: false,
    });

    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    // Reset action is hidden even though onResetButtonClick is provided
    expect(queryByText('Reset')).toBeNull();
    // Clear action is also hidden because showClearAction is false
    expect(queryByText('Clear Filter')).toBeNull();
  });

  it('hides only the Reset action when showResetAction is false (Clear still visible)', async () => {
    const user = userEvent.setup();
    const onResetButtonClick = jest.fn();
    const { getByRole, queryByText, findByText } = renderGroup({
      onResetButtonClick,
      showResetAction: false,
    });

    const trigger = getByRole('button', { name: 'Fruits' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'Apple' }));

    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    // Reset action is hidden
    expect(queryByText('Reset')).toBeNull();
    // Clear action is still visible (showClearAction defaults to true)
    expect(await findByText('Clear Filter')).toBeInTheDocument();
  });
});
