import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Menu',
  description:
    'A menu of actions, floating like a Popover: arrows open it from the trigger and move over the items, typing jumps to a match, a choice acts and closes. Same core and look as Dropdown.',
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
