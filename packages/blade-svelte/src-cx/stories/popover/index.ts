import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Popover',
  description:
    'Blade\'s Popover: a non-modal panel with an arrow toward its trigger — a title with a leading icon, the content and a footer — placed and flipped like a Tooltip, rendered in the LayerHost. A click toggles it and shows a close button; `openInteraction="hover"` opens it under the pointer. Escape or a press outside closes.',
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top-start', 'bottom-start', 'bottom', 'bottom-end', 'right', 'left'],
    },
    openInteraction: { control: 'select', options: ['click', 'hover'] },
    title: { control: 'text' },
    withTooltip: {
      control: 'boolean',
      description: 'A tooltip inside the popover: Escape closes the tooltip first',
    },
  },
  stories: {
    Basic: {
      args: {
        placement: 'top',
        openInteraction: 'click',
        title: 'Convenience fee',
        withTooltip: false,
      },
    },
  },
};

export default meta;
