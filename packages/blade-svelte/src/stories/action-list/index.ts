import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'ActionList',
  description:
    "Blade's ActionList: a visible pick list (CardGroup's anatomy in Menu's look) with bind:value, single or multiple, and form support; in a Menu it is the menu's content, its onPick closing the menu.",
  argTypes: {
    isDeselectable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description: 'A standalone single pick: the selected wash shows the pick.',
      args: { isDeselectable: false, isDisabled: false },
    },
    Multiple: {
      description: 'selectionType="multiple": rows lead with a checkbox; the value is an array.',
      argTypes: {},
    },
    LinksAndActions: {
      description:
        'Sections with a hairline between them, a link row (navigates, holds no value) and a negative row (a destructive choice).',
      argTypes: {},
    },
    InAMenu: {
      description:
        "The same items inside a Menu: the ActionList is the menu's content, and its onPick closes it — with a negative choice and a link row.",
      argTypes: {},
    },
  },
};

export default meta;
