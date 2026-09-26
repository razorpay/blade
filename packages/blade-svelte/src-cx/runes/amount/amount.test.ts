import { describe, it, expect } from 'vitest';
import { currencyExponent, formatAmount } from './amount';

const kinds = (value: number, options: Parameters<typeof formatAmount>[1]) =>
  formatAmount(value, options).parts.map((part) => `${part.kind}:${part.text}`);

describe('currencyExponent', () => {
  it('reads the minor-unit exponent off the platform', () => {
    expect(currencyExponent('INR')).toBe(2);
    expect(currencyExponent('JPY')).toBe(0);
    expect(currencyExponent('KWD')).toBe(3);
    expect(currencyExponent('not-a-code')).toBe(2);
  });
});

describe('formatAmount', () => {
  it('splits currency, integer and fraction, grouped by the locale', () => {
    expect(kinds(123456.5, { currency: 'INR', locale: 'en-IN' })).toEqual([
      'currency:₹',
      'integer:1,23,456',
      'fraction:.50',
    ]);
    expect(
      formatAmount(1234.5, { currency: 'USD', locale: 'en-US' }).text
    ).toBe('$1,234.50');
  });

  it('scales minor units by the currency exponent', () => {
    expect(
      formatAmount(123450, { currency: 'INR', unit: 'minor', locale: 'en-IN' })
        .text
    ).toBe('₹1,234.50');
    expect(
      formatAmount(1234, { currency: 'JPY', unit: 'minor', locale: 'en-US' })
        .text
    ).toBe('¥1,234');
  });

  it('pins the decimals when asked, down to none', () => {
    expect(
      kinds(99.5, { currency: 'INR', locale: 'en-IN', fractionDigits: 0 })
    ).toEqual(['currency:₹', 'integer:100']);
    expect(
      formatAmount(5, { currency: 'JPY', locale: 'en-US', fractionDigits: 2 })
        .text
    ).toBe('¥5.00');
  });

  it('keeps the locale order and a negative sign', () => {
    const german = formatAmount(1234.5, { currency: 'EUR', locale: 'de-DE' });
    expect(german.parts[0]?.kind).toBe('integer');
    expect(german.parts.some((part) => part.kind === 'currency')).toBe(true);
    expect(german.parts[0]?.text).toBe('1.234');

    expect(kinds(-5, { currency: 'INR', locale: 'en-IN' })[0]).toBe('sign:-');
  });

  it('shows the code or an app symbol instead of the platform symbol', () => {
    expect(
      formatAmount(10, {
        currency: 'USD',
        locale: 'en-US',
        currencyDisplay: 'code',
      }).parts[0]
    ).toEqual({ kind: 'currency', text: 'USD' });
    expect(
      formatAmount(10, { currency: 'MYR', locale: 'en-US', symbol: 'RM' })
        .parts[0]
    ).toEqual({ kind: 'currency', text: 'RM' });
  });

  it('formats an unknown currency plainly instead of failing', () => {
    expect(formatAmount(12.5, { currency: 'nope!' })).toEqual({
      parts: [{ kind: 'integer', text: 'nope! 12.5' }],
      text: 'nope! 12.5',
    });
  });
});

describe('formatter reuse', () => {
  it('builds one Intl.NumberFormat per distinct request', () => {
    const Real = Intl.NumberFormat;
    let built = 0;
    const Counting = function (
      this: unknown,
      ...args: ConstructorParameters<typeof Intl.NumberFormat>
    ) {
      built += 1;
      return new Real(...args);
    } as unknown as typeof Intl.NumberFormat;
    Counting.supportedLocalesOf = Real.supportedLocalesOf;
    Intl.NumberFormat = Counting;
    try {
      // A locale and digits no other test asks for, so nothing is cached yet.
      const options = { currency: 'SEK', locale: 'sv-SE', fractionDigits: 1 };
      for (let i = 0; i < 25; i += 1) {
        formatAmount(i * 3.5, options);
      }
      // One for the exponent, one for the format.
      expect(built).toBe(2);
      formatAmount(1, { ...options, fractionDigits: 3 });
      expect(built).toBe(3);
    } finally {
      Intl.NumberFormat = Real;
    }
  });

  it('the default symbol is the narrow one: $, not US$', () => {
    expect(formatAmount(10, { currency: 'USD', locale: 'en-IN' }).text).toBe(
      '$10.00'
    );
    expect(
      formatAmount(10, {
        currency: 'USD',
        locale: 'en-IN',
        currencyDisplay: 'code',
      }).text
    ).toMatch(/^USD\s?10\.00$/);
  });
});
