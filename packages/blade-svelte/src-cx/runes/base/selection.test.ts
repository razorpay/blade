import { describe, it, expect } from 'vitest';
import { sameItem, sameSelection } from './selection';

describe('sameSelection', () => {
  const byCode = (a: { code: string }, b: { code: string }): boolean => a.code === b.code;
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

  it('defaults to sameItem: plain objects alike in every key match, so a $state proxy matches its object', () => {
    const item = { code: 'a' };
    expect(sameSelection()(item, item)).toBe(true);
    expect(sameSelection()(item, { code: 'a' })).toBe(true);
    expect(sameSelection()(item, { code: 'b' })).toBe(false);
    // What a host's `$state` holds: a proxy of the object, not the object.
    const proxied = new Proxy(item, {});
    expect(proxied === item).toBe(false);
    expect(sameSelection()([proxied], [item])).toBe(true);
  });
});

describe('sameItem', () => {
  it('compares primitives by value and plain objects and arrays by their keys, deeply', () => {
    expect(sameItem('upi', 'upi')).toBe(true);
    expect(sameItem(Number.NaN, Number.NaN)).toBe(true);
    expect(sameItem({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(sameItem({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(sameItem([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  it('leaves class instances to identity', () => {
    expect(sameItem(new Date(0), new Date(0))).toBe(false);
    class Bank {
      constructor(readonly code: string) {}
    }
    expect(sameItem(new Bank('a'), new Bank('a'))).toBe(false);
  });
});
