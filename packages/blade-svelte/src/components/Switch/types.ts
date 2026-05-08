import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

/**
 * Payload passed to the `onChange` callback when the switch toggles.
 */
export type SwitchOnChange = (event: { isChecked: boolean; value?: string; event?: Event }) => void;

export interface SwitchProps extends StyledPropsBlade {
  /**
   * If `true`, the switch will be checked. This also makes the switch controlled.
   * Use `onChange` to update its value.
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the switch will be initially checked. This also makes the switch uncontrolled.
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Switch` changes.
   */
  onChange?: SwitchOnChange;
  /**
   * The name of the input field in a switch (useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the switch will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the switch.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for the internal checkbox/switch input.
   * Required for screen reader support since the Switch has no visible text label.
   */
  accessibilityLabel: string;
  /**
   * The id of the input field in a switch, useful for associating a label element
   * with the input via `htmlFor` prop.
   */
  id?: string;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Switch component.
 */
export interface SwitchInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: () => void;
}
