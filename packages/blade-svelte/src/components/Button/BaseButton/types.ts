import type { Snippet, Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconProps } from '../../Icons/types';

// Icon component type - Svelte component that accepts IconProps
export type IconComponent = Component<IconProps>;

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
  isLoading?: boolean;
  /**
   * Controls loading behaviour.
   * - `'indefinite'`: replaces content with a 3-dot spinner while `isLoading` is true.
   * - `'definite'`: shows a left-to-right progress overlay driven by `loadingTimer`.
   * @default 'indefinite'
   */
  loadingType?: 'indefinite' | 'definite';
  /**
   * Duration in milliseconds for the definite progress fill animation.
   * Required when `loadingType` is `'definite'`.
   */
  loadingTimer?: number;
  /**
   * Callback fired once the definite progress fill reaches 100%.
   */
  onLoadingComplete?: () => void;
  /**
   * Avatar data to render as an `AvatarGroup` after the button text.
   * Only visible when `size` is `'large'` and loading type is not indefinite.
   */
  avatars?: { name?: string; src?: string; alt?: string }[];
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'reset' | 'submit';
  id?: string;
  tabIndex?: number;
  accessibilityProps?: {
    label?: string;
    describedBy?: string;
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
