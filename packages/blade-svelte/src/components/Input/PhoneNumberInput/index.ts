/**
 * PhoneNumberInput — a `BaseInput` preconfigured for phone numbers: an optional
 * country selector (flag trigger), a dial-code prefix, a clear button, and a
 * rich `onChange` payload (`{ phoneNumber, dialCode, country, value, name }`)
 * powered by `@razorpay/i18nify-js`.
 *
 * ### Deviations from React
 * - **Country list uses a desktop popover, BottomSheet on mobile (like React).**
 *   On desktop (≥ 768px) the selector opens an anchored, floating `ActionList`
 *   popover positioned with `@floating-ui/dom` and portaled to `body`; on mobile
 *   (and SSR/non-browser where `matchMedia` is unavailable) it falls back to the
 *   migrated `BottomSheet`. There is no eager Dropdown migration — the desktop
 *   popover reuses the standalone `ActionList` render branch.
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
