import { BADGE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Badge',
  description:
    'A small status label. Style-only: no behaviour model behind it.',
  argTypes: {
    color: { control: 'select', options: BADGE_AXES.color },
    emphasis: { control: 'select', options: BADGE_AXES.emphasis },
    size: { control: 'select', options: BADGE_AXES.size },
    content: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        color: 'positive',
        emphasis: 'subtle',
        size: 'medium',
        content: 'New',
      },
    },
    Matrix: {
      description: 'Every colour and emphasis, generated from BADGE_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
