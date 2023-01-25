import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', () => {
    const { container, getByRole } = renderWithSSR(
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
    const dropdownMenu = getByRole('listbox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    expect(dropdownMenu).not.toBeVisible();
    fireEvent.click(selectInput);
    expect(dropdownMenu).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
