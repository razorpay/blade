import { getColumnPosition, parseNumericText } from '../odometerUtils';

describe('parseNumericText', () => {
  it('should give each digit the power of ten it stands for', () => {
    const parsed = parseNumericText('123');
    expect(parsed?.slots).toEqual([
      { type: 'digit', place: 2 },
      { type: 'digit', place: 1 },
      { type: 'digit', place: 0 },
    ]);
    expect(parsed?.lowestPlace).toBe(0);
  });

  it('should count decimal places downwards from the point', () => {
    const parsed = parseNumericText('1.25');
    expect(parsed?.slots).toEqual([
      { type: 'digit', place: 0 },
      { type: 'literal', char: '.' },
      { type: 'digit', place: -1 },
      { type: 'digit', place: -2 },
    ]);
    expect(parsed?.lowestPlace).toBe(-2);
  });

  it('should keep a currency symbol and a unit as literals around the digits', () => {
    // The point of working off formatted text: a prefix or suffix rides along untouched
    // instead of forcing the whole value to swap.
    expect(parseNumericText('₹12')?.slots).toEqual([
      { type: 'literal', char: '₹' },
      { type: 'digit', place: 1 },
      { type: 'digit', place: 0 },
    ]);
    expect(parseNumericText('50%')?.slots).toEqual([
      { type: 'digit', place: 1 },
      { type: 'digit', place: 0 },
      { type: 'literal', char: '%' },
    ]);
  });

  it('should not mistake a thousands separator for a decimal point', () => {
    const parsed = parseNumericText('1.200');
    // Every digit is an integer digit, so the lowest place is the units.
    expect(parsed?.lowestPlace).toBe(0);
  });

  it('should return null when there is nothing to roll', () => {
    expect(parseNumericText('draft')).toBeNull();
    expect(parseNumericText('')).toBeNull();
  });

  describe('the number the text spells out', () => {
    it('should read the digits that are actually printed, not the value behind them', () => {
      // `formatValue={(v) => `₹${v / 1000}k`}` prints ₹3k for 3000. Driving the column from
      // 3000 lands it on 3000 % 10, which is why the indicator read ₹0k.
      expect(parseNumericText('₹3k')?.value).toBe(3);
    });

    it('should ignore separators and units', () => {
      expect(parseNumericText('₹1,200')?.value).toBe(1200);
      expect(parseNumericText('50%')?.value).toBe(50);
    });

    it('should keep decimals exact rather than drifting through powers of ten', () => {
      expect(parseNumericText('33.33')?.value).toBe(33.33);
      expect(parseNumericText('99.99')?.value).toBe(99.99);
    });

    it('should take a leading minus as part of the number', () => {
      expect(parseNumericText('-12')?.value).toBe(-12);
    });
  });
});

describe('getColumnPosition', () => {
  it('should sit exactly on a digit when the value is at rest', () => {
    expect(getColumnPosition(12, 0, 0)).toBeCloseTo(2);
    expect(getColumnPosition(12, 1, 0)).toBeCloseTo(1);
  });

  it('should roll the lowest place smoothly through a change', () => {
    expect(getColumnPosition(12.5, 0, 0)).toBeCloseTo(2.5);
  });

  it('should hold a higher place still until the places below it are wrapping', () => {
    // A tens column parked a fifth of the way towards the next digit would make a resting
    // `12` unreadable.
    expect(getColumnPosition(12.5, 1, 0)).toBeCloseTo(1);
    expect(getColumnPosition(19.5, 1, 0)).toBeCloseTo(1.5);
    expect(getColumnPosition(20, 1, 0)).toBeCloseTo(2);
  });

  it('should keep a resting decimal crisp rather than half carried', () => {
    // 99.99 is 99.9% of the way to 100, so a carry measured against the tens would print
    // `00.99` while the value simply sits there.
    expect(getColumnPosition(99.99, 1, -2)).toBeCloseTo(9);
    expect(getColumnPosition(99.99, 0, -2)).toBeCloseTo(9);
    expect(getColumnPosition(99.99, -2, -2)).toBeCloseTo(9);
  });

  it('should carry a decimal value over its final step', () => {
    expect(getColumnPosition(99.995, 1, -2)).toBeCloseTo(9.5);
    expect(getColumnPosition(100, 1, -2)).toBeCloseTo(0);
  });

  it('should read a negative value by its magnitude', () => {
    // The sign is a literal slot of its own, so the columns only deal in magnitude.
    expect(getColumnPosition(-12, 0, 0)).toBeCloseTo(2);
  });
});
