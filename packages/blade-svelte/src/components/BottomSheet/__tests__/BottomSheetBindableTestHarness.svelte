<script lang="ts">
  import BottomSheet from '../BottomSheet.svelte';

  let {
    isOpen = false,
    isDismissible = true,
  }: {
    isOpen?: boolean;
    isDismissible?: boolean;
  } = $props();
</script>

<span data-testid="bound-is-open">{String(isOpen)}</span>

<button type="button" data-testid="open-sheet" onclick={() => (isOpen = true)}>open</button>
<BottomSheet bind:isOpen {isDismissible}>
  {#snippet children()}
    <button type="button" data-testid="inside">inside</button>
  {/snippet}
</BottomSheet>