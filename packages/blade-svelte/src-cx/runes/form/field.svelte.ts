import { onDestroy, onMount, untrack } from 'svelte';
import type { ElementHandle } from '../dom/element';
import { createFieldLine } from './field-line.svelte';
import type { FieldHint, HintProps } from './hint';
import { hasOwn } from './object';
import { getAdapters } from '../../adapters';
import { getForm } from './context';
import type { FieldConstraints, FieldRecord, FormModel } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any -- field props are the
   untyped `$$props` bag of the form primitives; typing them is a later step. */
type FieldProps = Record<string, any>;
type Compare = (a: any, b: any) => boolean;
type Parse = (value: any) => any;
type ValueCallback = ((value: any) => void) | undefined;
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface FieldModelRecord extends FieldRecord {
  store?: unknown;
  options?: unknown[];
  parse: Parse;
  compare: Compare;
  format?: Parse;
}

export interface FieldModel {
  record: FieldModelRecord;
  updateProps: (props: FieldProps) => void;
  updateValue: (value: unknown, callback?: ValueCallback) => void;
  touch: () => void;
  setHandle: (getHandle: FieldRecord['getHandle']) => void;
}

/**
 * External key-value store a field may mirror its value into through the
 * `store` prop. The host supplies it; the model never knows the key type.
 */
export interface FieldStore {
  has: (key: unknown) => boolean;
  get: (key: unknown) => unknown;
  set: (key: unknown, value: unknown) => void;
}

export interface FieldHooks {
  onTouch?: (record: FieldModelRecord) => void;
  /** Which control this field renders as; undefined means no constraints. */
  kind?: FieldConstraints['kind'];
  store?: FieldStore;
}

/**
 * Browsers skip constraint validation for disabled, readonly and hidden
 * controls, so those register no constraints at all.
 */
function toConstraints(
  props: FieldProps,
  kind: FieldConstraints['kind'] | undefined
): FieldConstraints | undefined {
  if (!kind || props.disabled || props.readonly || props.type === 'hidden') {
    return undefined;
  }
  let pattern: string | undefined;
  if (props.pattern instanceof RegExp) {
    pattern = props.pattern.source;
  } else if (typeof props.pattern === 'string') {
    pattern = props.pattern;
  }
  return {
    kind,
    required: Boolean(props.required),
    pattern,
    email: props.type === 'email',
  };
}

function toDisplayValue(record: FieldModelRecord): string {
  const shown = record.format ? record.format(record.value) : record.value;
  return shown === null || shown === undefined ? '' : String(shown);
}

export function defaultCompare(v1: unknown, v2: unknown): boolean {
  return v1 === v2;
}

function defaultParse(value: unknown): unknown {
  return value;
}

/**
 * A field's value pipeline: parse the raw value, keep it only if it is one
 * of `options` (when given), write it to the `store` key when one is passed,
 * and notify only when `compare` says the value actually changed. The
 * record is one stable object (the form holds it by identity); its `value`
 * is reactive, so a control drawing the field follows every accepted edit.
 */
export function createField(
  props: FieldProps,
  onValueChange: ValueCallback,
  hooks: FieldHooks = {}
): FieldModel {
  let value = $state.raw<unknown>(null);
  const record: FieldModelRecord = {
    get value() {
      return value;
    },
    set value(next) {
      value = next;
    },
    parse: defaultParse,
    compare: defaultCompare,
  };
  record.getDisplayValue = () => toDisplayValue(record);

  function updateProps(next: FieldProps): void {
    record.name = next.name;
    record.store = next.store;
    record.options = next.options;
    record.parse = next.parse || defaultParse;
    record.compare = next.compare || defaultCompare;
    record.format = typeof next.format === 'function' ? next.format : undefined;
    record.constraints = toConstraints(next, hooks.kind);
  }

  function getValue(value: unknown): unknown {
    const { parse, options, compare } = record;
    let newValue = parse(value);
    if (Array.isArray(options)) {
      const isIncluded = options.some((opt) => compare(opt, newValue));
      if (!isIncluded) {
        newValue = parse(null);
      }
    }
    return newValue;
  }

  // Untracked: a prop sync effect calling this must not follow the value.
  function updateValue(raw: unknown, callback?: ValueCallback): void {
    const newValue = getValue(raw);
    if (
      record.compare(
        newValue,
        untrack(() => value)
      )
    ) {
      return;
    }
    if (record.store) {
      hooks.store?.set(record.store, newValue);
    }
    value = newValue;
    callback?.(newValue);
  }

  const field: FieldModel = {
    record,
    // Unlike `controllable`, which latches controlled-ness at construction,
    // a field re-checks the `value` prop on every update: the form anatomies
    // let a host start rendering before its stores hydrate, so a field may
    // legitimately become controlled mid-life. Deliberate divergence.
    updateProps(next) {
      updateProps(next);
      const inputValue = hasOwn(next, 'value')
        ? next.value
        : untrack(() => value);
      updateValue(inputValue, onValueChange);
    },
    updateValue,
    touch() {
      record.touched = true;
      hooks.onTouch?.(record);
    },
    setHandle(getHandle) {
      record.getHandle = getHandle;
    },
  };

  seedUncontrolledValue(field, props, hooks.store);

  return field;
}

