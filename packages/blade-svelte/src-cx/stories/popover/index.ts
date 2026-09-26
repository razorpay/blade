import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Popover',
  description:
    'A non-modal panel anchored to its trigger: placed and flipped like a Tooltip, rendered in the LayerHost, off the layer stack. Press to toggle; Escape or a press outside closes.',
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top', 'right', 'left'],
    },
  },
  stories: {
    Basic: { args: { placement: 'bottom-start' } },
  },
};

export default meta;
