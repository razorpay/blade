/**
 * TextInput — a single-line text field built on top of `BaseInput`.
 *
 * Supports label/help/error/success text, prefix/suffix, leading/trailing
 * icons, a clear button, a loading spinner, a character counter, and pattern
 * `format`ting.
 *
 * ### Deviations from React
 * - **`leading`/`trailing`:** React overloads these to accept an icon component
 *   OR an element. In Svelte a component and a snippet are both functions and
 *   can't be reliably distinguished, so pass icons via `leadingIcon`/
 *   `trailingIcon` and elements via the `leading`/`trailing` snippets.
 * - **Tags + Dropdown:** `isTaggedInput`/`tags`/leading+trailing Dropdown are
 *   out of scope (depend on unmigrated Tag/Dropdown).
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { TextInput } from '@razorpay/blade-svelte/components';
 *   let value = $state('');
 * </script>
 *
 * <TextInput
 *   label="Name"
 *   placeholder="Enter your name"
 *   {value}
 *   onChange={({ value: v }) => (value = v ?? '')}
 * />
 * ```
 */
export { default as TextInput } from './TextInput.svelte';
export type { TextInputProps, TextInputType } from './types';
