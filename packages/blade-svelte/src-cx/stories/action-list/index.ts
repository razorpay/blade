import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'ActionList',
  description:
    "Blade's ActionList: rows that look like Menu's and Dropdown's. Inside a Dropdown its items are the options; on its own it's a visible pick list (an OptionList in the action look) with bind:value, single or multiple, and form support.",
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
      description: 'Sections with a hairline between them, a link row (navigates, holds no value) and a negative row (a destructive choice).',
      argTypes: {},
    },
    InADropdown: {
      description: 'The same items as a Dropdown’s options, with a negative choice and a link row (custom trigger: the select field refuses negative rows).',
      argTypes: {},
    },
  },
};

export default meta;
