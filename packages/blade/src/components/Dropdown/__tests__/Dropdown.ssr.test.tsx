import React from 'react';
import { Dropdown, DropdownOverlay } from '../index';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';

describe('<Dropdown />', () => {
  it('should render dropdown and make it visible on click', () => {
    const { container, getByRole } = renderWithSSR(
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
    expect(container).toMatchSnapshot();
  });
});
