import { BUTTON_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Button',
  description:
    'Button component over the press model (src/runes/button) under the blade taxonomy: variant, color and size come from its styles.',
  argTypes: {
    variant: { control: 'select', options: BUTTON_AXES.variant },
    color: { control: 'select', options: BUTTON_AXES.color },
    size: { control: 'select', options: BUTTON_AXES.size },
    isLoading: { control: 'boolean', description: 'Host-driven busy state' },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
    withIcon: { control: 'boolean', description: 'icon: a leading glyph' },
    withTrailingIcon: { control: 'boolean', description: 'trailingIcon: a trailing glyph' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'primary',
        color: 'primary',
        size: 'medium',
        isLoading: false,
        isDisabled: false,
        label: 'Pay now',
        withIcon: false,
        withTrailingIcon: false,
      },
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
