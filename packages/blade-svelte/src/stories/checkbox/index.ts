import { CHECKBOX_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Checkbox',
  description:
    "Checkbox component (src/components/checkbox) over the checkbox model and the field shell; under the app's form (`adapters.form`) it registers itself and mirrors its own error.",
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: CHECKBOX_AXES.size },
    isChecked: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    helpText: { control: 'text' },
  },
  stories: {
    Basic: {
      description: 'Controlled through bind:isChecked; the control seeds it, the user toggles it.',
      args: {
        label: 'Save this card for faster checkout',
        size: 'medium',
        isChecked: false,
        isIndeterminate: false,
        isDisabled: false,
        helpText: '',
      },
    },
    Validation: {
      description:
        'Owned validation state: the consumer passes validationState and the matching text.',
      argTypes: {
        validationState: { control: 'select', options: ['none', 'error'] },
        helpText: { control: 'text' },
        errorText: { control: 'text' },
      },
      args: {
        validationState: 'error',
        errorText: 'You must accept the terms to continue',
      },
    },
  },
};

export default meta;
