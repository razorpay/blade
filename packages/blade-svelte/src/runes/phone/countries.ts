// Two subpaths of one package: the import resolver maps both to its entry.
// eslint-disable-next-line import/no-duplicates
import { getFlagsForAllCountries } from '@razorpay/i18nify-js/geo';
// eslint-disable-next-line import/no-duplicates
import { formatPhoneNumber, getDialCodes } from '@razorpay/i18nify-js/phoneNumber';
import type { PhoneCountry } from './parts';

const ISO_CODE = /^[A-Z]{2}$/;

const cache = new Map<string, readonly PhoneCountry[]>();

function regionName(names: Intl.DisplayNames, code: string): string | undefined {
  try {
    const name = names.of(code);
    return name && name !== code ? name : undefined;
  } catch (e: unknown) {
    return undefined;
  }
}

/**
 * Every country PhoneNumberInput offers when it is given none, as Blade
 * React's: dial codes and flags from i18nify (a peer dependency), names
 * from the platform in `locale`, sorted by name. Built once per locale. No
 * patterns: an app that validates national numbers adds them to these
 * and passes the list as `countries`.
 */
export function defaultPhoneCountries(locale = 'en'): readonly PhoneCountry[] {
  const cached = cache.get(locale);
  if (cached) {
    return cached;
  }
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  // One map for every flag: the per-country lookup logs an error for each
  // code i18nify lacks.
  const flags: Partial<Record<string, { '4X3': string }>> = getFlagsForAllCountries();
  const countries = Object.entries(getDialCodes())
    .flatMap(([code, dialCode]): PhoneCountry[] => {
      // i18nify also lists subdivisions (`GB-ENG`) and codes no platform
      // names (`FW`): only the regions a buyer can recognise are offered.
      const name = ISO_CODE.test(code) ? regionName(names, code) : undefined;
      return name
        ? [
            {
              code,
              name,
              dialCode: String(dialCode),
              flag: flags[code]?.['4X3'],
            },
          ]
        : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  cache.set(locale, countries);
  return countries;
}

/** Blade's placeholder for a country: i18nify's format of `1234567890`. */
export function examplePhoneNumber(code: string): string {
  return formatPhoneNumber('1234567890', code as Parameters<typeof formatPhoneNumber>[1]);
}
