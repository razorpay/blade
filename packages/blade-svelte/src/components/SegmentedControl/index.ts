/**
 * SegmentedControl — a single-select value picker styled as a horizontal pill bar.
 *
 * @example
 * ```svelte
 * <script>
 *   import { SegmentedControl, SegmentedControlItem } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <SegmentedControl defaultValue="daily" label="Time Period">
 *   {#snippet children()}
 *     <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
 *     <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
 *     <SegmentedControlItem value="monthly" isDisabled>Monthly</SegmentedControlItem>
 *   {/snippet}
 * </SegmentedControl>
 * ```
 */
export { default as SegmentedControl } from './SegmentedControl.svelte';
export { default as SegmentedControlItem } from './SegmentedControlItem.svelte';
export type {
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlSize,
} from './types';
