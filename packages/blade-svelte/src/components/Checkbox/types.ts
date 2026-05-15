import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { Snippet } from 'svelte';
import type { CheckboxSize } from '@razorpay/blade-core/styles';

export type CheckboxOnChange = (payload: {
  isChecked: boolean;
  value?: string;
  event?: Event;
}) => void;

export interface CheckboxProps extends StyledPropsBlade {
  /**
   * If `true`, the checkbox is checked (controlled mode).
   * Use `onChange` to update its value.
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked (uncontrolled mode).
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Callback invoked when the checked state changes.
   */
  onChange?: CheckboxOnChange;
  /**
   * Label content rendered next to the checkbox. Accepts any Svelte snippet.
   */
  children?: Snippet;
  /**
   * Help text displayed below the label.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is `'error'`.
   */
  errorText?: string;
  /**
   * If `true`, the checkbox shows an indeterminate state.
   * This does not modify `isChecked`.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * Name attribute for the underlying input (useful for form submission).
   */
  name?: string;
  /**
   * Value returned on form submission and used by CheckboxGroup to track selection.
   */
  value?: string;
  /**
   * If `true`, the checkbox is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the underlying input is marked as required.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * When `'error'`, the checkbox renders in an error state.
   */
  validationState?: 'error' | 'none';
  /**
   * Size of the checkbox.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Sets the `tabIndex` on the underlying input.
   */
  tabIndex?: number;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}
