import { describe, it, expect } from 'vitest';
import {
  allowedPhoneCountries,
  filterPhoneCountries,
  joinPhoneNumber,
  splitPhoneNumber,
} from './parts';
import type { PhoneCountry } from './parts';

const countries: PhoneCountry[] = [
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
];
const india = countries[0];

describe('joinPhoneNumber', () => {
  it('keeps digits only and prefixes the dial code', () => {
    expect(joinPhoneNumber(india, '98765 43210')).toEqual({
      country: 'IN',
      dialCode: '+91',
      nationalNumber: '9876543210',
      value: '+919876543210',
    });
  });

  it('has no value while there is no number', () => {
    expect(joinPhoneNumber(india, '').value).toBe('');
  });
});

describe('splitPhoneNumber', () => {
  it('reads the country off a value with a plus', () => {
    expect(splitPhoneNumber('+60123456789', countries, 'IN')).toMatchObject({
      country: 'MY',
      nationalNumber: '123456789',
    });
  });

  it('prefers the longest dial code', () => {
    expect(splitPhoneNumber('+12685551234', countries, 'IN')).toMatchObject({
      country: 'AG',
      nationalNumber: '5551234',
    });
  });

  it('breaks a shared dial code with the preferred country, else the first', () => {
    expect(splitPhoneNumber('+14155550100', countries, 'CA')?.country).toBe('CA');
    expect(splitPhoneNumber('+14155550100', countries, 'IN')?.country).toBe('US');
  });

  it('treats a value without a plus as national to the preferred country', () => {
    expect(splitPhoneNumber('9876543210', countries, 'IN')).toMatchObject({
      country: 'IN',
      value: '+919876543210',
    });
  });

  it('falls back to the first country, and to nothing without countries', () => {
    expect(splitPhoneNumber('', countries, 'ZZ')?.country).toBe('IN');
    expect(splitPhoneNumber('+999123', countries, 'MY')).toMatchObject({
      country: 'MY',
      nationalNumber: '999123',
    });
    expect(splitPhoneNumber('123', [], 'IN')).toBeUndefined();
  });
});

describe('allowedPhoneCountries', () => {
  it('filters in the app order; empty allows all', () => {
    expect(allowedPhoneCountries(countries, ['MY', 'IN']).map((c) => c.code)).toEqual(['IN', 'MY']);
    expect(allowedPhoneCountries(countries, [])).toHaveLength(5);
    expect(allowedPhoneCountries(countries, undefined)).toHaveLength(5);
  });
});

describe('filterPhoneCountries', () => {
  it('matches name, ISO code and dial code', () => {
    const codes = (query: string): string[] =>
      filterPhoneCountries(countries, query).map((c) => c.code);
    expect(codes('  ind ')).toEqual(['IN']);
    expect(codes('my')).toEqual(['MY']);
    expect(codes('+1')).toEqual(['US', 'CA', 'AG']);
    expect(codes('126')).toEqual(['AG']);
    expect(codes('')).toHaveLength(5);
    expect(codes('zzz')).toEqual([]);
  });
});
