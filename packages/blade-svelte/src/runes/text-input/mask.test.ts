import { describe, it, expect } from 'vitest';
import { applyMask, maskEdit, maskValue, stripMask } from './mask';

// React's useFormattedInput, case by case.
describe('format masks', () => {
  it('lays typed characters into the pattern, up to the next `#`', () => {
    expect(applyMask('1234', '##/##')).toBe('12/34');
    expect(applyMask('123', '##/##')).toBe('12/3');
    // The delimiter after the last typed character shows already.
    expect(applyMask('12', '##/##')).toBe('12/');
    expect(applyMask('41111111', '#### #### #### ####')).toBe('4111 1111 ');
    // A delimiter before the first `#` shows on an empty field.
    expect(applyMask('', '(###) ###-####')).toBe('(');
  });

  it('keeps letters and digits only', () => {
    expect(stripMask('12/34')).toBe('1234');
    expect(maskValue('4111-1111 1111', '#### #### ####')).toBe('4111 1111 1111');
    expect(maskValue(null, '##/##')).toBe('');
  });

  it('steps the caret over a delimiter that was already there', () => {
    // `9` typed after the `1` of `12/45`.
    expect(maskEdit('12/45', '192/45', 2, '##/##')).toEqual({ value: '19/24', caret: 3 });
    expect(maskEdit('12/', '12/3', 4, '##/##')).toEqual({ value: '12/3', caret: 4 });
  });

  it('leaves the caret to the platform at the end of a section', () => {
    expect(maskEdit('1', '12', 2, '##/##')).toEqual({ value: '12/', caret: null });
  });

  it('deletes the character before a deleted delimiter', () => {
    expect(maskEdit('12/34', '1234', 2, '##/##')).toEqual({ value: '13/4', caret: 1 });
  });
});
