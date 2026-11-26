import { measureTextWidth, truncateToWidth } from '../utils';

const font = { size: 12, weight: 400, family: 'Inter' };

/** The cut before the binary search: trim one character at a time. */
const linearCut = (text: string, maxWidth: number): string => {
  if (measureTextWidth(text, font) <= maxWidth) return text;
  let end = text.length;
  while (end > 1 && measureTextWidth(`${text.slice(0, end).trimEnd()}…`, font) > maxWidth) {
    end -= 1;
  }
  return `${text.slice(0, end).trimEnd()}…`;
};

describe('truncateToWidth', () => {
  it('keeps a name that fits', () => {
    expect(truncateToWidth('Payments', 200, font)).toBe('Payments');
  });

  it('cuts the same text as the one-character-at-a-time cut', () => {
    const names = [
      'Payment Gateway Settlements',
      'UPI  Autopay   mandates',
      'A very long category name that does not fit',
      'x',
      'ab cd',
    ];
    for (const name of names) {
      for (let maxWidth = 0; maxWidth <= 200; maxWidth += 3) {
        expect(truncateToWidth(name, maxWidth, font)).toBe(linearCut(name, maxWidth));
      }
    }
  });
});
