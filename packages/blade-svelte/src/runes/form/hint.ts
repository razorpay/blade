export type ValidationState = 'none' | 'error' | 'success';

/**
 * What a hint line holds: text, or content the view renders (a Svelte
 * snippet). Opaque here — the runes only pass it through and test it for
 * presence; form errors are always text.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a snippet's own signature
export type HintContent = string | ((...args: any[]) => unknown);

/** A choice is made or missing: there is no success state to show. */
export type ChoiceValidationState = Exclude<ValidationState, 'success'>;

/**
 * Blade's lines, one shown: the state's own, else the help text. A field
 * without a success line passes no `successText`; one whose help text sits
 * elsewhere (a checkbox's, under its title) passes no `helpText`, and the
 * line is the error alone.
 */
export function pickHintText(props: {
  validationState?: ValidationState;
  helpText?: HintContent;
  errorText?: HintContent;
  successText?: HintContent;
}): HintContent | undefined {
  const own =
    props.validationState === 'error'
      ? props.errorText
      : props.validationState === 'success'
      ? props.successText
      : undefined;
  return own ?? props.helpText;
}

export interface HintProps {
  /** Explicit state from the consumer; wins over the form-derived one. */
  validationState?: ValidationState;
  /** The one line under the control: help, error or success copy alike. */
  hint?: HintContent;
}

export interface FieldHint {
  /** Colours the control and the hint line alike. */
  validationState: ValidationState;
  /** The line shown under the control, if any. */
  text?: HintContent;
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
      text: props.hint ?? (props.validationState === 'error' ? formError : undefined),
    };
  }
  if (formError) {
    return { validationState: 'error', text: formError };
  }
  return { validationState: 'none', text: props.hint };
}
