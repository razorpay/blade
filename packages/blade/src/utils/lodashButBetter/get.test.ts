import get from './get';

describe('lodashButBetter/get', () => {
  it('should get from primitive value', () => {
    expect(get({ a: { b: 2 } }, 'a.b')).toBe(2);
  });

  it('should fallback to default value', () => {
    expect(get({ a: { b: 2 } }, 'a.c', 3)).toBe(3);
  });

  it('should return undefined if no default value', () => {
    expect(get({ a: { b: 2 } }, 'a.c')).toBe(undefined);
  });

  it('should return objects', () => {
    expect(get({ a: { b: 2 } }, 'a')).toEqual({ b: 2 });
  });

  it('should return arrays', () => {
    expect(get({ a: { b: [2] } }, 'a')).toEqual({ b: [2] });
  });

  it('should return undefined if no object', () => {
    expect(get({}, 'a.c')).toBe(undefined);
  });

  it('should return undefined if no path', () => {
    expect(get({ a: { b: 2 } }, '')).toBe(undefined);
  });

  it('should handle 5 deeply nested objects', () => {
    expect(get({ a: { b: { c: { d: { e: 2 } } } } }, 'a.b.c.d.e')).toBe(2);
  });
});
