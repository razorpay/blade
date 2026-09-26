import { BUTTON_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Button',
  description:
    'Button component over the press model (packages/blade/runes/button) under the blade taxonomy: variant, color and size come from its styles.',
  argTypes: {
    variant: { control: 'select', options: BUTTON_AXES.variant },
    color: { control: 'select', options: BUTTON_AXES.color },
    size: { control: 'select', options: BUTTON_AXES.size },
    isLoading: { control: 'boolean', description: 'Host-driven busy state' },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'primary',
        color: 'neutral',
        size: 'medium',
        isLoading: false,
        isDisabled: false,
        label: 'Pay now',
      },
    },
    BusyCauses: {
      name: 'Busy causes',
      description:
        'The three sources of aria-busy: the host prop, an async onClick, and the enclosing form submitting.',
      argTypes: {
        isLoading: { control: 'boolean', description: 'Host-driven busy' },
      },
      args: { isLoading: false },
    },
    Validate: {
      name: 'Validate before press',
      description:
        'type="button" validateForm: an invalid form shakes the button, reveals the first invalid field and reports to the Form.',
      argTypes: {},
    },
    AutoPress: {
      name: 'Auto press',
      description:
        'autoPressAfter: the button presses itself after N seconds, its fill showing the time run; a press by hand ends the wait.',
      argTypes: {
        variant: { control: 'select', options: BUTTON_AXES.variant },
      },
      args: { variant: 'primary' },
    },
    Matrix: {
      name: 'Variant matrix',
      description: 'Every variant × size, generated from BUTTON_AXES.',
      argTypes: {
        color: { control: 'select', options: BUTTON_AXES.color },
        isLoading: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
      },
      args: { color: 'primary', isLoading: false, isDisabled: false },
    },
  },
};

export default meta;
