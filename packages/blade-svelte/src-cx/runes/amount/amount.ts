import { formatNumberByParts } from '@razorpay/i18nify-js/currency';
import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';

type FormatOptions = NonNullable<Parameters<typeof formatNumberByParts>[1]>;
type IntlOptions = NonNullable<FormatOptions['intlOptions']>;

/** What follows the integer: fixed decimals, none, or a compact form (1.5K). */
export type AmountSuffix = 'decimals' | 'none' | 'humanize';

export interface AmountOptions {
  /** ISO 4217. */
  currency: string;
  /** @default 'decimals' */
  suffix?: AmountSuffix;
  /**
   * With `suffix: 'decimals'`: how many; `auto` takes the currency's own
   * (JPY 0, KWD 3).
   * @default 2
   */
  fractionDigits?: number | 'auto';
  /** `minor`: paise, cents — scaled by the currency's own exponent. */
  unit?: 'major' | 'minor';
  /** Grouping and the currency's side; i18nify's (the platform's) by default. */
  locale?: string;
}

/** An amount split the way Blade renders it. */
export interface AmountParts {
  minusSign?: string;
  currency: string;
  /** With its group separators. */
  integer: string;
  decimal?: string;
  fraction?: string;
  /** `humanize`'s K, L, Cr, Mio. … */
  compact?: string;
  /** Whether the locale puts the currency before the number. */
  isPrefixSymbol: boolean;
}

/** The currency's minor-unit exponent as the platform knows it (INR 2, JPY 0). */
export function currencyExponent(currency: string): number {
  try {
    return (
      new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

function intlOptions(suffix: AmountSuffix, fractionDigits: number | 'auto'): IntlOptions {
  if (suffix === 'humanize') {
    return { notation: 'compact', maximumFractionDigits: 2 };
  }
  if (suffix === 'none') {
    return { maximumFractionDigits: 0, roundingMode: 'floor' } as IntlOptions;
  }
  return fractionDigits === 'auto'
    ? {}
    : {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      };
}

/**
 * An amount as Blade's parts, formatted by i18nify as Blade React does:
 * its currency symbols (SGD `S$`), the locale's grouping and side, and no
 * locale spacing. An amount i18nify cannot format falls back to the plain
 * number after the currency code.
 */
export function getAmountByParts(value: number, options: AmountOptions): AmountParts {
  const { currency, suffix = 'decimals', fractionDigits = 2, unit = 'major', locale } = options;
  const major = unit === 'minor' ? value / 10 ** currencyExponent(currency) : value;
  try {
    const parts = formatNumberByParts(major, {
      currency: currency as CurrencyCodeType,
      locale,
      intlOptions: intlOptions(suffix, fractionDigits),
    });
    const result: AmountParts = {
      minusSign: parts.minusSign,
      currency: parts.currency ?? currency,
      integer: parts.integer ?? '',
      decimal: parts.decimal,
      fraction: parts.fraction,
      compact: parts.compact,
      isPrefixSymbol: parts.isPrefixSymbol ?? true,
    };
    // Blade's polyfill for `trailingZeroDisplay: 'stripIfInteger'`: a
    // humanized 1K, not 1.00K.
    if (suffix === 'humanize' && result.fraction && /^0+$/.test(result.fraction)) {
      result.decimal = undefined;
      result.fraction = undefined;
    }
    return result;
  } catch {
    return { currency, integer: String(major), isPrefixSymbol: true };
  }
}

/** The whole amount as one string, in reading order: what a screen reader gets. */
export function amountText(parts: AmountParts, currency: string): string {
  const number = `${parts.integer}${parts.decimal ?? ''}${parts.fraction ?? ''}${
    parts.compact ?? ''
  }`;
  return `${parts.minusSign ?? ''}${
    parts.isPrefixSymbol ? `${currency}${number}` : `${number}${currency}`
  }`;
}
