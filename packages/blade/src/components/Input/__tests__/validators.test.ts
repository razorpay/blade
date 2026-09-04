import { PAN_REGEX, validatePAN, isValidPAN } from '../validators';

describe('PAN Validator', () => {
  describe('PAN_REGEX', () => {
    it('should match valid 10-character PAN patterns', () => {
      expect(PAN_REGEX.test('ABCDE1234F')).toBe(true);
      expect(PAN_REGEX.test('AAAPA1234A')).toBe(true);
      expect(PAN_REGEX.test('ZZZZZ9999Z')).toBe(true);
    });

    it('should not match invalid PAN formats', () => {
      expect(PAN_REGEX.test('ABCDE12345')).toBe(false);
      expect(PAN_REGEX.test('12345ABCDE')).toBe(false);
      expect(PAN_REGEX.test('ABCD1234F')).toBe(false);
      expect(PAN_REGEX.test('ABCDEF1234F')).toBe(false);
      expect(PAN_REGEX.test('ABCDE1234FG')).toBe(false);
      expect(PAN_REGEX.test('abcde1234f')).toBe(false);
    });
  });

  describe('validatePAN and isValidPAN', () => {
    it('should validate valid uppercase 10-character PAN', () => {
      expect(validatePAN('ABCDE1234F')).toBe(true);
      expect(isValidPAN('ABCDE1234F')).toBe(true);
    });

    it('should validate lowercase or mixed case PAN by uppercasing', () => {
      expect(validatePAN('abcde1234f')).toBe(true);
      expect(validatePAN('AbCdE1234f')).toBe(true);
      expect(isValidPAN('abcde1234f')).toBe(true);
    });

    it('should trim surrounding whitespace and validate', () => {
      expect(validatePAN('  ABCDE1234F  ')).toBe(true);
      expect(validatePAN('\tABCDE1234F\n')).toBe(true);
      expect(isValidPAN('  abcde1234f  ')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(validatePAN('ABCDE12345')).toBe(false);
      expect(validatePAN('12345ABCDE')).toBe(false);
      expect(validatePAN('ABCDE123')).toBe(false);
      expect(validatePAN('ABCDE12345F')).toBe(false);
      expect(validatePAN('ABC1234F')).toBe(false);
      expect(validatePAN('ABCDE 1234 F')).toBe(false);
    });

    it('should return false for empty, null, undefined, or non-string inputs', () => {
      expect(validatePAN('')).toBe(false);
      expect(validatePAN('   ')).toBe(false);
      expect(validatePAN(null)).toBe(false);
      expect(validatePAN(undefined)).toBe(false);
      // @ts-expect-error testing non-string input
      expect(validatePAN(12345)).toBe(false);
    });
  });
});
