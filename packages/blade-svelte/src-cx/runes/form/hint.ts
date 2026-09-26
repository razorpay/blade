import type { FieldRecord, FormState } from './types';

export type ValidationState = 'none' | 'error' | 'success';

export interface HintProps {
  /** Explicit state from the consumer; wins over the form-derived one. */
  validationState?: ValidationState;
  /** The one line under the control: help, error or success copy alike. */
  hint?: string;
}

export interface FieldHint {
  /** Colours the control and the hint line alike. */
  validationState: ValidationState;
  /** The line shown under the control, if any. */
  text?: string;
}

/**
 * The form error a field may show: the form reports errors for every field
 * on every refresh, so an untouched field stays quiet until a submit or
 * validate attempt.
 */
export function visibleFieldError(
  field: FieldRecord,
  state: FormState
): string | undefined {
  if (!field.name || !(state.submitted || field.touched)) {
    return undefined;
  }
  return state.errors[field.name];
}

/** What a group of fields shows on its one line: its first visible error. */
export function visibleGroupError(
  fields: readonly FieldRecord[],
  state: FormState
): string | undefined {
  for (const field of fields) {
    const error = visibleFieldError(field, state);
    if (error) {
      return error;
    }
  }
  return undefined;
}

/**
 * Which validation state a field-shaped component renders and which line
 * goes with it. A consumer that passes `validationState` owns both: the
 * line is its `hint` (an error with no hint borrows the form's message).
 * Otherwise the field mirrors its form error — the message replaces the
 * hint while it lasts.
 */
export function resolveHint(props: HintProps, formError?: string): FieldHint {
  if (props.validationState !== undefined) {
    return {
      validationState: props.validationState,
      text:
        props.hint ??
        (props.validationState === 'error' ? formError : undefined),
    };
  }
  if (formError) {
    return { validationState: 'error', text: formError };
  }
  return { validationState: 'none', text: props.hint };
}
