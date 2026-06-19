import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseButtonProps, ButtonAvatar, ButtonLoadingType } from './BaseButton/types';

export type { ButtonAvatar, ButtonLoadingType };

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
   * Whether the button is in a loading state.
   * Only applicable when `loadingType` is `indefinite` (the default) and drives the 3-dot loader.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Type of loading indicator to show.
   * - `indefinite`: 3-dot loader controlled by `isLoading`
   * - `definite`: left-to-right progress bar (button color) over a disabled-colored base
   * @default 'indefinite'
   */
  loadingType?: ButtonLoadingType;
  /**
   * Duration (in milliseconds) over which the `definite` progress bar fills from 0% to 100%.
   * Required when `loadingType` is `definite`.
   */
  loadingTimer?: number;
  /**
   * Called once when the `definite` progress bar reaches 100%.
   */
  onLoadingComplete?: () => void;
  /**
   * Avatars to render after the button text as an avatar group.
   * Only rendered for `large` buttons; ignored for smaller sizes.
   */
  avatars?: ButtonAvatar[];
  /**
   * The accessible label for the button
   * Required for icon-only buttons
   */
  accessibilityLabel?: string;
  /**
   * Function called when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Accessibility role for the button
   */
  role?: string;
  /**
   * aria-describedby attribute
   */
  'aria-describedby'?: string;
  /**
   * aria-expanded attribute
   */
  'aria-expanded'?: boolean;
  /**
   * aria-controls attribute
   */
  'aria-controls'?: string;
  /**
   * aria-haspopup attribute
   */
  'aria-haspopup'?: 'menu' | boolean;
} & StyledPropsBlade;
