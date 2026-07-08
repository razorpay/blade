import { getHumanizedDate } from '../utils';

describe('getHumanizedDate', () => {
  const locale = 'en';

  it('should format a single date with the year', () => {
    const result = getHumanizedDate({
      date: new Date(2026, 5, 7),
      locale,
      selectionType: 'single',
    });

    expect(result).toBe('7 Jun 2026');
  });

  it('should format a same-year range without repeating the year on the start date', () => {
    const result = getHumanizedDate({
      date: [new Date(2026, 5, 7), new Date(2026, 5, 12)],
      locale,
      selectionType: 'range',
    });

    expect(result).toBe('7 Jun - 12 Jun 2026');
  });

  it('should format a cross-year range with the year on both dates', () => {
    const result = getHumanizedDate({
      date: [new Date(2025, 11, 28), new Date(2026, 0, 3)],
      locale,
      selectionType: 'range',
    });

    expect(result).toBe('28 Dec 2025 - 3 Jan 2026');
  });

  it('should format a range with only the start date selected', () => {
    const result = getHumanizedDate({
      date: [new Date(2026, 5, 7), null],
      locale,
      selectionType: 'range',
    });

    expect(result).toBe('7 Jun 2026');
  });

  it('should return an empty string when the date is null', () => {
    const result = getHumanizedDate({
      date: null,
      locale,
      selectionType: 'range',
    });

    expect(result).toBe('');
  });

  it('should return an empty string for an empty range', () => {
    const result = getHumanizedDate({
      date: [null, null],
      locale,
      selectionType: 'range',
    });

    expect(result).toBe('');
  });
});
