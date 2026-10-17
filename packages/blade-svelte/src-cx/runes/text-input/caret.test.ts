import { describe, it, expect } from 'vitest';
import { caretAfterFormat } from './caret';
import { compileRules } from './format';

// Digits grouped in fours — the shape every card-like spec takes.
const parse = compileRules([['\\D', 'g', '']]);
const format = compileRules([
  ['\\D', 'g', ''],
  ['(\\d{4})(?=\\d)', 'g', '$1 '],
]);

describe('caretAfterFormat', () => {
  it('leaves the caret alone at the end of the raw text', () => {
    expect(caretAfterFormat('4111', 4, parse, format)).toBeNull();
    expect(caretAfterFormat('4111', null, parse, format)).toBeNull();
    expect(caretAfterFormat('4111', 9, parse, format)).toBeNull();
  });

  it('lands after the formatted left half on a mid-string edit', () => {
    // '5' typed after '4111' in '4111 2222': left '41115' formats to '4111 5'.
    expect(caretAfterFormat('41115 2222', 5, parse, format)).toBe(6);
    // Left half short enough to gain no separator.
    expect(caretAfterFormat('411 2222', 3, parse, format)).toBe(3);
  });

  it('drops the caret to the formatted length when the format removes characters', () => {
    // Letters before the caret vanish when parsed.
    expect(caretAfterFormat('41ab11', 4, parse, format)).toBe(2);
  });

  it('handles an empty left half and formats that return nothing', () => {
    expect(caretAfterFormat('x1', 0, parse, format)).toBe(0);
    expect(caretAfterFormat('12', 1, parse, () => null)).toBe(0);
  });
});
