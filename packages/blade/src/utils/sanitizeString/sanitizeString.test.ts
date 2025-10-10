import { sanitizeString } from './sanitizeString';

describe('basic functionality', () => {
  it('should handle null and undefined input', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('should normalize multiple spaces', () => {
    expect(sanitizeString('hello   world')).toBe('hello world');
  });
  it('should replace line breaks and tabs with underscores', () => {
    expect(sanitizeString('Sales\nData\t2024')).toBe('Sales_Data_2024');
    expect(sanitizeString('Line1\nLine2\r\nLine3')).toBe('Line1_Line2_Line3');
  });

  it('should replace multiple line breaks with underscores', () => {
    expect(sanitizeString('Sales\n\nData')).toBe('Sales_Data');
  });

  it('should preserve special characters that are safe for charts', () => {
    expect(sanitizeString('Sales & Revenue (2024)')).toBe('Sales & Revenue (2024)');
    expect(sanitizeString('Price: $100')).toBe('Price: $100');
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
    expect(sanitizeString('   ')).toBe('');
  });
});
