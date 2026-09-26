import { ALERT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Alert',
  description:
    'An inline message: an icon, a title, a description, actions, and a dismiss button when it has a name. isOpen slides it open and shut.',
  argTypes: {
    color: { control: 'select', options: ALERT_AXES.color },
    title: { control: 'text' },
    content: { control: 'text' },
    closeLabel: {
      control: 'text',
      description: 'Names the dismiss button; empty removes it',
    },
  },
  stories: {
    Basic: {
      args: {
        color: 'negative',
        title: 'This bank is facing issues',
        content: 'Payments are likely to fail. Try another bank or method.',
        closeLabel: 'Dismiss',
      },
    },
    Colors: {
      description: 'Every colour, generated from ALERT_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
