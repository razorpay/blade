import type { CountryNameFormatter } from '../countryNameFormatter';

/**
 * `Intl.DisplayNames` is declared read-only, so tests reach for a mutable view of
 * `Intl` to emulate runtimes where the API is missing or throws.
 */
const mutableIntl = Intl as { DisplayNames?: typeof Intl.DisplayNames };

/**
 * The formatter caches the resolved `Intl.DisplayNames` instance, so every test
 * re-imports the module to start from a clean slate.
 */
const loadCountryNameFormatter = (): CountryNameFormatter => {
  jest.resetModules();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../countryNameFormatter').countryNameFormatter as CountryNameFormatter;
};

describe('countryNameFormatter', () => {
  const originalDisplayNames = Intl.DisplayNames;

  afterEach(() => {
    mutableIntl.DisplayNames = originalDisplayNames;
    jest.resetModules();
  });

  it('should resolve country names when Intl.DisplayNames is supported', () => {
    const countryNameFormatter = loadCountryNameFormatter();

    expect(countryNameFormatter.of('IN')).toBe('India');
    expect(countryNameFormatter.of('MY')).toBe('Malaysia');
  });

  it('should not throw while importing the module when Intl.DisplayNames is unavailable', () => {
    // Chrome < 81 and React Native runtimes built without full ICU data have no
    // `Intl.DisplayNames`. Constructing it at module scope used to throw here, which
    // took down every import of PhoneNumberInput rather than just the country selector.
    delete mutableIntl.DisplayNames;

    expect(() => loadCountryNameFormatter()).not.toThrow();
  });

  it('should fall back to the country code when Intl.DisplayNames is unavailable', () => {
    delete mutableIntl.DisplayNames;

    const countryNameFormatter = loadCountryNameFormatter();

    expect(countryNameFormatter.of('IN')).toBe('IN');
    expect(countryNameFormatter.of('MY')).toBe('MY');
  });

  it('should fall back to the country code when constructing Intl.DisplayNames throws', () => {
    // Some engines expose the constructor but throw for `type: 'region'` when the
    // backing ICU data isn't bundled.
    mutableIntl.DisplayNames = (jest.fn(() => {
      throw new RangeError('missing ICU data for region display names');
    }) as unknown) as typeof Intl.DisplayNames;

    const countryNameFormatter = loadCountryNameFormatter();

    expect(countryNameFormatter.of('IN')).toBe('IN');
  });

  it('should construct Intl.DisplayNames only once across calls', () => {
    const displayNamesSpy = jest.fn(() => ({ of: () => 'India' }));
    mutableIntl.DisplayNames = (displayNamesSpy as unknown) as typeof Intl.DisplayNames;

    const countryNameFormatter = loadCountryNameFormatter();
    countryNameFormatter.of('IN');
    countryNameFormatter.of('IN');

    expect(displayNamesSpy).toHaveBeenCalledTimes(1);
  });
});
