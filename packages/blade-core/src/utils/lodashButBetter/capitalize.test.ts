import { capitalize } from './capitalize';

describe('lodashButBetter/capitalize', () => {
  it('should capitalize strings', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('abc')).toBe('Abc');
    expect(capitalize('aBc')).toBe('ABc');
    expect(capitalize('Abc')).toBe('Abc');
    expect(capitalize('fred')).toBe('Fred');
    expect(capitalize('Fred')).toBe('Fred');
    expect(capitalize('FRED')).toBe('FRED');
    expect(capitalize('-webkit-')).toBe('-webkit-');
    expect(capitalize('')).toBe('');
  });
});

