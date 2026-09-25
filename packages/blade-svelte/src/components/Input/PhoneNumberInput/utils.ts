/* eslint-disable import/no-duplicates -- subpath entries resolve to one CJS file for
   the import resolver, but the root entry ships no types under bundler resolution. */
import { formatPhoneNumber, getDialCodes } from '@razorpay/i18nify-js/phoneNumber';
import { getFlagsForAllCountries } from '@razorpay/i18nify-js/geo';
import type { CountryCodeType } from '@razorpay/i18nify-js/types';
/* eslint-enable import/no-duplicates */
import type { PhoneCountryCode, PhoneCountryInfo, ResolvedPhoneCountry } from './types';

// The repo targets ES2019, where `Intl.DisplayNames` (ES2020) is not in the
// TypeScript lib. Define a minimal interface for the shape we use and cast
// through `unknown` at construction so tsc compiles without raising the target.
interface CountryNameFormatter {
  of(code: string): string | undefined;
}

// i18nify wraps every lookup in `withErrorBoundary`, which logs a console.error
// AND throws on unknown codes. Reading the full maps once and indexing them is
// the only way to stay silent for codes i18nify does not know (e.g. 'XK').
let i18nifyDialCodes: Record<string, string> | undefined,
  i18nifyFlags: Record<string, { '4X3': string }> | undefined,
  countryNameFormatter: CountryNameFormatter | undefined;

const loadDialCodes = (): Record<string, string> => {
  try {
    return getDialCodes();
  } catch {
    return {};
  }
};

const loadFlags = (): Record<string, { '4X3': string }> => {
  try {
    return getFlagsForAllCountries() as Record<string, { '4X3': string }>;
  } catch {
    return {};
  }
};

const getI18nifyDialCodes = (): Record<string, string> => {
  if (!i18nifyDialCodes) {
    i18nifyDialCodes = loadDialCodes();
  }
  return i18nifyDialCodes;
};

const getI18nifyFlags = (): Record<string, { '4X3': string }> => {
  if (!i18nifyFlags) {
    i18nifyFlags = loadFlags();
  }
  return i18nifyFlags;
};

/** Country codes i18nify ships data for, in its own order (used for the default list). */
export const getI18nifyCountryCodes = (): string[] => Object.keys(getI18nifyFlags());

/** Is `code` one i18nify has a dial code for? Drives whether i18nify formatting is used. */
export const isKnownToI18nify = (code: string): boolean => code in getI18nifyDialCodes();

/** Dial code from i18nify (`'+91'`), or `''` for codes it does not know. */
export const getDialCodeSafe = (code: string): string => getI18nifyDialCodes()[code] ?? '';

/** 4:3 flag URL from i18nify, or `undefined` for codes it does not know. */
export const getFlagSafe = (code: string): string | undefined => getI18nifyFlags()[code]?.['4X3'];

/** Region display name via `Intl.DisplayNames`; falls back to the code itself. */
export const getCountryNameSafe = (code: string): string => {
  try {
    if (!countryNameFormatter) {
      const DisplayNames = ((Intl as unknown) as {
        DisplayNames: new (
          locales: string | string[],
          options: { type: string },
        ) => CountryNameFormatter;
      }).DisplayNames;
      countryNameFormatter = new DisplayNames(['en'], { type: 'region' });
    }
    return countryNameFormatter.of(code) ?? code;
  } catch {
    return code;
  }
};

/**
 * Formats with i18nify only for codes it knows; otherwise returns the raw value.
 * (`formatPhoneNumber` falls back to detecting the country from the digits for
 * unknown codes, which would silently format an 'XK' number as something else.)
 */
export const formatPhoneNumberSafe = (value: string, code: string): string => {
  if (!value || !isKnownToI18nify(code)) return value;
  try {
    return formatPhoneNumber(value, code as CountryCodeType);
  } catch {
    return value;
  }
};

/** `'91'` / `' +91 '` -> `'+91'` (matches i18nify's own dial-code format). */
export const normalizeDialCode = (dialCode: string): string => {
  const trimmed = String(dialCode ?? '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
};

export const normalizeCountry = (country: PhoneCountryInfo): ResolvedPhoneCountry => ({
  code: country.code,
  name: country.name ?? getCountryNameSafe(country.code),
  dialCode: normalizeDialCode(country.dialCode),
  flag: country.flag ?? getFlagSafe(country.code),
});

/** Builds an entry from i18nify / Intl data alone (the default, list-less path). */
export const resolveCountryFromI18nify = (code: string): ResolvedPhoneCountry => ({
  code,
  name: getCountryNameSafe(code),
  dialCode: getDialCodeSafe(code),
  flag: getFlagSafe(code),
});

/**
 * The list the selector renders. With `countries` it is that list (consumer order)
 * optionally filtered by `allowedCountries`; without, it is i18nify's list with
 * region-subdivision codes (`'GB-ENG'`) dropped and sorted by name, or the
 * `allowedCountries` in the given order.
 */
export const getPhoneCountryList = ({
  countries,
  allowedCountries,
}: {
  countries?: ResolvedPhoneCountry[];
  allowedCountries?: PhoneCountryCode[];
}): ResolvedPhoneCountry[] => {
  if (countries) {
    if (!allowedCountries) return countries;
    const byCode = new Map(countries.map((country) => [country.code, country]));
    return allowedCountries
      .map((code) => byCode.get(code))
      .filter((country): country is ResolvedPhoneCountry => Boolean(country));
  }
  if (allowedCountries) {
    return allowedCountries.map(resolveCountryFromI18nify);
  }
  return getI18nifyCountryCodes()
    .filter((code) => !code.includes('-'))
    .map(resolveCountryFromI18nify)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Entry for the selected code: from `list` when present, else built from i18nify /
 * Intl data so a code outside the list (or unknown everywhere) still renders with
 * an empty dial code and no flag instead of throwing.
 */
export const resolvePhoneCountry = (
  code: string,
  list: ResolvedPhoneCountry[],
): ResolvedPhoneCountry =>
  list.find((country) => country.code === code) ?? resolveCountryFromI18nify(code);
