import { LINK_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Link',
  description:
    'Always an anchor: it goes somewhere. Something that only acts is `Button variant="link"`, which wears the same look from one shared style module (packages/blade/components/link/styles.ts).',
  argTypes: {
    color: { control: 'select', options: LINK_AXES.color },
    size: { control: 'select', options: LINK_AXES.size },
    iconPosition: { control: 'select', options: ['leading', 'trailing'] },
    withIcon: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    newTab: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        color: 'primary',
        size: 'medium',
        iconPosition: 'trailing',
        withIcon: false,
        isDisabled: false,
        newTab: true,
      },
    },
    LinkOrButton: {
      description:
        'The same look on an anchor and on a button, inline in a sentence. The button keeps Button behaviour: async press, busy, form actions.',
      argTypes: {},
    },
    Matrix: {
      description: 'Every colour and size, generated from LINK_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
