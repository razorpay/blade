import { isPromise } from '../base/promise';
import { isEmptyObject, unflatten } from './object';
import { createOrderedEntries } from '../base/ordered-entries.svelte';
import { evaluateConstraints } from './constraints';
import type {
  ConstraintErrorFormatter,
  FieldRecord,
  FormErrors,
  FormModel,
  FormOptions,
  FormSnapshot,
  FormState,
  SubmitMeta,
  SubmitResult,
  ValidateResult,
} from './types';

const codeAsMessage: ConstraintErrorFormatter = (code) => code;

/**
 * Flatten registered fields into nested `data` / `touched` (names like
 * `card.number` unflatten) and a flat map of constraint errors, evaluated
 * here with browser semantics. A field without a name contributes nothing.
 */
export function collectFormData(
  fields: Iterable<FieldRecord>,
  submitted: boolean,
  formatConstraintError: ConstraintErrorFormatter = codeAsMessage,
): FormSnapshot {
  const data: Record<string, unknown> = {};
  const touches: Record<string, unknown> = {};
  const constraintErrors: FormErrors = {};
  for (const field of fields) {
    const { name, value, touched } = field;
    if (name) {
      data[name] = value;
      touches[name] = submitted || Boolean(touched);
      const code = evaluateConstraints(field);
      if (code) {
        constraintErrors[name] = formatConstraintError(code, field);
      }
    }
  }
  return {
    data: unflatten(data),
    touched: unflatten(touches),
    constraintErrors,
  };
}

const defaultDefer = (fn: () => void): void => {
  setTimeout(fn);
};

/**
 * The form model: owns the field registry, validation and submission, and
 * nothing platform-specific. Validation merges browser constraint errors with
 * the consumer's validator (validator wins per key). Only the newest async
 * validation result is applied.
 */
export function createForm(options: FormOptions): FormModel {
  const hooks = options.hooks ?? {};
  const defer = options.defer ?? defaultDefer;
  const formatConstraintError = options.formatConstraintError ?? codeAsMessage;
  // Document order, by each field's handle: the order "the first invalid
  // field" reads. Native handles cannot be compared: mount order it is.
  const entries = createOrderedEntries<{
    record: FieldRecord;
    getElement: () => HTMLElement | undefined;
  }>();
  const records = $derived(entries.ordered.map((entry) => entry.record));
  const fields = {
    get items() {
      return records;
    },
  };

  let errors: FormErrors = {};
  let submitted = false;
  let submitting = false;
  let refreshId = 0;
  let current = collectFormData(fields.items, submitted, formatConstraintError);

  const toState = (): FormState => ({
    data: current.data,
    touched: current.touched,
    errors,
    submitted,
    submitting,
  });
  let state = $state.raw<FormState>(toState());

  function publish(): void {
    state = toState();
  }

  function collect(): FormSnapshot {
    current = collectFormData(fields.items, submitted, formatConstraintError);
    return current;
  }

  function applyErrors(
    constraintErrors: FormErrors,
    validationErrors: FormErrors | undefined,
    track: () => void,
  ): void {
    errors = { ...constraintErrors, ...validationErrors };
    publish();
    track();
  }

  function refresh(reason?: string, fieldName?: string): void | Promise<void> {
    const { data, constraintErrors, touched } = collect();
    const track = (): void => {
      hooks.onValidate?.({ reason, name: fieldName, errors, data, touched });
    };

    if (!options.validator) {
      applyErrors(constraintErrors, undefined, track);
      return undefined;
    }

    const currentRefreshId = ++refreshId;
    const validationErrors = options.validator(data);
    if (isPromise<FormErrors>(validationErrors)) {
      hooks.onPromise?.('validate', validationErrors, fieldName);
      return validationErrors
        .then((resolved) => {
          // Discard stale results when a newer refresh has been triggered.
          if (currentRefreshId === refreshId) {
            applyErrors(constraintErrors, resolved, track);
          }
        })
        .catch((error: unknown) => {
          hooks.onError?.(error);
        });
    }
    applyErrors(constraintErrors, validationErrors, track);
    return undefined;
  }

  function firstInvalid(): ReturnType<FormModel['firstInvalid']> {
    for (const field of fields.items) {
      if (field.name && errors[field.name]) {
        return { name: field.name, handle: field.getHandle?.() };
      }
    }
    return undefined;
  }

  async function validate(
    validateOptions: { reason?: string; name?: string } = {},
  ): Promise<ValidateResult> {
    submitted = true;
    await refresh(validateOptions.reason, validateOptions.name);
    return {
      ok: isEmptyObject(errors),
      errors,
      firstInvalid: firstInvalid()?.name,
    };
  }

  function trackSubmission(result: Promise<unknown>): void {
    hooks.onPromise?.('submit', result);
    submitting = true;
    publish();
    result
      .then(() => {
        hooks.onPromise?.('submit_successful');
      })
      .catch(() => {
        hooks.onPromise?.('submit_failed');
      })
      .finally(() => {
        submitting = false;
        publish();
      });
  }

  async function submit(meta: SubmitMeta): Promise<SubmitResult> {
    submitted = true;
    await refresh('submit', meta.field);
    if (!isEmptyObject(errors)) {
      return { ok: false, errors };
    }
    hooks.onSubmitLogged?.({ data: current.data });
    const result = options.onSubmit?.(current.data, meta.event);
    if (isPromise(result)) {
      trackSubmission(result);
    }
    return { ok: true, result, errors };
  }

  async function handleInput(fieldName?: string, event?: unknown): Promise<void> {
    await refresh('input', fieldName);
    options.onInput?.(current.data, event);
    hooks.onInputLogged?.({ data: current.data });
  }

  function handleBlur(fieldName: string): void {
    defer(() => {
      void refresh('blur', fieldName);
    });
  }

  function reset(): void {
    submitted = false;
    errors = {};
    for (const field of fields.items) {
      field.touched = false;
    }
    collect();
    publish();
  }

  return {
    name: options.name,
    fields,
    register(field) {
      return entries.register({
        record: field,
        getElement: () => field.getHandle?.() as HTMLElement | undefined,
      });
    },
    reorder: () => entries.reorder(),
    hasField(name) {
      if (!name) {
        return false;
      }
      for (const field of fields.items) {
        if (field.name === name || field.aliases?.includes(name)) {
          return true;
        }
      }
      return false;
    },
    collect,
    snapshot: toState,
    get state() {
      return state;
    },
    refresh,
    handleInput,
    handleBlur,
    validate,
    submit,
    setSubmitted(value) {
      submitted = value;
    },
    firstInvalid,
    revealFirstInvalid() {
      const hit = firstInvalid();
      if (hit?.handle) {
        options.revealField?.(hit.handle, hit.name);
      }
    },
    reset,
  };
}
