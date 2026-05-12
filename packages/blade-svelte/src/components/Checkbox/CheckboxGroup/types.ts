import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { Snippet } from 'svelte';
import type { CheckboxSize } from '@razorpay/blade-core/styles';

export interface CheckboxGroupState {
  isChecked: (value: string) => boolean;
  addValue: (value: string) => void;
  removeValue: (value: string) => void;
}

/**
 * Shape of the context provided to child Checkbox components.
 */
export interface CheckboxGroupContextType {
  name?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  necessityIndicator?: 'required' | 'optional' | 'none';
  validationState?: 'error' | 'none';
  size?: CheckboxSize;
  state: CheckboxGroupState;
  /** ID of the group-level hint/error span so children can link it via aria-describedby */
  hintId?: string;
}

export interface CheckboxGroupProps extends StyledPropsBlade {
  /**
   * Checkbox items to render inside the group.
   */
  children: Snippet;
  /**
   * Label rendered above (or to the left of) the group.
   */
  label?: string;
  /**
   * Help text shown below the group when there is no error.
   */
  helpText?: string;
  /**
   * Error text shown when `validationState` is `'error'`.
   */
  errorText?: string;
  /**
   * Sets the error state of the group and propagates it to every child Checkbox.
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after the label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Disables all checkboxes in the group.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Marks the group as required.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Position of the group label.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial checked values (uncontrolled).
   */
  defaultValue?: string[];
  /**
   * Checked values (controlled). Use `onChange` to update.
   */
  value?: string[];
  /**
   * Callback fired when any checkbox within the group changes state.
   */
  onChange?: (payload: { name: string; values: string[] }) => void;
  /**
   * Name attribute shared across all checkboxes in the group.
   */
  name?: string;
  /**
   * Size propagated to all child checkboxes.
   *
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * Layout direction of the checkboxes.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Test ID for the wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}
