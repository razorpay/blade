import { describe, it, expect } from 'vitest';
import { glyph } from './source';

describe('glyph', () => {
  it('is a name and a private-use codepoint', () => {
    expect(glyph('info', '')).toEqual({ name: 'info', code: '' });
  });
});
