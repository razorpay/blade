/**
 * Checkbox & CheckboxGroup — selection controls for forms.
 *
 * Use a standalone `Checkbox` for a single boolean choice, or wrap multiple
 * `Checkbox`es in a `CheckboxGroup` for managed multi-select state.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { Checkbox, CheckboxGroup } from '@razorpay/blade-svelte/components';
 *
 *   let values = $state<string[]>([]);
 * </script>
 *
 * <CheckboxGroup
 *   label="Where do you want to collect payments?"
 *   value={values}
 *   onChange={({ values: next }) => (values = next)}
 * >
 *   <Checkbox value="website">Website</Checkbox>
 *   <Checkbox value="android">Android App</Checkbox>
 *   <Checkbox value="ios">iOS App</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export { default as Checkbox } from './Checkbox.svelte';
export { default as CheckboxGroup } from './CheckboxGroup.svelte';
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxOnChange,
  CheckboxGroupOnChange,
  CheckboxInstance,
  CheckboxSize,
} from './types';
