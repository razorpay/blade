import type { Snippet } from 'svelte';
import type { BaseButtonProps } from './BaseButton/types';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type ButtonProps = BaseButtonProps & {
  /**
   * The content of the button
   */
  children?: Snippet | string;
  /**
   * Icon to display in the button
   * Accepts an icon component from Blade
   */
  icon?: BaseButtonProps['icon'];
  /**
   * Position of the icon relative to the button text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Button variant that defines the visual style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Color theme of the button
   * Note: Not all color and variant combinations are valid
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * The accessible label for the button
   * Required for icon-only buttons
   */
  accessibilityLabel?: string;
  /**
   * Function called when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
} & StyledPropsBlade;
