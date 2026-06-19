import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

export type RadioSize = 'small' | 'medium' | 'large';

export interface RadioProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * Sets the label text of the Radio.
   * Accepts a string or a snippet.
   */
  children?: Snippet | string;
  /**
   * Help text for the Radio, rendered below the label.
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled.
   * Merges with the parent `RadioGroup`'s `isDisabled`.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radio. The parent `RadioGroup`'s size takes precedence.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Test ID for the element.
   */
  testID?: string;
}

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Radio component.
 */
export interface RadioInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: () => void;
}

/**
 * Payload passed to the `RadioGroup` `onChange` callback when selection changes.
 */
export type RadioGroupOnChange = (payload: {
  name: string | undefined;
  value: string;
  event?: Event;
}) => void;

type RadioGroupCommonProps = {
  /** Snippet children (Radio components). */
  children: Snippet;
  /** Help text of the radio group, rendered below the radios. */
  helpText?: string;
  /**
   * Error text of the radio group. Renders when `validationState` is `'error'`.
   * Overrides `helpText`.
   */
  errorText?: string;
  /**
   * Sets the validation state of the radio group.
   * When `'error'`, renders `errorText` and propagates `invalid` to every radio.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the radio group label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the radio group.
   * Propagates down to all the radios.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the radio group.
   *
   * @default false
   */
  isRequired?: boolean;
  /** Renders the label of the radio group. */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /** Initial value of the radio group (uncontrolled). */
  defaultValue?: string;
  /** Value of the radio group (controlled). Use with `onChange`. */
  value?: string;
  /** The callback invoked when any of the radio's state changes. */
  onChange?: RadioGroupOnChange;
  /**
   * The name of the input field in a radio (useful for form submission).
   * Auto-generated if not provided.
   */
  name?: string;
  /**
   * Size of the radios.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Orientation of the radio group.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /** Test ID for the element. */
  testID?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;

export type RadioGroupProps = RadioGroupCommonProps;

/**
 * Selection state for the radio group, consumed by child radios via context.
 */
export type State = {
  /** Currently selected value. */
  value: string | undefined;
  /** Whether the given value is the selected one. */
  isChecked(value: string): boolean;
  /** Select the given value. No-op when the group is disabled. */
  setValue(value: string, event?: Event): void;
  /** Clear the current selection. No-op when the group is disabled. */
  removeValue(): void;
};

export type RadioGroupContextType = Pick<
  RadioGroupCommonProps,
  | 'validationState'
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'necessityIndicator'
  | 'size'
> & { state?: State };
