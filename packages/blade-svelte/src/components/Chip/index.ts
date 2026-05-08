/**
 * Chip & ChipGroup — selection components for filtering and actions.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <ChipGroup label="Select Business type:" selectionType="single">
 *   <Chip value="proprietorship">Proprietorship</Chip>
 *   <Chip value="public">Public</Chip>
 *   <Chip value="small-business">Small Business</Chip>
 * </ChipGroup>
 * ```
 */
export { default as Chip } from './Chip.svelte';
export { default as ChipGroup } from './ChipGroup.svelte';
export type { ChipProps, ChipGroupProps } from './types';
