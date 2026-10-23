import { resolveHint } from './hint';
import type { FieldHint } from './hint';
import type { FieldRecord, FormAdapter } from './types';

export interface FieldLine {
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
}

/**
 * The line under every field: the host's hint and validation state, which
 * the form's error for the field replaces while it shows. Follows the form
 * for as long as the template reads the line.
 *
 * `read` returns the host's props; `errorOf` is the field whose error the
 * line mirrors, or what picks the error out of the form (a group's first).
 */
export function createFieldLine(
  form: FormAdapter | undefined,
  read: () => Parameters<typeof resolveHint>[0],
  errorOf: FieldRecord | ((form: FormAdapter) => string | undefined),
): FieldLine {
  const pick =
    typeof errorOf === 'function'
      ? errorOf
      : (adapter: FormAdapter) => (errorOf.name ? adapter.errorOf(errorOf.name) : undefined);
  const hint = $derived(resolveHint(read(), form && pick(form)));
  return {
    get hint() {
      return hint;
    },
  };
}
