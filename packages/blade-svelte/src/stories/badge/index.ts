import { BADGE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Badge',
  description:
    'A small status label: a pill in one of six colours, subtle or intense, four sizes, with an optional icon. One line; a cut-off label carries its full text as a title.',
  argTypes: {
    color: { control: 'select', options: BADGE_AXES.color },
    emphasis: { control: 'select', options: BADGE_AXES.emphasis },
    size: { control: 'select', options: BADGE_AXES.size },
    content: { control: 'text' },
    withIcon: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        color: 'positive',
        emphasis: 'subtle',
        size: 'medium',
        content: 'New',
        withIcon: false,
      },
    },
    Matrix: {
      description:
        'Every colour and emphasis, every size with an icon, and a truncated label, generated from BADGE_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
