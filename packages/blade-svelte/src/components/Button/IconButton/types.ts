import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../../Icons/iconMap';

/**
 * Visual emphasis of the IconButton's icon.
 * - `intense`: gray icon (use on light/neutral surfaces)
 * - `subtle`: static white icon (use on dark/intense surfaces)
 */
export type IconButtonEmphasis = 'subtle' | 'intense';

/**
 * Size of the IconButton's icon.
 */
export type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonProps extends StyledPropsBlade {
  /**
   * Icon component to be rendered, eg. `CloseIcon`.
   */
  icon: IconComponent;
  /**
   * Icon size.
   * @default 'medium'
   */
  size?: IconButtonSize;
  /**
   * Icon emphasis (contrast).
   * @default 'intense'
   */
  emphasis?: IconButtonEmphasis;
  /**
   * Sets `aria-label` to help users know what the action does, eg 'Dismiss alert'.
   */
  accessibilityLabel: string;
  /**
   * Disabled state for IconButton.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Changes the hover/focus interaction to highlight the icon more by rendering a
   * fixed-size square with a faded background. Web-only.
   *
   * Note: not supported with `size="large"`.
   * @default false
   */
  isHighlighted?: boolean;
  /**
   * Sets the `tabindex` property on the button element.
   */
  _tabIndex?: number;
  /**
   * Called when the IconButton is clicked.
   */
  onClick?: (event: MouseEvent) => void;
  /** Called when the IconButton loses focus. */
  onBlur?: (event: FocusEvent) => void;
  /** Called when the IconButton receives focus. */
  onFocus?: (event: FocusEvent) => void;
  /** Called when the pointer leaves the IconButton. */
  onMouseLeave?: (event: MouseEvent) => void;
  /** Called when the pointer moves over the IconButton. */
  onMouseMove?: (event: MouseEvent) => void;
  /** Called when a pointer becomes active over the IconButton. */
  onPointerDown?: (event: PointerEvent) => void;
  /** Called when a pointer enters the IconButton. */
  onPointerEnter?: (event: PointerEvent) => void;
  /** Called when a touch point is placed on the IconButton. */
  onTouchStart?: (event: TouchEvent) => void;
  /** Called when a touch point is removed from the IconButton. */
  onTouchEnd?: (event: TouchEvent) => void;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
