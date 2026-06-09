import type { Snippet, Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { VisualStyledProps } from '@razorpay/blade-core/utils';
import type { ButtonStyleOverrides } from '@razorpay/blade-core/styles';
import type { IconProps } from '../../Icons/types';

// Icon component type - Svelte component that accepts IconProps
export type IconComponent = Component<IconProps>;

export interface BaseButtonProps extends StyledPropsBlade {
  /**
   * **Instance-level styling — Option B (recommended).**
   * Bounded, typed per-instance visual overrides mapped to element-scoped CSS
   * variables. Interaction states (hover/active/focus/disabled) are *derived* from
   * the base color, so an override keeps working states. Reactive — re-spreads when
   * the object changes (e.g. a live config editor).
   *
   * @example
   * <Button styleOverrides={{ backgroundColor: '#1a59ff', textColor: '#ffffff' }} />
   */
  styleOverrides?: ButtonStyleOverrides;
  /**
   * **Instance-level styling — Option A (evaluation only).**
   * Flat visual styled props written straight to inline styles. ⚠️ State-unaware:
   * a `backgroundColor` here dead-ends hover/disabled. Prefer `styleOverrides`.
   */
  visualProps?: VisualStyledProps;
  /**
   * **Instance-level styling — Option D (evaluation only).**
   * Opts this button into a slot in a `BladeProvider`'s `slotTheme.button` map.
   */
  themeKey?: string;
  /**
   * **Instance-level styling — Option E (evaluation only).**
   * Raw class passthrough. ⚠️ Specificity wars vs CSS-module rules; banned in
   * checkout SFCs. Included for comparison.
   */
  className?: string;
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
