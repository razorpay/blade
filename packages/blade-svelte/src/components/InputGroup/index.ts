/**
 * `InputGroup` groups related form inputs with a shared label, hint, and
 * connected (merged) corners. Wrap inputs in `InputRow`s to control column layout.
 *
 * @example
 * ```svelte
 * <script>
 *   import { InputGroup, InputRow, TextInput } from '@razorpay/blade-svelte';
 * </script>
 *
 * <InputGroup label="Shipping Address" helpText="Where should we deliver your order?">
 *   <InputRow gridTemplateColumns="1fr">
 *     <TextInput label="Street Address" placeholder="Street Address" />
 *   </InputRow>
 *   <InputRow gridTemplateColumns="1fr 1fr">
 *     <TextInput label="City" placeholder="City" />
 *     <TextInput label="ZIP Code" placeholder="ZIP Code" />
 *   </InputRow>
 * </InputGroup>
 * ```
 */
export { default as InputGroup } from './InputGroup.svelte';
export { default as InputRow } from './InputRow.svelte';
export type { InputGroupProps, InputRowProps, InputGroupContextType } from './types';
