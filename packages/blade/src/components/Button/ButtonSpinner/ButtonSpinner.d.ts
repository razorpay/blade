import type { IconProps } from '~components/Icons';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
export * from './ButtonSpinner.web';

export type ButtonSpinnerProps = {
  children: React.ReactNode;
  color: IconProps['color'];
  size: NonNullable<BaseButtonProps['size']>;
  isLoading: boolean;
};
