import { filterPhoneCountries } from './parts';
import type { PhoneCountry } from './parts';

export interface PhonePicker {
  /** The search text; bindable from the search box. */
  query: string;
  /** The countries matching the search. */
  readonly matches: readonly PhoneCountry[];
}

/** The country picker's search over its countries. Call during component initialisation. */
export function createPhonePicker(countries: () => readonly PhoneCountry[]): PhonePicker {
  let query = $state('');
  const matches = $derived(filterPhoneCountries(countries(), query));
  return {
    get query() {
      return query;
    },
    set query(next) {
      query = next;
    },
    get matches() {
      return matches;
    },
  };
}
