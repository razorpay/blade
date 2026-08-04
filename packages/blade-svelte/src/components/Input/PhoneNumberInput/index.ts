/**
 * PhoneNumberInput — a `BaseInput` preconfigured for phone numbers: an optional
 * country selector (flag trigger), a dial-code prefix, a clear button, and a
 * rich `onChange` payload (`{ phoneNumber, dialCode, country, value, name }`)
 * powered by `@razorpay/i18nify-js`.
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
 * ```
 */
export { default as PhoneNumberInput } from './PhoneNumberInput.svelte';
export type {
  PhoneNumberInputProps,
  PhoneNumberInputInstance,
  PhoneNumberChangePayload,
} from './types';
