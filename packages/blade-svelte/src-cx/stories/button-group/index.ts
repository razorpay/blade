import { BUTTON_GROUP_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'ButtonGroup',
  description:
    'Blade’s ButtonGroup: Buttons joined in a row. The group sets every button’s variant, size and colour, and disables them all.',
  argTypes: {
    variant: { control: 'select', options: BUTTON_GROUP_AXES.variant },
    color: { control: 'select', options: BUTTON_GROUP_AXES.color },
    size: { control: 'select', options: BUTTON_GROUP_AXES.size },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'primary',
        color: 'primary',
        size: 'medium',
        isDisabled: false,
      },
    },
    Matrix: {
      description: 'Every variant and size, generated from BUTTON_GROUP_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
