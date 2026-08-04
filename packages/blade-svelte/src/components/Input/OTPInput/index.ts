/**
 * OTPInput — a group of single-character `BaseInput` fields (4 or 6) for
 * one-time password / PIN entry. Handles cross-field focus, keyboard navigation
 * (Backspace / Arrow / Delete), paste of the full code, optional masking, and a
 * hidden aggregate `<input>` that carries the joined value for form submission.
 *
 * ### Deviations from React
 * - **`ref` → `focus(index)`:** React exposes an array of input refs
 *   (`inputRef.current[i].focus()`). In Svelte, bind the component instance and
 *   call `instance.focus(index)` to focus a specific field.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { OTPInput } from '@razorpay/blade-svelte/components';
 *   let otp = $state('');
 * </script>
 *
 * <OTPInput
 *   label="Enter OTP"
 *   otpLength={6}
 *   onOTPFilled={({ value }) => console.log('filled', value)}
 *   onChange={({ value }) => (otp = value ?? '')}
 * />
 * ```
 */
export { default as OTPInput } from './OTPInput.svelte';
export type { OTPInputProps, OTPInputInstance, OTPInputOnEventWithIndex } from './types';
