import type { IconProps } from '../../Icons';

export { default } from './ButtonSpinner.web';

export type ButtonSpinnerProps = {
  children: React.ReactNode;
  color: IconProps['color'];
  size: IconProps['size'];
  isLoading: boolean;
};
