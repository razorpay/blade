import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Option list',
  description:
    "A choice among visible options (Blade's ActionList, v2's OptionList): one OptionItem per option, each a native radio or checkbox row, with anything else — headings, notes, buttons — between them. VirtualOptionList takes the options as data for long lists.",
  argTypes: {
    isDeselectable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description: 'Single choice; arrow keys move the pick.',
      args: {
        isDeselectable: false,
        isDisabled: false,
      },
    },
    Multiple: {
      description: 'selectionType="multiple" turns the rows into checkboxes and the value into an array.',
      argTypes: {
              },
    },
    Filtered: {
      description:
        'The items are filtered by a search field; the pick stays on the option, not the position.',
      argTypes: {},
    },
    WithOtherChildren: {
      name: 'Headings and a button',
      description:
        'Anything between OptionItems is left alone: headings, and v2 SavedCards\' "All N options" button, which reveals the rest. Only OptionItems are options — outside the value, the keyboard and isRequired.',
      argTypes: {
              },
    },
    Virtualised: {
      description:
        'VirtualOptionList: 2000 rows of two different heights: only the rows in view are mounted, measured as they appear; the scrollbar length is a prediction that settles as you scroll.',
      argTypes: {},
    },
    InForm: {
      name: 'In a form',
      description: 'A required list: the form blocks submission until an option is picked.',
      argTypes: {},
    },
  },
};

export default meta;
