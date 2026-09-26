/**
 * One selectable country. The model ships no country data: the app builds
 * the list (dial codes, localized names, flag URLs, patterns) and owns it.
 */
export interface PhoneCountry {
  /** ISO 3166-1 alpha-2, the identity. */
  code: string;
  name: string;
  /** With the plus: `+91`. */
  dialCode: string;
  flag?: string;
  /** Validates the national number. */
  pattern?: string | RegExp;
  maxLength?: number;
}

export interface PhoneParts {
  country: string;
  dialCode: string;
  /** Digits only, without the dial code. */
  nationalNumber: string;
  /** `dialCode` + `nationalNumber`; empty while there is no number. */
  value: string;
}

export function phoneDigits(text: string): string {
  return text.replace(/\D/g, '');
}

export function findPhoneCountry(
  countries: readonly PhoneCountry[],
  code: string | undefined
): PhoneCountry | undefined {
  return code === undefined
    ? undefined
    : countries.find((country) => country.code === code);
}

export function joinPhoneNumber(
  country: PhoneCountry,
  nationalNumber: string
): PhoneParts {
  const digits = phoneDigits(nationalNumber);
  return {
    country: country.code,
    dialCode: country.dialCode,
    nationalNumber: digits,
    value: digits ? `${country.dialCode}${digits}` : '',
  };
}

/**
 * Reads a stored value back. A value with a plus names its own country: the
 * longest matching dial code wins, and among countries sharing it (+1) the
 * preferred one. Anything else is a national number of the preferred country.
 */
export function splitPhoneNumber(
  value: string | null | undefined,
  countries: readonly PhoneCountry[],
  preferred: string | undefined
): PhoneParts | undefined {
  const fallback = findPhoneCountry(countries, preferred) ?? countries[0];
  if (!fallback) {
    return undefined;
  }
  const text = (value ?? '').trim();
  if (!text.startsWith('+')) {
    return joinPhoneNumber(fallback, text);
  }
  const digits = phoneDigits(text);
  let match: PhoneCountry | undefined;
  for (const country of countries) {
    const dial = phoneDigits(country.dialCode);
    if (!dial || !digits.startsWith(dial)) {
      continue;
    }
    const current = match ? phoneDigits(match.dialCode).length : -1;
    const longer = dial.length > current;
    const preferredTie = dial.length === current && country.code === preferred;
    if (longer || preferredTie) {
      match = country;
    }
  }
  if (!match) {
    return joinPhoneNumber(fallback, digits);
  }
  return joinPhoneNumber(
    match,
    digits.slice(phoneDigits(match.dialCode).length)
  );
}

/** Keeps the app's order; `allowed` undefined or empty allows every country. */
export function allowedPhoneCountries(
  countries: readonly PhoneCountry[],
  allowed: readonly string[] | undefined
): PhoneCountry[] {
  if (!allowed || allowed.length === 0) {
    return [...countries];
  }
  return countries.filter((country) => allowed.includes(country.code));
}

/** Matches the name, the ISO code or the dial code, with or without the plus. */
export function filterPhoneCountries(
  countries: readonly PhoneCountry[],
  query: string
): PhoneCountry[] {
  const text = query.trim().toLowerCase();
  if (!text) {
    return [...countries];
  }
  const digits = phoneDigits(text);
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(text) ||
      country.code.toLowerCase() === text ||
      (digits !== '' && phoneDigits(country.dialCode).startsWith(digits))
  );
}
