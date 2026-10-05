import { describe, it, expect, vi } from 'vitest';
import { createField, defaultCompare } from './field.svelte';
import type { FieldStore } from './field.svelte';

// In-memory stand-in for the host's key-value store (v2 passes its global store).
function memoryStore(): FieldStore & { entries: Map<unknown, unknown> } {
  const entries = new Map<unknown, unknown>();
  return {
    entries,
    has: (key) => entries.has(key),
    get: (key) => entries.get(key),
    set: (key, value) => {
      entries.set(key, value);
    },
  };
}

describe('createField', () => {
  it('parses values and notifies only when the parsed value changes', () => {
    const onChange = vi.fn();
    const field = createField({ name: 'amount', parse: Number }, undefined);

    field.updateProps({ name: 'amount', parse: Number });
    field.updateValue('10', onChange);
    field.updateValue('10', onChange);
    field.updateValue('12', onChange);

    expect(onChange.mock.calls).toEqual([[10], [12]]);
    expect(field.record.value).toBe(12);
  });

  it('resets a value that is not one of the allowed options', () => {
    const options = [{ id: 'a' }, { id: 'b' }];
    const compare = (a: { id: string } | null, b: { id: string } | null): boolean =>
      a?.id === b?.id;
    const field = createField({ name: 'bank', options, compare }, undefined);
    field.updateProps({ name: 'bank', options, compare });

    field.updateValue({ id: 'b' });
    expect(field.record.value).toEqual({ id: 'b' });

    field.updateValue({ id: 'zzz' });
    expect(field.record.value).toBeNull();
  });

  it('writes accepted values to the store key through the injected store', () => {
    const store = memoryStore();
    const key = 'vpa-key';
    const field = createField({ name: 'vpa', store: key }, undefined, {
      store,
    });
    field.updateProps({ name: 'vpa', store: key });

    field.updateValue('me@upi');

    expect(store.entries.get(key)).toBe('me@upi');
  });

  it('holds the value locally when no store is injected', () => {
    const field = createField({ name: 'vpa', store: 'k' }, undefined);
    field.updateProps({ name: 'vpa', store: 'k' });
    field.updateValue('me@upi');
    expect(field.record.value).toBe('me@upi');
  });

  it('seeds the initial value from the store, then defaultValue, unless value is controlled', () => {
    const store = memoryStore();
    store.set('seeded', 'from-store');

    expect(
      createField({ name: 'a', store: 'seeded', defaultValue: 'd' }, undefined, { store }).record
        .value,
    ).toBe('from-store');
    expect(
      createField({ name: 'b', store: 'empty', defaultValue: 'd' }, undefined, {
        store,
      }).record.value,
    ).toBe('d');
    expect(
      createField({ name: 'c', defaultValue: 'd', value: 'controlled' }, undefined).record.value,
    ).toBeNull();
  });

  it('calls the value callback when props seed a value', () => {
    const onValueChange = vi.fn();
    createField({ name: 'a', defaultValue: 'd' }, onValueChange);
    expect(onValueChange).toHaveBeenCalledWith('d');
  });

  it('touch marks the record touched and reports it', () => {
    const onTouch = vi.fn();
    const field = createField({ name: 'a' }, undefined, { onTouch });

    field.touch();

    expect(field.record.touched).toBe(true);
    expect(onTouch).toHaveBeenCalledWith(field.record);
  });

  it('defaultCompare is strict equality', () => {
    expect(defaultCompare(1, 1)).toBe(true);
    expect(defaultCompare('1', 1)).toBe(false);
  });
});

describe('createField constraints', () => {
  const props = (extra: Record<string, unknown>): { name: string } => ({ name: 'f', ...extra });

  it('derives constraints from the control props', () => {
    const field = createField(props({}), undefined, { kind: 'text' });
    field.updateProps(props({ required: true, pattern: /\d+/, type: 'email' }));
    expect(field.record.constraints).toEqual({
      kind: 'text',
      required: true,
      pattern: '\\d+',
      email: true,
    });
  });

  it('registers no constraints for disabled, readonly or hidden controls, or without a kind', () => {
    const field = createField(props({}), undefined, { kind: 'text' });
    field.updateProps(props({ required: true, disabled: true }));
    expect(field.record.constraints).toBeUndefined();
    field.updateProps(props({ required: true, readonly: true }));
    expect(field.record.constraints).toBeUndefined();
    field.updateProps(props({ required: true, type: 'hidden' }));
    expect(field.record.constraints).toBeUndefined();

    const button = createField(props({ required: true }), undefined);
    button.updateProps(props({ required: true }));
    expect(button.record.constraints).toBeUndefined();
  });

  it('displays the formatted value and exposes the handle lazily', () => {
    const field = createField(props({}), undefined, { kind: 'text' });
    field.updateProps(props({ format: (v: string) => v.replace(/(\d{4})(?=\d)/g, '$1 ') }));
    field.updateValue('41111111');
    expect(field.record.getDisplayValue?.()).toBe('4111 1111');

    const holder: { handle?: { focus: () => void } } = {};
    field.setHandle(() => holder.handle as never);
    expect(field.record.getHandle?.()).toBeUndefined();
    holder.handle = { focus: () => undefined };
    expect(field.record.getHandle?.()).toBe(holder.handle);
  });
});
