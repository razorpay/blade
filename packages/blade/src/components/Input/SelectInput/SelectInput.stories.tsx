import type { Meta } from '@storybook/react';
import SelectInputComponent from './SelectInput';

const SelectInputStoryMeta: Meta = {
  title: 'Components/Input/SelectInput',
  component: SelectInputComponent,
  args: {
    label: 'Select Fruit',
    placeholder: 'Select your favorite fruit',
    helpText: 'Select only one',
    isRequired: true,
  },
};

export const SelectInput = SelectInputComponent;
export default SelectInputStoryMeta;
