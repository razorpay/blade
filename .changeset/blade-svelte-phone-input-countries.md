---
'@razorpay/blade-svelte': minor
---

feat(PhoneNumberInput): make country data source pluggable and widen country types

- New optional `countries` prop (`PhoneCountryInfo[]` — `{ code, dialCode, name?, flag? }`). When provided it is the single source for the selector list, the dial-code prefix, the `dialCode` in the `onChange` payload, search and flags, so consumers can use their own country table (including codes i18nify does not model, e.g. `XK` Kosovo, or custom dial codes such as `DO` = `+1849`). `name` falls back to `Intl.DisplayNames` and `flag` to i18nify's flag lookup when omitted; dial codes are normalised to a leading `+`. `allowedCountries` still filters whichever list is active. Without `countries`, behaviour is unchanged.
- `defaultCountry`, `country`, `onCountryChange`, `allowedCountries` and `PhoneNumberChangePayload.country` are now typed as `PhoneCountryCode` (`CountryCodeType | string`), keeping autocomplete while accepting any string. `PhoneCountryCode`, `PhoneCountryInfo` and `CountryCodeType` are exported from `@razorpay/blade-svelte/components`.
- All i18nify lookups are guarded: an unknown country code no longer throws during render; it shows an empty dial code, an empty flag slot and raw (unformatted) digits instead.
- `@razorpay/i18nify-js` moved from `dependencies` to `peerDependencies` (`^1.12.3`), mirroring `@razorpay/blade`, so consumers who already ship i18nify do not bundle two copies. Add it to your app's dependencies if it is not already there.
