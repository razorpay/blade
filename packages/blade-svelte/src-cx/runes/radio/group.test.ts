import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { flushSync } from 'svelte';
import { box } from '../../test/box.svelte';
import type { Box } from '../../test/box.svelte';
import { run } from '../../test/run';
import { createRadioGroup } from './group.svelte';
import type { RadioGroup } from './group.svelte';
import { createRadio } from './radio.svelte';

function group(
  overrides: { value?: string; disabled?: boolean } = {},
): {
  rune: RadioGroup<string>;
  unmount: () => void;
  bound: Box<string | undefined>;
  onChange: Mock;
} {
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
    }),
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
      createRadio(rune, { value: () => 'web', isDisabled: () => false }),
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

  it('reads the pick in document order, not mount order (B3)', () => {
    const { rune, unmount } = group({ value: 'b' });
    const list = document.body.appendChild(document.createElement('div'));
    const first = document.createElement('input');
    const second = document.createElement('input');
    list.append(first, second);
    // Radios register at init, before their elements mount; 'a' registers
    // last (a conditional radio) but sits first.
    let mounted = false;
    const at = (element: HTMLElement) => () => (mounted ? element : undefined);
    rune.register({ value: () => 'b', isDisabled: () => false, getElement: at(second) });
    rune.register({ value: () => 'a', isDisabled: () => false, getElement: at(first) });
    flushSync();
    expect(rune.pick).toEqual({ index: 0, count: 2 });
    // The radios mount and re-read their order (each Radio's attach).
    mounted = true;
    rune.reorder();
    flushSync();
    expect(rune.pick).toEqual({ index: 1, count: 2 });
    list.remove();
    unmount();
  });

  it('counts registered radios in the pick', () => {
    const { rune, unmount } = group({ value: 'b' });
    const radio = (
      value: string,
    ): { value: () => string; isDisabled: () => boolean; getElement: () => undefined } => ({
      value: () => value,
      isDisabled: () => false,
      getElement: () => undefined,
    });
    const undo = rune.register(radio('a'));
    rune.register(radio('b'));
    flushSync();
    expect(rune.pick).toEqual({ index: 1, count: 2 });
    undo();
    flushSync();
    expect(rune.pick).toEqual({ index: 0, count: 1 });
    unmount();
  });
});
