import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '../index';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', async () => {
    const { container, getByRole, queryByRole } = renderWithSSR(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Button isFullWidth>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('dialog')).not.toBeVisible();
    await userEvent.click(selectInput);
    await waitFor(() => expect(getByRole('dialog')).toBeVisible());
    expect(container).toMatchSnapshot();
  });
});
