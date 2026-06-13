import type { AccessibilityProps, StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../../../Icons/iconMap';
import type { IconButtonEmphasis, IconButtonSize } from '../types';

export interface BaseIconButtonProps extends StyledPropsBlade {
  /**
   * Icon component to be rendered, eg. `CloseIcon`.
   */
  icon: IconComponent;
  /**
   * Icon size.
   */
  size?: IconButtonSize;
  /**
   * Icon emphasis (contrast).
   */
  emphasis?: IconButtonEmphasis;
  /**
   * Sets `aria-label` to help users know what the action does, eg 'Dismiss alert'.
   */
  accessibilityLabel: string;
  /**
   * Additional accessibility attributes merged into the rendered element.
   */
  accessibilityProps?: Partial<AccessibilityProps>;
  /**
   * Disabled state for IconButton.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders a fixed-size square with a faded hover/focus background. Web-only.
   * Not supported with `size="large"`.
   * @default false
   */
  isHighlighted?: boolean;
  /**
   * Sets the `tabindex` property on the button element.
   */
  tabIndex?: number;
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
  /** Called when a key is pressed while the IconButton is focused. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Test id that can be used to select the element in testing environments.
   */
  testID?: string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
