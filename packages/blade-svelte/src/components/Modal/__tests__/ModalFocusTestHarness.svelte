<script lang="ts">
  import Modal from '../Modal.svelte';

  let {
    isOpen = false,
    isDismissible = true,
    accessibilityLabel = 'Test modal',
    onDismiss,
  }: {
    isOpen?: boolean;
    isDismissible?: boolean;
    accessibilityLabel?: string | undefined;
    onDismiss?: () => void;
  } = $props();

  /* Element the modal should focus on open. Lives inside the surface and is
   * wired via `initialFocusRef` so the test can assert `focus({ preventScroll })`
   * without depending on the internal close-button markup. */
  let focusEl = $state<HTMLElement | null>(null);
</script>

<button type="button" data-testid="trigger">open</button>

<Modal {isOpen} {isDismissible} {accessibilityLabel} {onDismiss} initialFocusRef={focusEl}>
  {#snippet children()}
    <button type="button" bind:this={focusEl} data-testid="focus-target">focus me</button>
    <button type="button" data-testid="second-focusable">second</button>
  {/snippet}
</Modal>
