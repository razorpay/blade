import { onDestroy, onMount, untrack } from 'svelte';
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

// Node.DOCUMENT_POSITION_PRECEDING, spelled out: there is no `Node` on native.
const PRECEDING = 2;

export interface FieldSetup {
  field: FieldModel;
  /** The enclosing Form's model, when there is one. */
  form: FormModel | undefined;
  /** The edit is already applied to the field: let the form validate on input. */
  notifyInput: (event?: unknown) => void;
  /** Focus left the control: the form validates on blur (deferred). */
  blur: () => void;
}

/**
 * Glue between a field-shaped component and the enclosing Form: creates the
 * field model, registers it (when a Form is present), wires the adapters,
 * and unregisters on destroy. Must run during component init.
 */
export function setupField(
  props: Record<string, unknown>,
  kind: FieldHooks['kind'],
  onValueChange: (value: unknown) => void
): FieldSetup {
  const form = getForm();
  const adapters = getAdapters();

  const field = createField(props, onValueChange, {
    kind,
    store: adapters.fieldStore,
    onTouch: (record) => {
      adapters.track?.('field_change', {
        name: record.name,
        value: record.value,
      });
    },
  });

  let unregister = form?.register(field.record);
  onDestroy(() => {
    unregister?.();
  });

  // Registration order is what "the first invalid field" reads, and a field
  // that mounts late (a conditional block, a `{#key}` remount) registers
  // last. Once it has an element, move it to where it sits in the document.
  // Web only: the native shim has no document order to ask.
  onMount(() => {
    const own = field.record.getHandle?.() as Partial<Node> | undefined;
    if (!form || typeof own?.compareDocumentPosition !== 'function') {
      return;
    }
    const records = form.fields.items;
    let at = 0;
    for (const other of records) {
      const handle = other.getHandle?.() as Node | undefined;
      if (
        other !== field.record &&
        handle &&
        own.compareDocumentPosition(handle) & PRECEDING
      ) {
        at += 1;
      }
    }
    if (at !== records.indexOf(field.record)) {
      unregister?.();
      unregister = form.register(field.record, at);
    }
  });

  return {
    field,
    form,
    notifyInput: (event?: unknown) => {
      form?.handleInput(field.record.name, event).catch((error: unknown) => {
        adapters.captureError?.(error);
      });
    },
    blur: () => {
      if (field.record.name) {
        form?.handleBlur(field.record.name);
      }
    },
  };
}
