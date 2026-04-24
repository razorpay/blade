/**
 * # Accordion
 *
 * An accordion is used to allow users to toggle between different content sections
 * in a compact vertical stack.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import { Accordion, AccordionItem, AccordionItemHeader, AccordionItemBody } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Accordion>
 *   {#snippet children()}
 *     <AccordionItem>
 *       {#snippet children()}
 *         <AccordionItemHeader title="How can I setup Route?" />
 *         <AccordionItemBody>
 *           You can use Razorpay Route from the Dashboard or using APIs.
 *         </AccordionItemBody>
 *       {/snippet}
 *     </AccordionItem>
 *   {/snippet}
 * </Accordion>
 * ```
 */
export { default as Accordion } from './Accordion.svelte';
export { default as AccordionItem } from './AccordionItem.svelte';
export { default as AccordionItemHeader } from './AccordionItemHeader.svelte';
export { default as AccordionItemBody } from './AccordionItemBody.svelte';

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionItemHeaderProps,
  AccordionItemBodyProps,
  AccordionVariantType,
} from './types';
