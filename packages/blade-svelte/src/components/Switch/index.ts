/**
 * Switch component
 *
 * A two-state toggle used for binary, immediate-effect actions.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { Switch } from '@razorpay/blade-svelte';
 *
 *   let isOn = $state(false);
 * </script>
 *
 * <Switch
 *   accessibilityLabel="Toggle dark mode"
 *   isChecked={isOn}
 *   onChange={(e) => (isOn = e.isChecked)}
 * />
 * ```
 */
export { default as Switch } from './Switch.svelte';
export type { SwitchProps, SwitchOnChange, SwitchInstance } from './types';
