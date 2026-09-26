import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Input group',
  description:
    'One label, one hint line and one frame around several fields (packages/blade/components/input-group). Each member takes its span of a row.',
  argTypes: {
    label: { control: 'text' },
    helpText: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description:
        'Card details: the number and the name take a full row, expiry and CVV share one.',
      args: {
        label: 'Card details',
        helpText: 'As printed on the card',
        isDisabled: false,
      },
    },
    InForm: {
      name: 'In a form',
      description:
        'The group line mirrors the first visible member error; only the failing member is marked invalid.',
      argTypes: {},
    },
  },
};

export default meta;
