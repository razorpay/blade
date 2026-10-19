import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { watch } from '../../test/watch.svelte';
import { createControllable } from './controllable.svelte';

describe('createControllable', () => {
  it('is uncontrolled when the getter yields undefined at construction', () => {
    const onChange = vi.fn();
    const cell = createControllable<number>({ defaultValue: 1, onChange });
    expect(cell.isControlled).toBe(false);
    cell.set(2);
    expect(cell.get()).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2, undefined);
  });

  it('reads through to the host when controlled and still notifies', () => {
    let host = 'a';
    const onChange = vi.fn((next: string) => {
      host = next;
    });
    const cell = createControllable<string>({
      value: () => host,
      defaultValue: 'x',
      onChange,
    });
    expect(cell.isControlled).toBe(true);
    cell.set('b');
    expect(onChange).toHaveBeenCalledWith('b', undefined);
    expect(cell.get()).toBe('b');
    host = 'c';
    expect(cell.get()).toBe('c');
  });

  it('does not notify when unchanged or silent, and honours a custom equality', () => {
    const onChange = vi.fn();
    const cell = createControllable<{ id: number }>({
      defaultValue: { id: 1 },
      equals: (a, b) => a.id === b.id,
      onChange,
    });
    cell.set({ id: 1 });
    cell.set({ id: 2 }, { silent: true });
    expect(onChange).not.toHaveBeenCalled();
    cell.set({ id: 3 }, { meta: 'click' });
    expect(onChange).toHaveBeenCalledWith({ id: 3 }, 'click');
  });

  it('every set reaches whatever reads the value', () => {
    const cell = createControllable<number>({ defaultValue: 0 });
    const seen = watch(() => cell.get());
    cell.set(1);
    flushSync();
    cell.set(2);
    flushSync();
    expect(seen.seen).toEqual([0, 1, 2]);
    seen.stop();
  });
});
