import { PROGRESS_BAR_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'ProgressBar',
  description:
    "Blade's ProgressBar: how far along something is (progress), or where a value sits in a range (meter), as a linear bar or a ring.",
  argTypes: {
    variant: { control: 'select', options: PROGRESS_BAR_AXES.variant },
    type: { control: 'select', options: ['progress', 'meter'] },
    size: { control: 'select', options: PROGRESS_BAR_AXES.size },
    color: { control: 'select', options: ['', ...PROGRESS_BAR_AXES.color] },
    value: { control: 'number' },
    label: { control: 'text' },
    isIndeterminate: { control: 'boolean' },
    showPercentage: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        variant: 'linear',
        type: 'progress',
        size: 'small',
        color: '',
        value: 40,
        label: 'Uploading',
        isIndeterminate: false,
        showPercentage: true,
      },
    },
    Matrix: {
      description:
        'Every colour, linear and circular sizes, a meter and an indeterminate bar, generated from PROGRESS_BAR_AXES.',
      argTypes: {},
    },
    Determinate: {
      description:
        'The fill moves between values over 2xgentle; a progress bar pulses from a long delay on, a meter stays static.',
      argTypes: {},
    },
  },
};

export default meta;
