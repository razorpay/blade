import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

export type CheckboxSize = 'small' | 'medium' | 'large';

/**
 * Payload passed to the `onChange` callback when a Checkbox toggles.
 */
export type CheckboxOnChange = (event: {
  isChecked: boolean;
  value?: string;
  event?: Event;
}) => void;

/**
 * Payload passed to the CheckboxGroup `onChange` callback.
 */
export type CheckboxGroupOnChange = (event: { name: string; values: string[] }) => void;

export interface CheckboxProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * If `true`, the checkbox will be checked. This also makes the checkbox controlled.
   * Use `onChange` to update its value.
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled.
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: CheckboxOnChange;
  /**
   * Sets the label of the checkbox.
   */
  children?: Snippet | string;
  /**
   * Help text for the checkbox.
   */
  helpText?: string;
  /**
   * Error text for the checkbox.
   *
   * Renders when `validationState` is set to 'error'.
   */
  errorText?: string;
  /**
   * If `true`, the checkbox will be indeterminate.
   * This does not modify the isChecked property.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * The name of the input field in a checkbox (useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox input is marked as required, and `required` attribute will be added.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the checkbox input is marked as invalid, and `invalid` attribute will be added.
   */
  validationState?: 'error' | 'none';
  /**
   * Size of the checkbox.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Sets the tab-index property on the checkbox input element.
   */
  tabIndex?: number;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
}

export interface CheckboxGroupProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * Accepts multiple checkboxes as children.
   */
  children: Snippet;
  /**
   * Help text of the checkbox group.
   */
  helpText?: string;
  /**
   * Error text of the checkbox group.
   * Renders when `validationState` is set to 'error'. Overrides helpText.
   */
  errorText?: string;
  /**
   * Sets the error state of the CheckboxGroup.
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every checkbox.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after CheckboxGroup label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the CheckboxGroup.
   * If set to `true` it propagates down to all the checkboxes.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the CheckboxGroup.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Renders the label of the checkbox group.
   */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the checkbox group (uncontrolled).
   */
  defaultValue?: string[];
  /**
   * Value of the checkbox group (controlled). Use `onChange` to update its value.
   */
  value?: string[];
  /**
   * The callback invoked when any of the checkbox's state changes.
   */
  onChange?: CheckboxGroupOnChange;
  /**
   * The name of the input field in a checkbox (useful for form submission).
   */
  name?: string;
  /**
   * Size of the checkboxes within the group.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Orientation of the checkbox group.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Controls wrapping of the checkbox options container.
   *
   * @default 'nowrap'
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Snippet rendered immediately after the group label (e.g. an info tooltip).
   */
  labelSuffix?: Snippet;
  /**
   * Snippet rendered trailing the group label, pushed to the far end (e.g. a link).
   */
  labelTrailing?: Snippet;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
}

/**
 * Selection state shared via context to child Checkboxes inside a CheckboxGroup.
 */
export type State = {
  value: string[];
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};

export type CheckboxGroupContextType = Pick<
  CheckboxGroupProps,
  | 'validationState'
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'name'
  | 'necessityIndicator'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'size'
> & { state?: State };

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Checkbox component.
 */
export interface CheckboxInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: (options?: FocusOptions) => void;
}

/**
 * Props for the internal presentational CheckboxIcon (the visible box + tick/dash svg).
 */
export interface CheckboxIconProps {
  isChecked?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  size: CheckboxSize;
}
