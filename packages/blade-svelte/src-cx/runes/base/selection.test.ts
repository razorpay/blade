import { describe, it, expect, vi } from 'vitest';
import { sameSelection } from './selection';

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
