import type { IconProps } from '../../Icons';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
export * from './ButtonSpinner.web';

export type ButtonSpinnerProps = {
  children: React.ReactNode;
  color: IconProps['color'];
  size: NonNullable<BaseButtonProps['size']>;
  isLoading: boolean;
};
