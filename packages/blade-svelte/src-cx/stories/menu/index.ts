import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Menu',
  description:
    'A menu of actions over the createMenu rune, floating like a Popover: arrows open it from the trigger, focus roves over the items, typing jumps to a match, a choice acts and closes.',
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-end', 'bottom-start', 'top-end', 'right'],
    },
  },
  stories: {
    Basic: { args: { placement: 'bottom-end' } },
  },
};

export default meta;
