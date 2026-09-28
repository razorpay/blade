import { describe, it, expect } from 'vitest';
import { amountText, currencyExponent, getAmountByParts } from './amount';

describe('getAmountByParts', () => {
  it('reads the minor-unit exponent off the platform', () => {
    expect(currencyExponent('INR')).toBe(2);
    expect(currencyExponent('JPY')).toBe(0);
    expect(currencyExponent('KWD')).toBe(3);
  });

  it('splits currency, integer and decimals, grouped by the locale', () => {
    expect(getAmountByParts(1234567.891, { currency: 'INR', locale: 'en-IN' })).toMatchObject({
      currency: '₹',
      integer: '12,34,567',
      decimal: '.',
      fraction: '89',
      isPrefixSymbol: true,
    });
  });

  it('defaults to 2 decimals whatever the currency, as Blade; auto takes its own', () => {
    expect(getAmountByParts(1000, { currency: 'JPY', locale: 'en-IN' }).fraction).toBe('00');
    expect(
      getAmountByParts(1000, { currency: 'JPY', locale: 'en-IN', fractionDigits: 'auto' }).fraction
    ).toBeUndefined();
    expect(
      getAmountByParts(1000, { currency: 'KWD', locale: 'en-IN', fractionDigits: 'auto' }).fraction
    ).toBe('000');
  });

  it('none floors to the integer', () => {
    const parts = getAmountByParts(1234.99, { currency: 'INR', locale: 'en-IN', suffix: 'none' });
    expect(parts.integer).toBe('1,234');
    expect(parts.fraction).toBeUndefined();
  });

  it('humanize compacts by locale and strips a zero fraction', () => {
    expect(
      getAmountByParts(1000.22, { currency: 'INR', locale: 'en-IN', suffix: 'humanize' })
    ).toMatchObject({ integer: '1', compact: 'K', fraction: undefined });
    expect(
      getAmountByParts(150000, { currency: 'INR', locale: 'en-IN', suffix: 'humanize' })
    ).toMatchObject({ integer: '1', decimal: '.', fraction: '5', compact: 'L' });
  });

  it('takes i18nify’s symbols and sides: S$ where Intl says $, the euro after in de-DE', () => {
    expect(getAmountByParts(12.5, { currency: 'SGD', locale: 'en-SG' }).currency).toBe('S$');
    const euro = getAmountByParts(12.5, { currency: 'EUR', locale: 'de-DE' });
    expect(euro).toMatchObject({ currency: '€', integer: '12', decimal: ',', isPrefixSymbol: false });
  });

  it('scales minor units by the currency exponent', () => {
    expect(getAmountByParts(499900, { currency: 'INR', unit: 'minor', locale: 'en-IN' }).integer).toBe('4,999');
    expect(getAmountByParts(500, { currency: 'JPY', unit: 'minor', locale: 'en-IN' }).integer).toBe('500');
  });

  it('keeps the minus sign apart', () => {
    expect(getAmountByParts(-1000.5, { currency: 'USD', locale: 'en-US' })).toMatchObject({
      minusSign: '-',
      currency: '$',
      integer: '1,000',
    });
  });

  it('falls back to the plain number for a currency it cannot format', () => {
    expect(getAmountByParts(12.5, { currency: 'XYZ1' })).toEqual({
      currency: 'XYZ1',
      integer: '12.5',
      isPrefixSymbol: true,
    });
  });

  it('reads the whole amount in order', () => {
    const parts = getAmountByParts(-12.5, { currency: 'EUR', locale: 'de-DE' });
    expect(amountText(parts, '€')).toBe('-12,50€');
  });
});
