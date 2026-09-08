<script lang="ts">
  import BottomSheet from '../BottomSheet.svelte';

  let {
    isOpen = false,
    isDismissible = true,
    onDismiss,
  }: {
    isOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: () => void;
  } = $props();

  /* Element the sheet should focus on open. Lives inside the sheet body and is
   * wired via `initialFocusRef` so the test can assert `focus({ preventScroll })`
   * without depending on the internal close-button markup. */
  let focusEl = $state<HTMLElement | null>(null);
</script>

<button type="button" data-testid="trigger">open</button>

<BottomSheet {isOpen} {isDismissible} {onDismiss} initialFocusRef={focusEl}>
  {#snippet children()}
    <button type="button" bind:this={focusEl} data-testid="focus-target">focus me</button>
  {/snippet}
</BottomSheet>
