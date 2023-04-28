import type { BladeProps } from '~/code/types/Blade';

export const defaultProps: BladeProps = {
  fontWeight: {
    value: 'regular',
    type: 'string',
  },
  contrast: {
    value: 'low',
    type: 'string',
  },
  size: {
    value: 'medium',
    type: 'string',
  },
  variant: {
    value: 'neutral',
    type: 'string',
  },
};
