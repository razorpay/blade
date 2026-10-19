/** Error messages by field name. */
export type FormErrors = Record<string, string>;

/** Declarative constraints, evaluated in JS with browser semantics. */
export interface FieldConstraints {
  kind: 'text' | 'checkbox' | 'radio';
  required?: boolean;
  /** Body of an HTML `pattern` attribute (anchored to the whole value). */
  pattern?: string;
  /** `type="email"` */
  email?: boolean;
}

/**
 * What a field hands the form when it registers. `value` and `touched` are
 * mutated in place by the field; the form only reads them when it recomputes.
 * A field's `value` is reactive (`createField`); `touched` is not, on
 * purpose: blur validation is deferred, and the error line must not move
 * before the form publishes.
 */
export interface FieldRecord {
  name?: string;
  value: unknown;
  touched?: boolean;
  constraints?: FieldConstraints;
  /** The formatted string the user sees; pattern/email checks run on it. */
  getDisplayValue?: () => string;
  /**
   * The field's element once mounted, else undefined: its place in the
   * document. A form that wants its fields in document order (the first
   * invalid one) sorts by `compareDocumentPosition` when it reads them.
   */
  element(): HTMLElement | undefined;
  /**
   * Shows the field: focuses its control without scrolling, then scrolls it
   * to the middle of the view — smoothly, unless the user prefers reduced
   * motion. A composite field focuses its part that takes input (an OTP's
   * first empty cell, a CardGroup's control). A no-op before mount.
   */
  reveal(): void;
}

/** What a submit or a validation found: no errors, or the errors by field. */
export interface FormVerdict {
  ok: boolean;
  errors: FormErrors;
}

/**
 * The app's form, as Blade's fields and buttons see it: what they register
 * with, report edits to, and ask before acting. Validation, when an error
 * shows, submission and revealing the first invalid field are the form's —
 * Blade only displays and asks. An app's Form hands one to the fields under
 * it as `adapters.form` (a BladeProvider around them).
 */
export interface FormAdapter {
  /** A field mounted; returns its unregister. */
  register(field: FieldRecord): () => void;
  /** A user edit changed the field's value. */
  input(name: string | undefined, event?: unknown): void;
  /** Focus left the field. */
  blur(name: string): void;
  /**
   * The error the field shows now, if any — the form decides when one
   * shows (once touched, after a submit). Tracked: the line follows it.
   */
  errorOf(name: string): string | undefined;
  /** A submission is in flight: submit buttons show busy. Tracked. */
  readonly isSubmitting: boolean;
  /** A submit button was pressed: validate, then submit. */
  submit(event?: unknown): Promise<FormVerdict>;
  /** A `validateForm` button was pressed: validate only. */
  validate(): Promise<FormVerdict>;
  /**
   * A press found errors: the form reports them and reveals the first
   * invalid field (its record's `reveal()`).
   */
  invalid(errors: FormErrors): void;
}
