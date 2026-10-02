import { COUNTER_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'Counter',
  description: "Blade's Counter: a count in a pill, `max+` past its max.",
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    color: { control: 'select', options: COUNTER_AXES.color },
    emphasis: { control: 'select', options: COUNTER_AXES.emphasis },
    size: { control: 'select', options: COUNTER_AXES.size },
  },
  stories: {
    Basic: {
      description: "Blade's Default story: 20, neutral, subtle.",
      args: { value: 20, max: 0, color: 'neutral', emphasis: 'subtle', size: 'medium' },
    },
    Max: {
      description: 'Past `max` the counter reads `max+`.',
      args: { value: 120, max: 99, color: 'neutral', emphasis: 'intense', size: 'medium' },
    },
    Matrix: {
      description: 'Every colour and emphasis at each size, one and two digits.',
      argTypes: {},
    },
  },
};

export default meta;
