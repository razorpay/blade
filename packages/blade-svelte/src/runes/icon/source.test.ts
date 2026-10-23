import { describe, it, expect } from 'vitest';
import { glyph, isGlyph } from './source';

describe('glyph', () => {
  it('is a name and a private-use codepoint', () => {
    expect(glyph('info', '')).toEqual({ name: 'info', code: '' });
  });
});

describe('isGlyph', () => {
  it('is a glyph, not a URL, and not an untyped null', () => {
    expect(isGlyph(glyph('info', ''))).toBe(true);
    expect(isGlyph('/info.svg')).toBe(false);
    expect(isGlyph(null as never)).toBe(false);
  });
});
