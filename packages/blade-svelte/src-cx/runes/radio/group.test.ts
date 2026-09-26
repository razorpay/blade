import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { box } from '../../test/box.svelte';
import { run } from '../../test/run';
import { createField } from '../form/field.svelte';
import { createRadioGroup, createRadioGroupModel } from './group.svelte';
import { createRadio } from './radio.svelte';

function group(overrides: { value?: string; disabled?: boolean } = {}) {
  const value = box<string | undefined>(overrides.value);
  const isDisabled = box(Boolean(overrides.disabled));
  const onChange = vi.fn();
  const ran = run(() =>
    createRadioGroup<string>({
      id: 'g',
      name: () => undefined,
      value: () => value.value,
      onValue: (next) => {
        value.value = next;
      },
      onChange,
      isDisabled: () => isDisabled.value,
      isRequired: () => false,
      validationState: () => undefined,
      hint: () => undefined,
      shared: () => 'parts',
    })
  );
  return { rune: ran.value, unmount: ran.unmount, bound: value, onChange };
}

describe('createRadioGroup', () => {
  it('names the radios after the id when no name is given, and hands them the shared payload', () => {
    const { rune, unmount } = group();
    expect(rune.name).toBe('g');
    expect(rune.shared).toBe('parts');
    expect(rune.labelId).toBe('g-label');
    unmount();
  });

  it('a pick writes the value, reports onChange and moves the pick', () => {
    const { rune, onChange, unmount } = group();
    const { value: radio } = run(() =>
      createRadio(rune, { value: () => 'web', isDisabled: () => false })
    );
    expect(radio.isSelected).toBe(false);
    const held = rune.select('web', new Event('change'));
    flushSync();
    expect(held).toBe(true);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('web');
    expect(rune.picked).toBe('web');
    expect(radio.isSelected).toBe(true);
    expect(radio.pick).toBe('picked');
    unmount();
  });

  it('follows a value set from the outside', () => {
    const { rune, bound, unmount } = group({ value: 'qr' });
    expect(rune.isSelected('qr')).toBe(true);
    bound.value = 'web';
    flushSync();
    expect(rune.picked).toBe('web');
    unmount();
  });

  it('a disabled group refuses a pick', () => {
    const { rune, onChange, unmount } = group({
      value: 'qr',
      disabled: true,
    });
    expect(rune.select('web', new Event('change'))).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(rune.picked).toBe('qr');
    unmount();
  });

  it('counts registered radios in the pick', () => {
    const { rune, unmount } = group({ value: 'b' });
    const undo = rune.register('a', () => undefined);
    rune.register('b', () => undefined);
    flushSync();
    expect(rune.pick).toEqual({ index: 1, count: 2 });
    undo();
    flushSync();
    expect(rune.pick).toEqual({ index: 0, count: 1 });
    unmount();
  });
});

function flowField(props: Record<string, unknown> = {}, onTouch = vi.fn()) {
  const field = createField(props, undefined, { kind: 'radio', onTouch });
  field.updateProps({ name: 'flow', ...props });
  return { field, onTouch };
}

describe('createRadioGroupModel', () => {
  it('a pick updates the field, notifies and counts as a visit', () => {
    const { field, onTouch } = flowField();
    const group = createRadioGroupModel(field);
    const onValue = vi.fn();

    expect(group.value()).toBeUndefined();
    expect(group.select('qr', onValue)).toBe(true);

    expect(field.record.value).toBe('qr');
    expect(field.record.touched).toBe(true);
    expect(onValue).toHaveBeenCalledWith('qr');
    expect(onTouch).toHaveBeenCalledTimes(1);
    expect(group.isSelected('qr')).toBe(true);
    expect(group.isSelected('web')).toBe(false);
  });

  it('moves the one value from radio to radio', () => {
    const { field } = flowField({ defaultValue: 'qr' });
    const group = createRadioGroupModel(field);
    expect(group.value()).toBe('qr');
    group.select('web');
    expect(group.isSelected('qr')).toBe(false);
    expect(group.value()).toBe('web');
  });

  it('refuses while disabled and leaves the field untouched', () => {
    const { field, onTouch } = flowField({ defaultValue: 'qr' });
    const group = createRadioGroupModel(field, { disabled: () => true });

    expect(group.select('web')).toBe(false);
    expect(group.value()).toBe('qr');
    expect(field.record.touched).toBeFalsy();
    expect(onTouch).not.toHaveBeenCalled();
  });
});
