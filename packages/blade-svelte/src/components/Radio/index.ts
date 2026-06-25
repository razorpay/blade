/**
 * Radio & RadioGroup — single-select form controls.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Radio, RadioGroup } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <RadioGroup
 *   label="Where do you want to collect payments?"
 *   helpText="Select only one"
 *   name="payment-collection"
 *   defaultValue="website"
 *   onChange={({ name, value }) => console.log({ name, value })}
 * >
 *   <Radio value="website">Website</Radio>
 *   <Radio value="android">Android App</Radio>
 *   <Radio value="ios">iOS App</Radio>
 * </RadioGroup>
 * ```
 */
export { default as Radio } from './Radio.svelte';
export { default as RadioGroup } from './RadioGroup.svelte';
export type {
  RadioProps,
  RadioGroupProps,
  RadioGroupOnChange,
  RadioInstance,
  RadioSize,
} from './types';
