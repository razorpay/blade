import type { BladeProps } from '~/code/types/Blade';

export const defaultValues: BladeProps = {
  intent: {
    type: 'string',
    value: 'neutral',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  size: {
    type: 'string',
    value: 'small',
  },
  isIndeterminate: {
    type: 'boolean',
    value: 'false',
  },
  showPercentage: {
    type: 'boolean',
    value: 'false',
  },
  label: {
    type: 'string',
    value: '',
  },
};
