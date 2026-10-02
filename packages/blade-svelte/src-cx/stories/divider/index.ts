import { DIVIDER_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Divider',
  description:
    "Blade's Divider: a separator line (an hr). Style-only; spacing round it, and a width or height, are the caller's class.",
  argTypes: {
    orientation: { control: 'select', options: DIVIDER_AXES.orientation },
    dividerStyle: { control: 'select', options: DIVIDER_AXES.dividerStyle },
    variant: { control: 'select', options: DIVIDER_AXES.variant },
    thickness: { control: 'select', options: DIVIDER_AXES.thickness },
  },
  stories: {
    Basic: {
      args: {
        orientation: 'horizontal',
        dividerStyle: 'solid',
        variant: 'muted',
        thickness: 'thin',
      },
    },
    Matrix: {
      description: 'Every variant × thickness, solid and dashed.',
      argTypes: {},
    },
  },
};

export default meta;
