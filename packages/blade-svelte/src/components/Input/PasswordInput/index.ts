/**
 * PasswordInput — a masked input field built on top of `BaseInput`, with an
 * optional reveal button to toggle password visibility.
 *
 * The value is masked (`type="password"`) by default. When `showRevealButton`
 * is enabled (default) and the input is not disabled, a trailing eye button
 * toggles between masked and plain-text (`type="text"`).
 *
 * ### Deviations from React
 * - **`onSubmit`:** dropped — the Svelte `BaseInput` has no `onSubmit`
 *   (consistent with Svelte `TextInput`/`SearchInput`).
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { PasswordInput } from '@razorpay/blade-svelte/components';
 *   let password = $state('');
 * </script>
 *
 * <PasswordInput
 *   label="Enter Password"
 *   {value}
 *   onChange={({ value: v }) => (password = v ?? '')}
 * />
 * ```
 */
export { default as PasswordInput } from './PasswordInput.svelte';
export type { PasswordInputProps } from './types';
