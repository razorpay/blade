<script lang="ts">
  import BottomSheet from '../BottomSheet.svelte';
  import BottomSheetBody from '../BottomSheetBody.svelte';

  let {
    isOpen = false,
    onDismiss,
  }: {
    isOpen?: boolean;
    onDismiss?: () => void;
  } = $props();
</script>

<BottomSheet {isOpen} {onDismiss}>
  {#snippet children()}
    <BottomSheetBody>
      {#snippet children()}
        <p data-testid="sheet-body-content">body content</p>
      {/snippet}
    </BottomSheetBody>
  {/snippet}
</BottomSheet>
