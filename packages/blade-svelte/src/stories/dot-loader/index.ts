import { DOT_LOADER_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'DotLoader',
  description:
    "Blade's indefinite three-dot loader: the dots rise in turn, the middle one held at its peak under reduced motion. Button draws it while loading.",
  argTypes: {
    size: { control: 'select', options: DOT_LOADER_AXES.size },
    color: { control: 'select', options: DOT_LOADER_AXES.color },
    accessibilityLabel: { control: 'text' },
  },
  stories: {
    Basic: {
      args: { size: 'medium', color: 'muted', accessibilityLabel: 'Loading' },
    },
    Matrix: {
      description: 'Every size and colour, generated from DOT_LOADER_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
