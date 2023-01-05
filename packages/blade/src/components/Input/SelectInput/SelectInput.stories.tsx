import type { Meta } from '@storybook/react';
import { SelectInput as SelectInputComponent } from './SelectInput';

const SelectInputStoryMeta: Meta = {
  title: 'Components/Input/SelectInput',
  component: SelectInputComponent,
  args: {
    label: 'Select Fruit',
    helpText: 'Select only one',
    isRequired: true,
  },
};

export const SelectInput = SelectInputComponent;
export default SelectInputStoryMeta;
