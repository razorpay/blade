/**
 * SearchInput — a `BaseInput` preconfigured for search: a leading search icon,
 * a clear button that appears once there's a value, and an optional loading
 * spinner.
 *
 * ### Deviations from React
 * - **Dropdown / Modal / TopNav integration removed:** the React SearchInput
 *   doubles as a Dropdown trigger and re-themes inside TopNav/Modal. Those
 *   depend on unmigrated Dropdown/Modal/TopNav and are out of scope.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { SearchInput } from '@razorpay/blade-svelte/components';
 *   let query = $state('');
 * </script>
 *
 * <SearchInput
 *   label="Search"
 *   placeholder="Search payments"
 *   {value}
 *   onChange={({ value: v }) => (query = v ?? '')}
 * />
 * ```
 */
export { default as SearchInput } from './SearchInput.svelte';
export type { SearchInputProps } from './types';
