import React from 'react';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

describe('<Checkbox />', () => {
  it('should render checkbox with error validationState', () => {
    const labelText = 'Remember password';
    const errorText = 'This has to be checked';
    const { container, getByRole, getByText } = renderWithSSR(
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
    expect(getByRole('combobox', { name: labelText })).toBeInvalid();
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    expect(container).toMatchSnapshot();
  });
});
