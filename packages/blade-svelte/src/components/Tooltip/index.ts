/**
 * Tooltip component — provides additional context about an element on hover or focus.
 *
 * Triggered automatically by mouse hover (desktop) and keyboard focus.
 * Wrap non-interactive triggers (icons, badges, counters) with
 * `TooltipInteractiveWrapper` so they remain reachable.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Tooltip, Button } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Tooltip content="Amount reversed to customer bank account" placement="bottom">
 *   {#snippet children()}
 *     <Button>Hover over me</Button>
 *   {/snippet}
 * </Tooltip>
 * ```
 */
export { default as Tooltip } from './Tooltip.svelte';
export { default as TooltipInteractiveWrapper } from './TooltipInteractiveWrapper.svelte';
export type { TooltipProps, TooltipPlacement, TooltipInteractiveWrapperProps } from './types';
