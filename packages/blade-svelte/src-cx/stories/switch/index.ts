import { SWITCH_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Switch',
  description:
    'An on/off control: a checkbox to the form (same toggle rune), role="switch" to assistive tech. isLoading shows a change in flight and refuses toggles.',
  argTypes: {
    size: { control: 'select', options: SWITCH_AXES.size },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  stories: {
    Basic: {
      args: { size: 'medium', isDisabled: false, label: 'Save this card' },
    },
  },
};

export default meta;
