import { ALERT_AXES } from '../../index';
import * as glyphs from '../../icons/glyphs';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Alert',
  description:
    'An inline message: an icon (the colour’s by default), a title and a description, dismissible unless isDismissible is false. Dismissing slides it shut; bind isOpen to bring it back.',
  argTypes: {
    color: { control: 'select', options: ALERT_AXES.color },
    emphasis: { control: 'select', options: ALERT_AXES.emphasis },
    icon: { control: 'select', options: ['default', ...Object.keys(glyphs)] },
    isDismissible: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  stories: {
    Basic: {
      args: {
        color: 'negative',
        emphasis: 'subtle',
        icon: 'default',
        isDismissible: true,
        title: 'This bank is facing issues',
        description: 'Payments are likely to fail. Try another bank or method.',
      },
    },
    Colors: {
      description: 'Every colour in both emphases, generated from ALERT_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
