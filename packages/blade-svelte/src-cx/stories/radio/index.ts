import { RADIO_GROUP_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Radio',
  description:
    "RadioGroup is one form field over the radio-group model (packages/blade/runes/radio); its Radios hide the native input and draw Blade's indicator, with their parts from the group.",
  argTypes: {
    orientation: { control: 'select', options: RADIO_GROUP_AXES.orientation },
    size: { control: 'select', options: RADIO_GROUP_AXES.size },
    label: { control: 'text' },
    helpText: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description: 'Controlled through bind:value; arrow keys move the pick.',
      args: {
        orientation: 'vertical',
        size: 'medium',
        label: 'Pay via',
        helpText: '',
        isDisabled: false,
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
        errorText: 'Choose how you want to pay',
      },
    },
    InForm: {
      name: 'In a form',
      description:
        'A required group: the form blocks submission until a radio is picked and collects the value under the group name.',
      argTypes: {},
    },
  },
};

export default meta;
