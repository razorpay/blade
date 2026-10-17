import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'ActionList',
  description:
    "Blade's ActionList: a visible pick list (an OptionList in the action look) with bind:value, single or multiple, and form support; inside a Modal menu its rows are the menu's items.",
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
    BankPicker: {
      description:
        'variant="card" with sections, isSearchable (the list\'s own SearchInput above the rows) and selectionType="none": each section is its own box under its heading, rows act and hold nothing, a section the search empties steps aside, and empty shows when none is left.',
      argTypes: {},
    },
    VirtualBankPicker: {
      description:
        'virtualizedSections: the same card look, sections and search for a long list — only the rows in view are mounted. The rows are data and children renders one; VirtualOptionList underneath.',
      argTypes: {},
    },
    InAMenu: {
      description:
        'The same items inside a Modal `variant="menu"`: every row acts and closes the menu, with a negative choice and a link row.',
      argTypes: {},
    },
  },
};

export default meta;
