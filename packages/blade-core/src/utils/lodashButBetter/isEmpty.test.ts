import isEmpty from './isEmpty';

describe('lodashButBetter/isEmpty', () => {
  it('cases', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(1)).toBe(true);
    expect(isEmpty(NaN)).toBe(true);
    expect(isEmpty(/x/)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty({})).toBe(true);

    expect(isEmpty('a')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty(new Map([['a', 1]]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty([0])).toBe(false);
    expect(isEmpty({ a: 0 })).toBe(false);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty({ length: 0 })).toBe(false);
    expect(isEmpty({ length: '0' })).toBe(false);
  });
});

