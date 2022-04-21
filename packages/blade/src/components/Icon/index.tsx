export { default as Path } from './Path';
export { default as Svg } from './Svg';
export { default as CreditCardIcon } from './CreditCardIcon';

export type IconSize = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall' | 'xxsmall';
export type IconProps = {
  size: IconSize;
  fill?: string;
};
