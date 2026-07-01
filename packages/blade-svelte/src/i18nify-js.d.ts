/**
 * Ambient declaration for `@razorpay/i18nify-js`.
 *
 * The published package ships runtime JS under `lib/esm` but its type
 * definitions do not resolve under this package's `moduleResolution: "bundler"`
 * setting (svelte-check reports the module as implicitly `any`). This declares
 * the narrow surface consumed by `PhoneNumberInput` / `CountrySelector`.
 */
declare module '@razorpay/i18nify-js' {
  /** ISO 3166-1 alpha-2 country code, e.g. `"IN"`, `"US"`. */
  export type CountryCodeType = string;

  /** Flag asset URLs by aspect ratio for a single country. */
  export type CountryFlag = {
    '4X3': string;
    '1X1'?: string;
    [ratio: string]: string | undefined;
  };

  /** Returns the flag asset map for every supported country, keyed by code. */
  export function getFlagsForAllCountries(): Record<string, CountryFlag>;

  /** Returns the flag asset map for a single country. */
  export function getFlagOfCountry(country: CountryCodeType): CountryFlag;

  /** Returns the dial code for a country, e.g. `"+91"`. */
  export function getDialCodeByCountryCode(country: CountryCodeType): string;

  /** Formats a raw phone number for the given country. */
  export function formatPhoneNumber(value: string, country: CountryCodeType): string;

  /** Validates a phone number for the given country. */
  export function isValidPhoneNumber(value: string, country: CountryCodeType): boolean;
}
