import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
import { getDialCodes } from '@razorpay/i18nify-js/phoneNumber';
import type { PhoneCountry } from '../../index';

type CountryCode = Parameters<typeof getFlagOfCountry>[0];

const PATTERNS: Record<string, Pick<PhoneCountry, 'pattern' | 'maxLength'>> = {
  IN: { pattern: '[6-9]\\d{9}', maxLength: 10 },
  MY: { pattern: '1\\d{8,9}', maxLength: 10 },
  SG: { pattern: '[89]\\d{7}', maxLength: 8 },
};

/**
 * How an app feeds PhoneNumberInput: the library ships no country data, so
 * dial codes and flags come from i18nify and names from the platform.
 */
export function buildCountries(locale = 'en'): PhoneCountry[] {
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  return Object.entries(getDialCodes())
    .map(([code, dialCode]) => {
      let name = code;
      let flag: string | undefined;
      try {
        name = names.of(code) ?? code;
        flag = getFlagOfCountry(code as CountryCode)['4X3'];
      } catch (e) {
        // A code the platform or i18nify does not know keeps its ISO code.
      }
      return {
        code,
        name,
        dialCode: String(dialCode),
        flag,
        ...PATTERNS[code],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
