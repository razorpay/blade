import type { Meta } from '@storybook/react';
import { Dropdown, DropdownOverlay } from './Dropdown';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';

const SelectInputStoryMeta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    // label: 'Select Fruit',
    // placeholder: 'Select your favorite fruit',
    // helpText: 'Select only one',
  },
};

export const WithSelect = (): JSX.Element => {
  return (
    <Dropdown>
      <SelectInput label="Select" placeholder="Select Fruit" />
      <DropdownOverlay>
        <ul>
          <li>Hello</li>
          <li>Hi</li>
          <li>Yo</li>
        </ul>
      </DropdownOverlay>
    </Dropdown>
  );
};
export default SelectInputStoryMeta;
