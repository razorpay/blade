import get from './get';

describe('lodashButBetter/get', () => {
  it('should get from primitive value', () => {
    expect(get({ a: { b: 2 } }, 'a.b')).toBe(2);
  });

  it('should fallback to default value', () => {
    // @ts-expect-error
    expect(get({ a: { b: 2 } }, 'a.c', 3)).toBe(3);
  });

  it('should return undefined if no default value', () => {
    // @ts-expect-error
    expect(get({ a: { b: 2 } }, 'a.c')).toBe(undefined);
  });

  it('should return objects', () => {
    // @ts-expect-error
    expect(get({ a: { b: 2 } }, 'a')).toEqual({ b: 2 });
  });

  it('should return arrays', () => {
    // @ts-expect-error
    expect(get({ a: { b: [2] } }, 'a')).toEqual({ b: [2] });
  });

  it('should return undefined if no object', () => {
    // @ts-expect-error
    expect(get({}, 'a.c')).toBe(undefined);
  });

  it('should return undefined if no path', () => {
    // @ts-expect-error
    expect(get({ a: { b: 2 } }, '')).toBe(undefined);
  });

  it('should handle 5 deeply nested objects', () => {
    expect(get({ a: { b: { c: { d: { e: 2 } } } } }, 'a.b.c.d.e')).toBe(2);
  });
});
