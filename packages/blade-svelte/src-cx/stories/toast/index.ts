import { TOAST_AXES, TOAST_STACK_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Toast',
  description:
    'showToast from anywhere, over the toast queue: a timer per toast that hover and focus hold, a capacity that evicts the oldest, and a reason for every exit. Toasts sit in the LayerHost but push no layer.',
  argTypes: {
    color: { control: 'select', options: TOAST_AXES.color },
    placement: { control: 'select', options: TOAST_STACK_AXES.placement },
    duration: { control: 'number', description: 'ms; 0 stays' },
  },
  stories: {
    Basic: { args: { color: 'neutral', placement: 'bottom', duration: 4000 } },
  },
};

export default meta;
