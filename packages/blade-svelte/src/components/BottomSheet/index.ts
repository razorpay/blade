/**
 * BottomSheet — a portal-style overlay that slides up from the bottom of the
 * viewport, exposing a header / body / footer composition. Drag-to-dismiss,
 * snap-points, body scroll lock, and stack-aware z-index are all wired
 * internally; consumers only manage `isOpen`.
 *
 * @example
 * ```svelte
 * <script>
 *   import {
 *     BottomSheet,
 *     BottomSheetHeader,
 *     BottomSheetBody,
 *     BottomSheetFooter,
 *     Button,
 *   } from '@razorpay/blade-svelte/components';
 *
 *   let isOpen = $state(false);
 * </script>
 *
 * <Button onClick={() => (isOpen = true)}>Open</Button>
 * <BottomSheet {isOpen} onDismiss={() => (isOpen = false)}>
 *   {#snippet children()}
 *     <BottomSheetHeader title="Terms & Conditions" />
 *     <BottomSheetBody>
 *       {#snippet children()}
 *         <p>Body content goes here.</p>
 *       {/snippet}
 *     </BottomSheetBody>
 *     <BottomSheetFooter>
 *       {#snippet children()}
 *         <Button>Continue</Button>
 *       {/snippet}
 *     </BottomSheetFooter>
 *   {/snippet}
 * </BottomSheet>
 * ```
 */
export { default as BottomSheet } from './BottomSheet.svelte';
export { default as BottomSheetHeader } from './BottomSheetHeader.svelte';
export { default as BottomSheetBody } from './BottomSheetBody.svelte';
export { default as BottomSheetFooter } from './BottomSheetFooter.svelte';
export { default as BottomSheetBackdrop } from './BottomSheetBackdrop.svelte';

export type {
  BottomSheetProps,
  BottomSheetHeaderProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
  SnapPoints,
} from './types';

export {
  bottomSheetStack,
  addBottomSheetToStack,
  removeBottomSheetFromStack,
  getTopOfTheStack,
  getCurrentStackIndexById,
} from './bottomSheetStack';
