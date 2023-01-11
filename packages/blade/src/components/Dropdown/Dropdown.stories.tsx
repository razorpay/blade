import type { Meta } from '@storybook/react';
import { Dropdown, DropdownOverlay } from './Dropdown';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList/ActionList';

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {},
};

export const WithSelect = (): JSX.Element => {
  return (
    <Dropdown>
      <SelectInput
        label="Select your favorite fruit"
        name="fruits"
        onChange={({ name, values }) => {
          console.log(name, values);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Mango" value="mango" />
          <ActionListItem title="Banana" value="banana" />
          <ActionListItem title="Orange" value="orange" />
          <ActionListItem title="Mingo" value="mingo" />
          <ActionListItem title="Watermelon" value="watermelon" />
          <ActionListItem title="Strawberry" value="strawberry" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const WithMultiSelect = (): JSX.Element => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput
        label="Select your favorite fruit"
        name="fruits"
        onChange={({ name, values }) => {
          console.log(name, values);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Mango" value="mango" />
          <ActionListItem title="Banana" value="banana" />
          <ActionListItem title="Orange" value="orange" />
          <ActionListItem title="Mingo" value="mingo" />
          <ActionListItem title="Watermelon" value="watermelon" />
          <ActionListItem title="Strawberry" value="strawberry" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
export default DropdownStoryMeta;
