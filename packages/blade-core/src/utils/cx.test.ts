import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class strings', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('filters false and undefined', () => {
    expect(cx('a', false, undefined, 'b')).toBe('a b');
  });

  it('returns empty string when all values are falsy', () => {
    expect(cx(false, undefined)).toBe('');
  });
});
