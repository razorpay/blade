import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioValidationState = 'error' | 'none';
export type RadioNecessityIndicator = 'required' | 'optional' | 'none';
export type RadioLabelPosition = 'top' | 'left';
export type RadioOrientation = 'vertical' | 'horizontal';

export interface RadioProps extends StyledPropsBlade {
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * Label text for the Radio.
   */
  children?: Snippet;
  /**
   * Help text displayed below the radio label.
   */
  helpText?: string;
  /**
   * If `true`, the Radio will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radio.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
}

export interface RadioGroupProps extends StyledPropsBlade {
  /**
   * Radio children to render inside the group.
   */
  children: Snippet;
  /**
   * Visible label for the radio group.
   */
  label?: string;
  /**
   * Help text displayed below the radio group.
   */
  helpText?: string;
  /**
   * Error text displayed when `validationState` is `'error'`.
   * Overrides `helpText`.
   */
  errorText?: string;
  /**
   * Validation state of the radio group.
   *
   * @default 'none'
   */
  validationState?: RadioValidationState;
  /**
   * Necessity indicator displayed after the label.
   *
   * @default 'none'
   */
  necessityIndicator?: RadioNecessityIndicator;
  /**
   * If `true`, all radios in the group are disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, a radio selection is required.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Label position relative to the radio group.
   *
   * @default 'top'
   */
  labelPosition?: RadioLabelPosition;
  /**
   * Uncontrolled initial value.
   */
  defaultValue?: string;
  /**
   * Controlled value. Use with `onChange`.
   */
  value?: string;
  /**
   * Callback fired when the selected radio changes.
   */
  onChange?: (payload: {
    name: string | undefined;
    value: string;
    event: Event;
  }) => void;
  /**
   * Name attribute for form submission. Auto-generated if not provided.
   */
  name?: string;
  /**
   * Size of the radios in the group.
   *
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * Orientation of the radio group.
   *
   * @default 'vertical'
   */
  orientation?: RadioOrientation;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
}

export type RadioGroupState = {
  value: string | undefined;
  setValue(value: string, event: Event): void;
  removeValue(): void;
  isChecked(value: string): boolean;
};

export type RadioGroupContextType = Pick<
  RadioGroupProps,
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
> & { state?: RadioGroupState };
