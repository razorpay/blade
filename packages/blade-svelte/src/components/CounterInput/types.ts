import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

/**
 * Visual emphasis of the `CounterInput`.
 */
export type CounterInputEmphasis = 'subtle' | 'intense';

/**
 * Size of the `CounterInput`.
 */
export type CounterInputSize = 'xsmall' | 'medium' | 'large';

/**
 * Payload passed to the `onChange` callback when the value changes.
 */
export type CounterInputOnChange = (args: { value: number }) => void;

export interface CounterInputProps extends StyledPropsBlade {
  /**
   * Label to be shown for the counter input. Rendered inside a native `<label>`.
   */
  label?: string;
  /**
   * Accessibility label for the input (optional override). Exposed to screen readers
   * on the underlying spinbutton input.
   */
  accessibilityLabel?: string;
  /**
   * Position of the label relative to the counter. `left` only applies on desktop
   * (≥768px); it falls back to `top` on smaller screens.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * The name of the input field (useful for form submission).
   */
  name?: string;
  /**
   * The numerical value of the counter input. Passing this makes the component controlled.
   */
  value?: number;
  /**
   * The default numerical value when the component is uncontrolled.
   */
  defaultValue?: number;
  /**
   * Minimum allowed value. When reached, the decrement button is disabled.
   *
   * @default 0
   */
  min?: number;
  /**
   * Maximum allowed value. When reached, the increment button is disabled.
   * If not provided, the increment button is never disabled by an upper bound.
   */
  max?: number;
  /**
   * Visual emphasis of the counter input.
   *
   * @default 'subtle'
   */
  emphasis?: CounterInputEmphasis;
  /**
   * Size of the counter input.
   *
   * @default 'medium'
   */
  size?: CounterInputSize;
  /**
   * Shows a loading indicator and disables interaction.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * If `true`, the counter input is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Called when the value changes via increment, decrement, or manual input.
   */
  onChange?: CounterInputOnChange;
  /**
   * Called when the input receives focus.
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * Called when the input loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}