/** An uncontrolled field starts from its store value, else its defaultValue. */
function seedUncontrolledValue(
  field: FieldModel,
  props: FieldProps,
  store: FieldStore | undefined
): void {
  if (hasOwn(props, 'value')) {
    return;
  }
  if (store && props.store !== undefined && store.has(props.store)) {
    field.updateProps({
      ...props,
      value: store.get(props.store) || props.defaultValue,
    });
  } else if (hasOwn(props, 'defaultValue')) {
    field.updateProps({ ...props, value: props.defaultValue });
  }
}

export interface FieldSetup {
  field: FieldModel;
  /** The enclosing Form's model, when there is one. */
  form: FormModel | undefined;
  /** The edit is already applied to the field: let the form validate on input. */
  notifyInput: (event?: unknown) => void;
  /** Focus left the control: the form validates on blur (deferred). */
  blur: () => void;
  /**
   * Keeps the field in step with `props`. The rune runs it as its
   * pre-effect: the first run lands before the template reads the field,
   * so the first paint is already right. This atom holds no effect of its
   * own.
   */
  syncProps: () => void;
  /**
   * Runs a user edit through the field. `apply` hands the field pipeline
   * the callback it calls only when the value changed; that callback runs
   * `accept` (the host's `onValue` and `onChange`), and once `apply`
   * returns the form validates on input — only after a change. Returns
   * what `apply` returned.
   */
  edit<R>(
    apply: (onValue: (value: unknown) => void) => R,
    accept: (value: unknown) => void,
    event?: unknown
  ): R;
}

/**
 * Glue between a field-shaped component and the enclosing Form: creates the
 * field model from `props` (kept in step through `syncProps`), registers it
 * with the form (when there is one) and tells the form where it sits once
 * mounted, wires the adapters, and unregisters on destroy. Must run during
 * component init.
 */
export function setupField(
  props: () => FieldProps,
  kind: FieldHooks['kind'],
  onValueChange: (value: unknown) => void
): FieldSetup {
  const form = getForm();
  const adapters = getAdapters();

  const field = createField(props(), onValueChange, {
    kind,
    store: adapters.fieldStore,
    onTouch: (record) => {
      adapters.track?.('field_change', {
        name: record.name,
        value: record.value,
      });
    },
  });

  if (form) {
    onDestroy(form.register(field.record));
    // The form reads its fields in document order (the first invalid
    // field): once the field has an element, it takes its place.
    onMount(() => form.reorder());
  }

  const notifyInput = (event?: unknown) => {
    form?.handleInput(field.record.name, event).catch((error: unknown) => {
      adapters.captureError?.(error);
    });
  };

  return {
    field,
    form,
    notifyInput,
    syncProps: () => field.updateProps(props()),
    blur: () => {
      if (field.record.name) {
        form?.handleBlur(field.record.name);
      }
    },
    edit(apply, accept, event) {
      let changed = false;
      const result = apply((value) => {
        changed = true;
        accept(value);
      });
      if (changed) {
        notifyInput(event);
      }
      return result;
    },
  };
}

/** The ids a field's label and hint line hang off its host's `$props.id()`. */
export function fieldIds(id: string): { labelId: string; hintId: string } {
  return { labelId: `${id}-label`, hintId: `${id}-hint` };
}

export interface FieldShellOptions {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  kind: FieldHooks['kind'];
  props: () => FieldProps;
  /** The bindable write: every accepted value. */
  onValue: (value: unknown) => void;
  /** The host's state and line; see `createFieldLine`. */
  line: () => HintProps;
  /** What the form focuses when it reveals this field. */
  handle?: () => ElementHandle | undefined;
}

export interface FieldShell extends FieldSetup {
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
  /** The line is an error. */
  readonly isInvalid: boolean;
  readonly labelId: string;
  readonly hintId: string;
}

/**
 * A field with a line under it: `setupField`, the line mirroring this
 * field's visible form error, the ids, and where the form reveals it —
 * what every field-shaped rune (a toggle, a group of choices, a code)
 * starts from. Must run during component init.
 */
export function createFieldShell(options: FieldShellOptions): FieldShell {
  const setup = setupField(options.props, options.kind, options.onValue);
  if (options.handle) {
    setup.field.setHandle(options.handle);
  }
  const line = createFieldLine(setup.form, options.line, setup.field.record);
  return {
    ...setup,
    ...fieldIds(options.id),
    get hint() {
      return line.hint;
    },
    get isInvalid() {
      return line.hint.validationState === 'error';
    },
  };
}
