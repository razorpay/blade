import { fitLabelToWidth, formatSharePercentage, truncateTextToWidth } from '../labelUtils';

// A deterministic measurer: every character is 10 units wide, so widths are easy to reason about.
const measureByLength = (text: string): number => text.length * 10;

describe('formatSharePercentage', () => {
  it('rounds whole shares to the nearest integer', () => {
    expect(formatSharePercentage(12.4)).toBe('12');
    expect(formatSharePercentage(12.5)).toBe('13');
    expect(formatSharePercentage(100)).toBe('100');
  });

  it('renders shares between 0 and 1 as <1 instead of 0', () => {
    expect(formatSharePercentage(0.4)).toBe('<1');
    expect(formatSharePercentage(0.99)).toBe('<1');
  });

  it('keeps an exact 1 percent share as 1', () => {
    expect(formatSharePercentage(1)).toBe('1');
  });

  it('renders zero, negative and non-finite shares as 0', () => {
    expect(formatSharePercentage(0)).toBe('0');
    expect(formatSharePercentage(-3)).toBe('0');
    expect(formatSharePercentage(NaN)).toBe('0');
  });
});

describe('truncateTextToWidth', () => {
  it('returns the text unchanged when it fits', () => {
    expect(truncateTextToWidth('Netbanking', 100, measureByLength)).toBe('Netbanking');
  });

  it('trims the text and appends an ellipsis so the result fits the width', () => {
    // 6 characters fit in 60 units: 5 letters + the ellipsis.
    expect(truncateTextToWidth('Netbanking', 60, measureByLength)).toBe('Netba…');
    expect(measureByLength('Netba…')).toBeLessThanOrEqual(60);
  });

  it('returns only an ellipsis when not even one character fits alongside it', () => {
    expect(truncateTextToWidth('Netbanking', 15, measureByLength)).toBe('…');
  });

  it('returns an ellipsis for a zero or negative width', () => {
    expect(truncateTextToWidth('Netbanking', 0, measureByLength)).toBe('…');
    expect(truncateTextToWidth('Netbanking', -5, measureByLength)).toBe('…');
  });

  it('returns an empty string unchanged', () => {
    expect(truncateTextToWidth('', 50, measureByLength)).toBe('');
  });

  it('leaves the text untouched when the measurer cannot distinguish string lengths', () => {
    // Mirrors the canvas-less fallback in calculateTextWidth, which reports a fixed width.
    const constantMeasure = (): number => 80;
    expect(truncateTextToWidth('Netbanking', 60, constantMeasure)).toBe('Netbanking');
  });
});

describe('fitLabelToWidth', () => {
  it('keeps both parts whole when they fit the budget', () => {
    const fitted = fitLabelToWidth({
      name: 'UPI',
      valueText: '4k txn  (40%)',
      maxContentWidth: 200,
      gap: 4,
      measureName: measureByLength,
      measureValue: measureByLength,
    });
    expect(fitted).toEqual({
      name: 'UPI',
      valueText: '4k txn  (40%)',
      nameWidth: 30,
      valueWidth: 130,
    });
  });

  it('keeps the value text whole and truncates the name to absorb the overflow', () => {
    const fitted = fitLabelToWidth({
      name: 'Netbanking through corporate accounts',
      valueText: '4k txn  (40%)', // 130 units
      maxContentWidth: 200,
      gap: 4,
      measureName: measureByLength,
      measureValue: measureByLength,
    });
    // Budget for the name: 200 - 4 - 130 = 66 units → 5 characters + ellipsis.
    expect(fitted.valueText).toBe('4k txn  (40%)');
    expect(fitted.name).toBe('Netba…');
    expect(fitted.nameWidth + 4 + fitted.valueWidth).toBeLessThanOrEqual(200);
  });

  it('reduces the name to an ellipsis and truncates the value when the value alone overflows', () => {
    const fitted = fitLabelToWidth({
      name: 'UPI',
      valueText: '1,23,45,678 transactions  (100%)', // 320 units
      maxContentWidth: 200,
      gap: 4,
      measureName: measureByLength,
      measureValue: measureByLength,
    });
    expect(fitted.name).toBe('…');
    expect(fitted.valueText.endsWith('…')).toBe(true);
    expect(fitted.nameWidth + 4 + fitted.valueWidth).toBeLessThanOrEqual(200);
  });
});
