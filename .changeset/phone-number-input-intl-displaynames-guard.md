---
'@razorpay/blade': patch
---

fix(PhoneNumberInput): guard `Intl.DisplayNames` so unsupported runtimes stop crashing on import

`CountrySelector` built `new Intl.DisplayNames(['en'], { type: 'region' })` at module scope. On runtimes without the API — Chrome < 81, and React Native engines shipped without full ICU data — that threw a `TypeError` while the module was still being evaluated, so the failure took down every import of `PhoneNumberInput` instead of just the country selector UI. It fired even when the selector was never rendered, including with `showCountrySelector={false}`.

The formatter is now resolved lazily behind a feature check and falls back to the country code (`"IN"`) when the API is unavailable, mirroring what `Intl.DisplayNames` does for unknown codes with its default `fallback: 'code'`. Resolving it lazily also means a consumer-supplied polyfill is picked up, as long as it is installed before the first render.
