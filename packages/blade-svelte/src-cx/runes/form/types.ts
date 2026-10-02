import type { ElementHandle } from '../dom/element';

export type FormData = Record<string, unknown>;
export type FormErrors = Record<string, string>;

export type ConstraintCode = 'required' | 'pattern' | 'email';

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
  /** Names the field's inner controls carry (a radio group's name), so the form can attribute their events. */
  aliases?: string[];
  constraints?: FieldConstraints;
  /** The formatted string the user sees; pattern/email checks run on it. */
  getDisplayValue?: () => string;
  getHandle?: () => ElementHandle | undefined;
}

export interface FormSnapshot {
  data: FormData;
  touched: Record<string, unknown>;
  constraintErrors: FormErrors;
}

export interface FormState {
  data: FormData;
  touched: Record<string, unknown>;
  errors: FormErrors;
  submitted: boolean;
  submitting: boolean;
}

export type Validator = (data: FormData) => FormErrors | Promise<FormErrors>;
export type SubmitHandler = (data: FormData, event?: unknown) => unknown;
export type InputHandler = (data: FormData, event?: unknown) => void;

export type SubmitSource = 'button' | 'enter' | 'programmatic';

export interface SubmitMeta {
  source: SubmitSource;
  /** Name of the field or form that triggered the submit (analytics). */
  field?: string;
  /** Platform event, forwarded to onSubmit for backward compatibility. */
  event?: unknown;
}

export interface SubmitResult {
  ok: boolean;
  result?: unknown;
  errors: FormErrors;
}

export interface ValidateResult {
  ok: boolean;
  errors: FormErrors;
  firstInvalid?: string;
}

export type PromiseKind =
  | 'validate'
  | 'submit'
  | 'submit_successful'
  | 'submit_failed';

/** Analytics and error reporting stay outside the model; the anatomy injects them. */
export interface FormHooks {
  onValidate?: (payload: {
    reason?: string;
    name?: string;
    errors: FormErrors;
    data: FormData;
    touched: Record<string, unknown>;
  }) => void;
  onSubmitLogged?: (payload: { data: FormData }) => void;
  onInputLogged?: (payload: { data: FormData }) => void;
  onPromise?: (
    kind: PromiseKind,
    promise?: Promise<unknown>,
    fieldName?: string
  ) => void;
  onError?: (error: unknown) => void;
}

export type ConstraintErrorFormatter = (
  code: ConstraintCode,
  field: FieldRecord
) => string;

export interface FormOptions {
  name: string;
  /** Maps a failed constraint to the message shown; defaults to the code itself. */
  formatConstraintError?: ConstraintErrorFormatter;
  validator?: Validator;
  onSubmit?: SubmitHandler;
  onInput?: InputHandler;
  hooks?: FormHooks;
  /** Anatomy-owned: focus and scroll the first invalid field's handle. */
  revealField?: (handle: ElementHandle, name: string) => void;
  /** Blur validation is deferred by a macrotask so the error line never shifts a CTA under a tap. */
  defer?: (fn: () => void) => void;
}

export interface FormModel {
  name: string;
  /** The registered fields in document order (mount order before mount, and on native). Tracked. */
  fields: { readonly items: readonly FieldRecord[] };
  /**
   * Adds a field; returns its unregister. Ordered reads (`firstInvalid`)
   * follow document order, by the field's `getHandle`, so a field that
   * mounts late (a conditional block, a `{#key}` remount) takes its place.
   */
  register(field: FieldRecord): () => void;
  /** A field's element mounted or moved: re-read document order. */
  reorder(): void;
  hasField(name?: string): boolean;
  collect(): FormSnapshot;
  snapshot(): FormState;
  /** The last published state; tracked by whatever reads it. */
  readonly state: FormState;
  refresh(reason?: string, fieldName?: string): void | Promise<void>;
  handleInput(fieldName?: string, event?: unknown): Promise<void>;
  handleBlur(fieldName: string): void;
  validate(options?: {
    reason?: string;
    name?: string;
  }): Promise<ValidateResult>;
  submit(meta: SubmitMeta): Promise<SubmitResult>;
  setSubmitted(submitted: boolean): void;
  firstInvalid(): { name: string; handle?: ElementHandle } | undefined;
  revealFirstInvalid(): void;
  reset(): void;
}
