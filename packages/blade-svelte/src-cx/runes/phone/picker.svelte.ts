export interface PhonePicker {
  /** The search text; bindable from the search box, read by the list's `query`. */
  query: string;
}

/**
 * The country picker's search text. The list filters itself by it
 * (VirtualOptionList's `query`, with `phoneCountryMatches`). Call during
 * component initialisation.
 */
export function createPhonePicker(): PhonePicker {
  let query = $state('');
  return {
    get query() {
      return query;
    },
    set query(next) {
      query = next;
    },
  };
}
