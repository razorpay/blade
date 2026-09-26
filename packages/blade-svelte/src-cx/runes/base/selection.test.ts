import { describe, it, expect, vi } from 'vitest';
import { createSelection, sameSelection } from './selection';

describe('createSelection', () => {
  it('single mode replaces, and toggling the selected item clears unless deselect is off', () => {
    const onChange = vi.fn();
    const s = createSelection<string>({ mode: 'single', onChange });
    s.select('a');
    s.select('b');
    expect(s.single()).toBe('b');
    s.toggle('b');
    expect(s.single()).toBeNull();
    expect(onChange.mock.calls.map((c) => c[0])).toEqual([['a'], ['b'], []]);

    const strict = createSelection<string>({
      mode: 'single',
      allowDeselect: false,
    });
    strict.select('a');
    strict.toggle('a');
    expect(strict.single()).toBe('a');
  });

  it('multiple mode accumulates and compares structurally', () => {
    const s = createSelection<{ id: number }>({
      mode: 'multiple',
      compare: (a, b) => a.id === b.id,
    });
    s.toggle({ id: 1 });
    s.toggle({ id: 2 });
    s.select({ id: 1 });
    expect(s.get().map((v) => v.id)).toEqual([1, 2]);
    expect(s.isSelected({ id: 2 })).toBe(true);
    s.toggle({ id: 1 });
    expect(s.get().map((v) => v.id)).toEqual([2]);
    s.clear();
    expect(s.get()).toEqual([]);
  });

  it('is inert while disabled and follows a controlled host', () => {
    let disabled = true;
    let host: string[] = ['x'];
    const s = createSelection<string>({
      mode: 'single',
      value: () => host,
      disabled: () => disabled,
      onChange: (next) => {
        host = [...next];
      },
    });
    s.select('y');
    expect(host).toEqual(['x']);
    disabled = false;
    s.select('y');
    expect(host).toEqual(['y']);
    host = ['z'];
    expect(s.single()).toBe('z');
  });
});

describe('sameSelection', () => {
  const byCode = (a: { code: string }, b: { code: string }) =>
    a.code === b.code;
  const same = sameSelection(byCode);

  it('compares single items, arrays and nothing with the item compare', () => {
    expect(same({ code: 'a' }, { code: 'a' })).toBe(true);
    expect(same({ code: 'a' }, { code: 'b' })).toBe(false);
    expect(same([{ code: 'a' }], [{ code: 'a' }])).toBe(true);
    expect(same([{ code: 'a' }], [{ code: 'a' }, { code: 'b' }])).toBe(false);
    expect(same(null, undefined)).toBe(true);
    expect(same(null, { code: 'a' })).toBe(false);
    expect(same([{ code: 'a' }], { code: 'a' })).toBe(false);
  });

  it('defaults to identity', () => {
    const item = { code: 'a' };
    expect(sameSelection()(item, item)).toBe(true);
    expect(sameSelection()(item, { code: 'a' })).toBe(false);
  });
});
