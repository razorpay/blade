import type { BladeProps } from '~/code/types/Blade';

export const defaultValues: BladeProps = {
  size: {
    type: 'string',
    value: 'medium',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  labelPosition: {
    type: 'string',
    value: 'right',
  },
  label: {
    type: 'string',
    value: '',
  },
};
