/**
 * # StepGroup
 *
 * StepGroup visualises sequential processes with a consistent structure.
 * It can be interactive, guiding users through steps, or function as a timeline for reference.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import { StepGroup, StepItem, StepItemIndicator } from '@razorpay/blade-svelte';
 * </script>
 *
 * <StepGroup orientation="vertical" size="medium">
 *   {#snippet children()}
 *     <StepItem title="Personal Details" stepProgress="full">
 *       {#snippet marker()}
 *         <StepItemIndicator color="positive" />
 *       {/snippet}
 *     </StepItem>
 *     <StepItem title="Business Details" />
 *   {/snippet}
 * </StepGroup>
 * ```
 */
export { default as StepGroup } from './StepGroup.svelte';
export { default as StepItem } from './StepItem.svelte';
export { default as StepItemIndicator } from './StepItemIndicator.svelte';
export { default as StepItemIcon } from './StepItemIcon.svelte';

export type {
  StepGroupProps,
  StepItemProps,
  StepItemIndicatorProps,
  StepItemIconProps,
  StepGroupSize,
  StepGroupOrientation,
  StepItemMarkerColor,
  StepProgress,
} from './types';
