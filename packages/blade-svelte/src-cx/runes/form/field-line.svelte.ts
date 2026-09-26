import { resolveHint, type FieldHint } from './hint';
import type { FormModel, FormState } from './types';

export interface FieldLine {
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
}

/**
 * The line under every field: the host's hint and validation state, which a
 * visible form error replaces while it lasts. Follows the enclosing Form's
 * state for as long as the template reads the line.
 *
 * `read` returns the host's props; `errorOf` picks this field's visible
 * error out of the form state (`visibleFieldError` for one field,
 * `visibleGroupError` for a group).
 */
export function createFieldLine(
  form: FormModel | undefined,
  read: () => Parameters<typeof resolveHint>[0],
  errorOf: (state: FormState) => string | undefined
): FieldLine {
  const hint = $derived(resolveHint(read(), form && errorOf(form.state)));
  return {
    get hint() {
      return hint;
    },
  };
}
