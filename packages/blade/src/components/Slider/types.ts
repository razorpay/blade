import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type SliderSize = 'medium' | 'large';

// Deliberately narrowed to exclude 'success' — sliders have no success state in v1
export type SliderValidationState = 'none' | 'error';

export type SliderProps = {
  /**
   * The controlled value of the slider.
   * When provided, also pass `onChange` to update the value.
   */
  value?: number;

  /**
   * Callback fired on every input event (every thumb move).
   * Receives the new numeric value and the original event.
   */
  onChange?: (params: {
    value: number;
    name?: string;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => void;

  /**
   * The initial value for uncontrolled mode.
   * @default 0
   */
  defaultValue?: number;

  /**
   * Minimum allowed value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value.
   * @default 100
   */
  max?: number;

  /**
   * Increment/decrement step for keyboard and drag interactions.
   * @default 1
   */
  step?: number;

  /**
   * Label text rendered above or beside the slider.
   * One of `label` or `accessibilityLabel` must be provided.
   */
  label?: string;

  /**
   * Position of the label relative to the slider.
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Help text rendered below the slider.
   */
  helpText?: string;

  /**
   * Error text rendered below the slider when `validationState` is `'error'`.
   */
  errorText?: string;

  /**
   * Validation state. Use `'error'` to mark the field invalid.
   * @default 'none'
   */
  validationState?: SliderValidationState;

  /**
   * Disables the slider. Prevents interaction and applies disabled styling.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Marks the field as required. Renders a required indicator on the label.
   * @default false
   */
  isRequired?: boolean;

  /**
   * HTML `name` attribute, useful for form submissions.
   */
  name?: string;

  /**
   * `aria-label` applied to the input when `label` is not provided.
   * Required when `label` is absent.
   */
  accessibilityLabel?: string;

  /**
   * Controls the visual size (track height and thumb diameter).
   * @default 'medium'
   */
  size?: SliderSize;
} & TestID &
  DataAnalyticsAttribute;
