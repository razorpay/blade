/**
 * # CardGroup
 *
 * `CardGroup` stacks navigating, selecting and disclosing rows into a single
 * surface. It owns the border, radius, elevation, the gradient at the top and
 * bottom of the run, and the dividers between rows.
 *
 * - `CardGroupItem` is a row. It navigates (`href`) or selects (`onClick` /
 *   `isSelected`), never both. Placed inside a `CardGroupCollapsibleItem` it
 *   becomes the disclosure trigger.
 * - `CardGroupCollapsibleItem` is a row that discloses. It wraps `Collapsible`
 *   and exposes `isExpanded` / `defaultIsExpanded` / `onExpandChange`.
 * - `CardGroupCollapsibleItemBody` is the revealed content — a free slot.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import {
 *     CardGroup,
 *     CardGroupItem,
 *     CardGroupCollapsibleItem,
 *     CardGroupCollapsibleItemBody,
 *   } from '@razorpay/blade-svelte';
 * </script>
 *
 * <CardGroup accessibilityLabel="Payment methods">
 *   {#snippet children()}
 *     <CardGroupItem href="/cards">
 *       {#snippet children()}Cards{/snippet}
 *     </CardGroupItem>
 *
 *     <CardGroupCollapsibleItem defaultIsExpanded>
 *       {#snippet children()}
 *         <CardGroupItem>
 *           {#snippet children()}UPI{/snippet}
 *         </CardGroupItem>
 *         <CardGroupCollapsibleItemBody>
 *           {#snippet children()}Google Pay, PhonePe, PayTM{/snippet}
 *         </CardGroupCollapsibleItemBody>
 *       {/snippet}
 *     </CardGroupCollapsibleItem>
 *
 *     <CardGroupItem onClick={() => {}} isSelected>
 *       {#snippet children()}Wallet{/snippet}
 *     </CardGroupItem>
 *   {/snippet}
 * </CardGroup>
 * ```
 */
export { default as CardGroup } from './CardGroup.svelte';
export { default as CardGroupItem } from './CardGroupItem.svelte';
export { default as CardGroupCollapsibleItem } from './CardGroupCollapsibleItem.svelte';
export { default as CardGroupCollapsibleItemBody } from './CardGroupCollapsibleItemBody.svelte';

export type {
  CardGroupProps,
  CardGroupItemProps,
  CardGroupCollapsibleItemProps,
  CardGroupCollapsibleItemBodyProps,
} from './types';
