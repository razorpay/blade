import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { BaseInputSize, BaseInputValidationState } from '@razorpay/blade-core/styles';
import type { LabelPosition } from '../Input/BaseInput/types';

/**
 * Value shared by `InputGroup` with its descendant inputs. Consumed inside
 * `BaseInput` to inherit `size`/`isDisabled` and suppress per-input label + hint.
 */
export type InputGroupContextType = {
  /** `true` for any input rendered inside an `InputGroup`. */
  isInsideInputGroup: boolean;
  /** Size propagated to every child input (overrides the input's own `size`). */
  size?: BaseInputSize;
  /** Disabled state propagated to every child input. */
  isDisabled?: boolean;
};

/**
 * Props for the `InputGroup` component.
 */
export type InputGroupProps = {
  /** Label for the entire input group. */
  label?: string;
  /**
   * Position of the label relative to the group. `left` is a desktop-only layout
   * (falls back to `top` below 768px).
   * @default 'top'
   */
  labelPosition?: LabelPosition;
  /**
   * Controls the size of the input group and its child inputs.
   * @default 'medium'
   */
  size?: BaseInputSize;
  /** Help text displayed at the bottom of the group. */
  helpText?: string;
  /** Error message that appears when `validationState` is `'error'`. */
  errorText?: string;
  /** Success message that appears when `validationState` is `'success'`. */
  successText?: string;
  /**
   * Current validation state of the input group.
   * @default 'none'
   */
  validationState?: BaseInputValidationState;
  /**
   * Disables all inputs within the group.
   * @default false
   */
  isDisabled?: boolean;
  /** Should be `InputRow` components (or other valid inputs). */
  children: Snippet;
  /** Test ID for automation. */
  testID?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;

/**
 * Props for the `InputRow` component.
 */
export type InputRowProps = {
  /**
   * CSS `grid-template-columns` value controlling how space is distributed
   * between child inputs (e.g. `"1fr 2fr"` or `"200px 1fr"`).
   * @default '1fr'
   */
  gridTemplateColumns?: string;
  /** Input components to render in this row. */
  children: Snippet;
  /** Test ID for automation. */
  testID?: string;
};
