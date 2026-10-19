import { defaultPhoneCountries } from '../../runes/phone/countries';
import type { PhoneCountry } from '../../index';

/** The library's own list (i18nify's), as a story that passes `countries` sees it. */
export function buildCountries(locale = 'en'): PhoneCountry[] {
  return [...defaultPhoneCountries(locale)];
}
