import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../../Icons/iconMap';

export type BaseLinkProps = {
  children?: Snippet | string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  variant?: 'anchor' | 'button';
  href?: string;
  target?: string;
  rel?: string;
  isDisabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  accessibilityProps?: {
    label?: string;
    describedBy?: string;
    controls?: string;
    expanded?: boolean;
  };
  testID?: string;
  htmlTitle?: string;
  opacity?: number;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
