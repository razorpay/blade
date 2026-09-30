import type { CountryCodeType } from '@razorpay/i18nify-js';

type CountryNameFormatter = {
  /**
   * Resolves the English display name of a country code, e.g. `"IN"` -> `"India"`.
   *
   * Falls back to the country code itself when the runtime cannot resolve a name,
   * which mirrors what `Intl.DisplayNames` does for unknown codes with its default
   * `fallback: 'code'` option.
   */
  of: (countryCode: CountryCodeType) => string;
};

/**
 * `undefined` means "not resolved yet", `null` means "resolved, but unavailable on
 * this runtime". Keeping the resolved value around avoids rebuilding the formatter
 * on every render, which is why the previous module scope constant existed.
 */
let regionDisplayNames: Intl.DisplayNames | null | undefined;

/**
 * `Intl.DisplayNames` is not available everywhere Blade runs. It only landed in
 * Chrome 81 (Sentry still reports crashes from Chrome 80 on Android) and it is
 * missing on React Native runtimes built without full ICU data — which is why the
 * native entry pulls in the `@formatjs/intl-displaynames` polyfill.
 *
 * Resolving it lazily matters for two reasons:
 * - Constructing it at module scope made an unsupported runtime throw a `TypeError`
 *   while the module was still being evaluated, which took down every import of
 *   `PhoneNumberInput` rather than just the country selector UI.
 * - Consumers that polyfill `Intl.DisplayNames` themselves are picked up correctly,
 *   as long as the polyfill is installed before the first render.
 *
 * @see https://github.com/razorpay/blade/issues/2490
 */
const getRegionDisplayNames = (): Intl.DisplayNames | null => {
  if (regionDisplayNames === undefined) {
    try {
      regionDisplayNames =
        typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
          ? new Intl.DisplayNames(['en'], { type: 'region' })
          : null;
    } catch {
      // Some runtimes expose `Intl.DisplayNames` but throw on construction when the
      // ICU data backing the `region` type isn't bundled with the engine.
      regionDisplayNames = null;
    }
  }

  return regionDisplayNames;
};

const countryNameFormatter: CountryNameFormatter = {
  of: (countryCode) => getRegionDisplayNames()?.of(countryCode) ?? countryCode,
};

export type { CountryNameFormatter };
export { countryNameFormatter };
