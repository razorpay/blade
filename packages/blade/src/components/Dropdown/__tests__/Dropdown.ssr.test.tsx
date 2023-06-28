import React from 'react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import {
  ActionList,
  ActionListFooter,
  ActionListHeader,
  ActionListItem,
  ActionListFooterIcon,
  ActionListHeaderIcon,
} from '~components/ActionList';
import { Button } from '~components/Button';
import { HistoryIcon, SearchIcon } from '~components/Icons';

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', async () => {
    const { container, getByRole } = renderWithSSR(
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
    const dropdownMenu = getByRole('dialog', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(dropdownMenu).not.toBeVisible();
    await userEvent.click(selectInput);
    expect(dropdownMenu).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
