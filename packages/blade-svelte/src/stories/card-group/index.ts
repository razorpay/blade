import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'CardGroup',
  description:
    "Blade DSL's Card Group: rows on one raised surface that pick (a `value`: a native radio or checkbox row), navigate (`href`) or disclose `content`, with anything else — headings, notes, buttons — between them. ActionList is it in ActionList's look.",
  argTypes: {
    isDeselectable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    PaymentMethods: {
      name: 'Payment methods',
      description:
        "Figma's anatomy: link rows (a chevron right) and rows with `content` (a chevron that flips), which they disclose.",
      argTypes: {},
    },
    Navigation: {
      description: 'Link rows only; a disabled one leaves the tab order.',
      argTypes: {},
    },
    PickWithDetails: {
      name: 'A pick that reveals details',
      description:
        "A choice's `content` shows while it is picked: the part-payment field opens under its row.",
      argTypes: {},
    },
    Basic: {
      description: 'Single choice; arrow keys move the pick.',
      args: {
        isDeselectable: false,
        isDisabled: false,
      },
    },
    Multiple: {
      description:
        'selectionType="multiple" turns the rows into checkboxes and the value into an array.',
      argTypes: {},
    },
    WithOtherChildren: {
      name: 'Headings and a button',
      description:
        'Anything between CardGroupItems is left alone: headings, and v2 SavedCards\' "All N options" button, which reveals the rest. Only CardGroupItems are options — outside the value, the keyboard and isRequired.',
      argTypes: {},
    },
  },
};

export default meta;
