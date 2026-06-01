/**
 * # Collapsible
 *
 * A primitive expand/collapse component that supports a text label and an
 * optional leading icon in its trigger. Use `Collapsible` when you need a
 * standalone show/hide panel — for grouped accordion-style lists use `Accordion`.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import {
 *     Collapsible,
 *     CollapsibleTrigger,
 *     CollapsibleBody,
 *   } from '@razorpay/blade-svelte';
 *   import { InfoIcon } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Collapsible>
 *   {#snippet children()}
 *     <CollapsibleTrigger label="What is Razorpay Route?" icon={InfoIcon} />
 *     <CollapsibleBody>
 *       You can use Razorpay Route from the Dashboard or using APIs.
 *     </CollapsibleBody>
 *   {/snippet}
 * </Collapsible>
 * ```
 */
export { default as Collapsible } from './Collapsible.svelte';
export { default as CollapsibleTrigger } from './CollapsibleTrigger.svelte';
export { default as CollapsibleBody } from './CollapsibleBody.svelte';

export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleBodyProps,
  IconComponent as CollapsibleIconComponent,
} from './types';
