import { getTextInputFormat, validateAndParseDateInput } from '../utils';

describe('DatePicker month + year formats (MMM YYYY / MMMM YYYY)', () => {
  describe('getTextInputFormat', () => {
    it('returns the mask for MMM YYYY', () => {
      expect(getTextInputFormat('MMM YYYY', false)).toBe('### ####');
    });

    it('returns the mask for MMMM YYYY (wide enough for "September")', () => {
      expect(getTextInputFormat('MMMM YYYY', false)).toBe('######### ####');
    });

    it('keeps existing masks unchanged', () => {
      expect(getTextInputFormat('DD/MM/YYYY', false)).toBe('##/##/####');
      expect(getTextInputFormat('MMM', false)).toBe('###');
      expect(getTextInputFormat('MMMM', false)).toBe('#########');
      expect(getTextInputFormat('YYYY', false)).toBe('####');
    });
  });

  describe('validateAndParseDateInput', () => {
    it('parses a complete "MMM YYYY" value', () => {
      const result = validateAndParseDateInput('Mar 2026', false, 'MMM YYYY');
      expect(result.shouldBlock).toBe(false);
      const parsed = result.parsedValue as Date;
      expect(parsed.getMonth()).toBe(2);
      expect(parsed.getFullYear()).toBe(2026);
    });

    it('parses a complete "MMMM YYYY" value', () => {
      const result = validateAndParseDateInput('March 2026', false, 'MMMM YYYY');
      expect(result.shouldBlock).toBe(false);
      const parsed = result.parsedValue as Date;
      expect(parsed.getMonth()).toBe(2);
      expect(parsed.getFullYear()).toBe(2026);
    });

    it('does not block and does not return a value for partial typing', () => {
      const result = validateAndParseDateInput('Mar 2', false, 'MMM YYYY');
      expect(result.shouldBlock).toBe(false);
      expect(result.parsedValue).toBeUndefined();
    });

    it('blocks an invalid month token', () => {
      const result = validateAndParseDateInput('Xyz 2026', false, 'MMM YYYY');
      expect(result.shouldBlock).toBe(true);
    });

    it('blocks out-of-range years', () => {
      expect(validateAndParseDateInput('Mar 0999', false, 'MMM YYYY').shouldBlock).toBe(true);
      expect(validateAndParseDateInput('Mar 3001', false, 'MMM YYYY').shouldBlock).toBe(true);
    });

    it('keeps existing MMM behaviour unchanged', () => {
      const result = validateAndParseDateInput('Mar', false, 'MMM');
      expect(result.shouldBlock).toBe(false);
      expect((result.parsedValue as Date).getMonth()).toBe(2);
    });
  });
});
