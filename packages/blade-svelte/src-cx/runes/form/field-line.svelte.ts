import { resolveHint, visibleFieldError, type FieldHint } from './hint';
import type { FieldRecord, FormModel, FormState } from './types';

export interface FieldLine {
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
}

/**
 * The line under every field: the host's hint and validation state, which a
 * visible form error replaces while it lasts. Follows the enclosing Form's
 * state for as long as the template reads the line.
 *
 * `read` returns the host's props; `errorOf` is the field whose visible
 * error the line mirrors, or what picks the error out of the form state
 * (`visibleGroupError` for a group).
 */
export function createFieldLine(
  form: FormModel | undefined,
  read: () => Parameters<typeof resolveHint>[0],
  errorOf: FieldRecord | ((state: FormState) => string | undefined)
): FieldLine {
  const pick =
    typeof errorOf === 'function'
      ? errorOf
      : (state: FormState) => visibleFieldError(errorOf, state);
  const hint = $derived(resolveHint(read(), form && pick(form.state)));
  return {
    get hint() {
      return hint;
    },
  };
}
