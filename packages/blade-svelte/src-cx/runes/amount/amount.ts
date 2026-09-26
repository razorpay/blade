export type AmountPartKind = 'currency' | 'integer' | 'fraction' | 'sign';

export interface AmountPart {
  kind: AmountPartKind;
  text: string;
}

export interface AmountOptions {
  /** ISO 4217. */
  currency: string;
  /** `minor`: paise, cents — scaled by the currency's own exponent. */
  unit?: 'major' | 'minor';
  /** Pins the decimals; the currency's own count otherwise. */
  fractionDigits?: number;
  locale?: string;
  /** `symbol` is the narrow one (`$`, not `US$`), as Blade shows amounts. */
  currencyDisplay?: 'symbol' | 'code';
  /** Replaces the platform's symbol (an app's own symbol table). */
  symbol?: string;
}

export interface FormattedAmount {
  /** In display order: the locale decides which side the currency is on. */
  parts: AmountPart[];
  text: string;
}

const KIND: Partial<Record<Intl.NumberFormatPartTypes, AmountPartKind>> = {
  currency: 'currency',
  decimal: 'fraction',
  fraction: 'fraction',
  minusSign: 'sign',
  plusSign: 'sign',
};

// Building an `Intl.NumberFormat` is the expensive part of formatting, and a
// list of amounts asks for the same few over and over. Null records a
// currency the platform rejected, so it is not retried either.
const FORMATTERS = new Map<string, Intl.NumberFormat | null>();
const MAX_FORMATTERS = 64;

function formatter(
  locale: string | undefined,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat | null {
  const key = `${locale ?? ''}|${options.currency}|${options.currencyDisplay ?? ''}|${options.minimumFractionDigits ?? ''}`;
  const cached = FORMATTERS.get(key);
  if (cached !== undefined) {
    return cached;
  }
  let built: Intl.NumberFormat | null;
  try {
    built = new Intl.NumberFormat(locale, options);
  } catch (e) {
    built = null;
  }
  if (FORMATTERS.size >= MAX_FORMATTERS) {
    FORMATTERS.clear();
  }
  FORMATTERS.set(key, built);
  return built;
}

/** The currency's minor-unit exponent as the platform knows it (INR 2, JPY 0). */
export function currencyExponent(currency: string): number {
  return (
    formatter('en', { style: 'currency', currency })?.resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

/**
 * An amount as typed parts, so a view can style the currency and the
 * decimals apart from the integer. No currency data of its own: symbols,
 * grouping and exponents are the platform's `Intl`. An unknown currency
 * code formats plainly (`XYZ 12.5`) instead of failing.
 */
export function formatAmount(
  value: number,
  options: AmountOptions
): FormattedAmount {
  const { currency, unit = 'major', fractionDigits, locale, symbol } = options;
  const exponent = currencyExponent(currency);
  const major = unit === 'minor' ? value / 10 ** exponent : value;
  const digits = fractionDigits ?? exponent;
  const display = options.currencyDisplay ?? 'symbol';
  const base: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  };
  // The narrow symbol is `$` where the wide one is `US$`. A platform that
  // rejects `narrowSymbol` (Safari before 14.1) falls back to the wide one.
  const format =
    (display === 'symbol'
      ? formatter(locale, { ...base, currencyDisplay: 'narrowSymbol' })
      : null) ?? formatter(locale, { ...base, currencyDisplay: display });
  if (!format) {
    const text = `${currency} ${major}`;
    return { parts: [{ kind: 'integer', text }], text };
  }
  const raw = format.formatToParts(major);

  const parts: AmountPart[] = [];
  for (const part of raw) {
    const kind = KIND[part.type] ?? 'integer';
    const text = kind === 'currency' && symbol ? symbol : part.value;
    const last = parts[parts.length - 1];
    if (last && last.kind === kind) {
      last.text += text;
    } else {
      parts.push({ kind, text });
    }
  }
  return { parts, text: parts.map((part) => part.text).join('') };
}
