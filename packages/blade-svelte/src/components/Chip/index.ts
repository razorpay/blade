/**
 * Chip and ChipGroup components.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Chip, ChipGroup } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <ChipGroup
 *   label="Select Business type:"
 *   selectionType="single"
 *   defaultValue="proprietorship"
 *   onChange={({ name, values }) => console.log({ name, values })}
 * >
 *   {#snippet children()}
 *     <Chip value="proprietorship">Proprietorship</Chip>
 *     <Chip value="public">Public</Chip>
 *     <Chip value="small-business">Small Business</Chip>
 *   {/snippet}
 * </ChipGroup>
 * ```
 */
export { default as Chip } from './Chip.svelte';
export { default as ChipGroup } from './ChipGroup.svelte';
export type { ChipProps, ChipGroupProps } from './types';
