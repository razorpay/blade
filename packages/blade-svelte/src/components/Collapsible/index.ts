/**
 * # Collapsible
 *
 * Collapsible is used to allow users to toggle the visibility of hidden content
 * within a container. Compose `Collapsible` with `CollapsibleButton` /
 * `CollapsibleLink` and `CollapsibleBody`.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import {
 *     Collapsible,
 *     CollapsibleButton,
 *     CollapsibleBody,
 *   } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Collapsible>
 *   {#snippet children()}
 *     <CollapsibleButton>View Price Breakdown</CollapsibleButton>
 *     <CollapsibleBody>
 *       You can use Razorpay Route from the Dashboard or using APIs.
 *     </CollapsibleBody>
 *   {/snippet}
 * </Collapsible>
 * ```
 */
export { default as Collapsible } from './Collapsible.svelte';
export { default as CollapsibleButton } from './CollapsibleButton.svelte';
export { default as CollapsibleLink } from './CollapsibleLink.svelte';
export { default as CollapsibleBody } from './CollapsibleBody.svelte';

export type {
  CollapsibleProps,
  CollapsibleButtonProps,
  CollapsibleLinkProps,
  CollapsibleBodyProps,
} from './types';
