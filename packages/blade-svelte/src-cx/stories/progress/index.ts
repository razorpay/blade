import { PROGRESS_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Progress',
  description:
    'Waiting dots and how far along something is (a bar, a ring), as one style-only component (packages/blade/components/progress/Progress.svelte). A placeholder for loading content is Skeleton.',
  argTypes: {
    type: { control: 'select', options: PROGRESS_AXES.type },
    size: { control: 'select', options: PROGRESS_AXES.size },
    accessibilityLabel: { control: 'text' },
  },
  stories: {
    Basic: {
      args: { type: 'dots', size: 'medium', accessibilityLabel: '' },
    },
    Matrix: {
      description: 'Every type and size, generated from PROGRESS_AXES.',
      argTypes: {},
    },
    Determinate: {
      description:
        'bar and ring draw the value they are given (role="progressbar"); moving between values is a CSS transition.',
      argTypes: {},
    },
  },
};

export default meta;
