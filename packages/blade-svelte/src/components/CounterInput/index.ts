/**
 * CounterInput component
 *
 * Lets users increment or decrement a numerical value using built-in controls,
 * with manual text-input support. Supports controlled and uncontrolled usage.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { CounterInput } from '@razorpay/blade-svelte';
 *
 *   let quantity = $state(1);
 * </script>
 *
 * <CounterInput
 *   label="Quantity"
 *   value={quantity}
 *   min={1}
 *   max={10}
 *   onChange={({ value }) => (quantity = value)}
 * />
 * ```
 */
export { default as CounterInput } from './CounterInput.svelte';
export type {
  CounterInputProps,
  CounterInputEmphasis,
  CounterInputSize,
  CounterInputOnChange,
} from './types';
