import {
  formatChartValueCompact,
  formatChartValueFull,
  formatPercentFull,
} from '../chartValueFormat';

describe('chart value formats, en-IN', () => {
  it.each([
    [0, '₹0'],
    [50000, '₹50K'],
    [150000, '₹1.5L'],
    [12000000, '₹1.2Cr'],
  ])('writes an INR tick %p as %s', (value, text) => {
    expect(formatChartValueCompact(value, { type: 'currency' })).toBe(text);
  });

  it('writes count and percent ticks compact', () => {
    expect(formatChartValueCompact(150000, { type: 'count' })).toBe('1.5L');
    expect(formatChartValueCompact(1500, { type: 'count' })).toBe('1.5K');
    expect(formatChartValueCompact(12.5, { type: 'percent' })).toBe('12.5%');
    expect(formatChartValueCompact(12, { type: 'percent' })).toBe('12%');
  });

  it.each([
    [123450, { type: 'currency' as const }, '₹1,23,450.00'],
    [12000000, { type: 'currency' as const, currency: 'INR' }, '₹1,20,00,000.00'],
    [123450, { type: 'count' as const }, '1,23,450'],
    [1234.567, { type: 'count' as const }, '1,234.57'],
    [12.345, { type: 'percent' as const }, '12.3%'],
  ])('writes %p in full as %s', (value, format, text) => {
    expect(formatChartValueFull(value, format)).toBe(text);
  });

  it('reads a number string, and keeps a value that is not a number', () => {
    expect(formatChartValueFull('123450', { type: 'count' })).toBe('1,23,450');
    expect(formatChartValueFull('n/a', { type: 'count' })).toBe('n/a');
    expect(formatChartValueCompact('n/a', { type: 'currency' })).toBe('n/a');
  });

  it('writes a share with 1 decimal', () => {
    expect(formatPercentFull(57.4585)).toBe('57.5%');
    expect(formatPercentFull(100)).toBe('100.0%');
  });
});
