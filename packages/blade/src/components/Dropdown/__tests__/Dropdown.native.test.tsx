import React from 'react';
// import { Button } from 'react-native';
// import { fireEvent } from '@testing-library/react-native';
import { Dropdown, DropdownOverlay } from '../index';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { SelectInput } from '~components/Input/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

describe('<Dropdown />', () => {
  it('should render dropdown', () => {
    const { toJSON } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Select Fruit" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
