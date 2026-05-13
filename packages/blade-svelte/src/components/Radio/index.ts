/**
 * Radio & RadioGroup — single-selection form control components.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Radio, RadioGroup } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <RadioGroup
 *   label="Where do you want to collect payments?"
 *   name="payment-collection"
 *   onChange={({ name, value }) => console.log({ name, value })}
 *   defaultValue="website"
 * >
 *   <Radio value="website">Website</Radio>
 *   <Radio value="android">Android App</Radio>
 *   <Radio value="ios">iOS App</Radio>
 *   <Radio value="social-media" helpText="Like WhatsApp, Facebook, Instagram">
 *     Social Media
 *   </Radio>
 * </RadioGroup>
 * ```
 */
export { default as Radio } from './Radio.svelte';
export { default as RadioGroup } from './RadioGroup.svelte';
export type { RadioProps, RadioGroupProps } from './types';
