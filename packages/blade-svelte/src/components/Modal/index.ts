/**
 * Modal — a centered, portal-style overlay dialog exposing a header / body /
 * footer composition. Focus trap + return focus, backdrop / escape dismissal,
 * body scroll lock, and enter/exit animation are wired internally; consumers
 * only manage `isOpen`.
 *
 * @example
 * ```svelte
 * <script>
 *   import {
 *     Modal,
 *     ModalHeader,
 *     ModalBody,
 *     ModalFooter,
 *     Button,
 *   } from '@razorpay/blade-svelte/components';
 *
 *   let isOpen = $state(false);
 * </script>
 *
 * <Button onClick={() => (isOpen = true)}>Open</Button>
 * <Modal {isOpen} onDismiss={() => (isOpen = false)} size="medium">
 *   {#snippet children()}
 *     <ModalHeader title="Address Details" subtitle="Add a new address" />
 *     <ModalBody>
 *       {#snippet children()}
 *         <p>Body content goes here.</p>
 *       {/snippet}
 *     </ModalBody>
 *     <ModalFooter>
 *       {#snippet children()}
 *         <Button onClick={() => (isOpen = false)}>Done</Button>
 *       {/snippet}
 *     </ModalFooter>
 *   {/snippet}
 * </Modal>
 * ```
 */
export { default as Modal } from './Modal.svelte';
export { default as ModalHeader } from './ModalHeader.svelte';
export { default as ModalBody } from './ModalBody.svelte';
export { default as ModalFooter } from './ModalFooter.svelte';

export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps } from './types';
