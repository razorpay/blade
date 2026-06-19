import type { Snippet, Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconProps } from '../../Icons/types';

// Icon component type - Svelte component that accepts IconProps
export type IconComponent = Component<IconProps>;

/**
 * Loading behaviour of the button.
 * - `indefinite`: shows a 3-dot loader (driven by `isLoading`) that replaces all content
 * - `definite`: the button sits in its disabled/"rest" color while a left-to-right
 *   progress bar in the button's normal color fills over `loadingTimer` ms, so the button
 *   visually transitions from disabled → normal as it completes. Content stays visible.
 */
export type ButtonLoadingType = 'indefinite' | 'definite';

/**
 * A single avatar entry rendered inside the button's avatar group.
 * Only the data needed to render an `<Avatar />` is accepted to prevent
 * arbitrary markup from being injected into the button.
 *
 * At least one of `name` or `src` is required — both serve as the stable
 * identity used to key the avatar in the rendered group, so an entry with
 * neither cannot be reliably reconciled when the list changes.
 */
type ButtonAvatarBase = {
  /**
   * `alt` text for the avatar image.
   */
  alt?: string;
};

export type ButtonAvatar = ButtonAvatarBase &
  (
    | {
        /**
         * Name used to generate initials and as the image `alt` when `src` loads.
         */
        name: string;
        /**
         * Avatar image source.
         */
        src?: string;
      }
    | {
        /**
         * Name used to generate initials and as the image `alt` when `src` loads.
         */
        name?: string;
        /**
         * Avatar image source.
         */
        src: string;
      }
  );

export interface BaseButtonProps extends StyledPropsBlade {
  children?: Snippet | string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?:
    | 'primary'
    | 'white'
    | 'positive'
    | 'negative'
    | 'notice'
    | 'information'
    | 'neutral'
    | 'transparent';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
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
   * Required when `loadingType` is `definite`. The progress is consumer-controlled via this timer.
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
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'reset' | 'submit';
  id?: string;
  tabIndex?: number;
  accessibilityProps?: {
    label?: string;
    describedBy?: string;
    controls?: string;
    expanded?: boolean;
    hasPopup?: 'menu';
    role?: string;
  };
  testID?: string;
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}
