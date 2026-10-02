import { COUNTER_INPUT_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'CounterInput',
  description:
    "Blade's CounterInput: a number between min and max, stepped by its buttons or typed; the number slides in from the side it moved.",
  argTypes: {
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    size: { control: 'select', options: COUNTER_INPUT_AXES.size },
    emphasis: { control: 'select', options: COUNTER_INPUT_AXES.emphasis },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  stories: {
    Basic: {
      description: "Blade's Basic Usage story.",
      args: {
        label: 'Quantity',
        min: 0,
        max: 100,
        size: 'medium',
        emphasis: 'subtle',
        isLoading: false,
        isDisabled: false,
      },
    },
    Variants: {
      name: 'Sizes and emphases',
      description: 'Every size in both emphases, with the loading and disabled states.',
      argTypes: {},
    },
    InForm: {
      name: 'In a form',
      description: 'The count submits under its name.',
      argTypes: {},
    },
  },
};

export default meta;
