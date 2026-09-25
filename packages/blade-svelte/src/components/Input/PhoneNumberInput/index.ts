/**
 * PhoneNumberInput — a `BaseInput` preconfigured for phone numbers: an optional
 * country selector (flag trigger), a dial-code prefix, a clear button, and a
 * rich `onChange` payload (`{ phoneNumber, dialCode, country, value, name }`).
 *
 * Country data (list, dial codes, flags) comes from `@razorpay/i18nify-js` by
 * default. Pass `countries` to supply your own table instead — it becomes the single
 * source for the list, the dial-code prefix, the `dialCode` in `onChange`, search and
 * flags, and lets you use codes i18nify does not model (e.g. `'XK'` Kosovo). Every
 * country prop accepts any string (`PhoneCountryCode`), so no casts are needed at
 * the boundary; i18nify lookups never throw for unknown codes.
 *
 * ### Deviations from React
 * - **Country list is a `BottomSheet` on BOTH mobile and desktop.** React opens
 *   an anchored `DropdownOverlay` on desktop and a `BottomSheet` on mobile
 *   (via `useIsMobile`). Since Dropdown is not yet migrated, the Svelte
 *   `CountrySelector` always opens the migrated `BottomSheet` + `ActionList` —
 *   there is no anchored popover and no `useIsMobile` branch.
 * - **`ref` → `focus()` / `getInput()`:** bind the component instance and call
 *   `instance.focus()` or `instance.getInput()`.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { PhoneNumberInput } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <PhoneNumberInput
 *   label="Phone Number"
 *   defaultCountry="IN"
 *   onChange={({ phoneNumber, dialCode, country }) =>
 *     console.log(phoneNumber, dialCode, country)}
 * />
 *
 * <!-- Custom country table -->
 * <PhoneNumberInput
 *   label="Phone Number"
 *   defaultCountry="XK"
 *   countries={[
 *     { code: 'IN', dialCode: '91' },
 *     { code: 'XK', dialCode: '+383', name: 'Kosovo', flag: '/flags/xk.svg' },
 *     { code: 'DO', dialCode: '1849' },
 *   ]}
 * />
 * ```
 */
export { default as PhoneNumberInput } from './PhoneNumberInput.svelte';
export type {
  PhoneNumberInputProps,
  PhoneNumberInputInstance,
  PhoneNumberChangePayload,
  PhoneCountryCode,
  PhoneCountryInfo,
  CountryCodeType,
} from './types';
