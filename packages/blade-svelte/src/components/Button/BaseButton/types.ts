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
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'transparent';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
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
