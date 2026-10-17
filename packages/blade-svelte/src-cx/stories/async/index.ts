import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Async',
  description:
    'A boundary around a promise: the value, the wait (shown only after a delay, so a fast load never flashes it) and the failure.',
  argTypes: {
    pendingDelay: {
      control: 'number',
      description: 'ms before the pending state shows; the default when unset',
    },
    lines: { control: 'number', description: 'Shimmer lines (blade)' },
  },
  stories: {
    Basic: { args: { pendingDelay: 150, lines: 3 } },
  },
};

export default meta;
