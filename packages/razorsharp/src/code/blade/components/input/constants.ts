import type { BladeHelperProps, BladeProps } from '~/code/types/Blade';

export const defaultValues: BladeProps = {
  labelPosition: { value: 'top', type: 'string' },
  showClearButton: { value: 'false', type: 'boolean' },
  numberOfLines: { value: '2', type: 'number' },
  otpLength: { value: '6', type: 'number' },
};

export const helpers: BladeHelperProps = {
  value: 'instance',
  onChange: 'instance',
};
