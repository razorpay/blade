import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { SpinnerSize, SpinnerColor } from '@razorpay/blade-core/styles';

export type BaseSpinnerProps = {
  /**
   * Sets the size of the spinner.
   *
   * @default 'medium'
   */
  size?: SpinnerSize;
  /**
   * Sets the color of the spinner.
   *
   * @default 'neutral'
   */
  color?: SpinnerColor;
  /**
   * Sets the aria-label for web & accessibilityLabel react-native.
   *
   */
  accessibilityLabel: string;
  /**
   * Sets the label of the spinner.
   */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'right'
   */
  labelPosition?: 'right' | 'bottom';
  testID?: string;
} & StyledPropsBlade;

