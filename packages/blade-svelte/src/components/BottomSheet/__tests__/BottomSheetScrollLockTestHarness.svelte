<script lang="ts">
  import BottomSheet from '../BottomSheet.svelte';
  import BottomSheetBody from '../BottomSheetBody.svelte';

  let {
    isOpen = false,
    disableScrollLock = false,
    onDismiss,
  }: {
    isOpen?: boolean;
    disableScrollLock?: boolean;
    onDismiss?: () => void;
  } = $props();
</script>

<BottomSheet {isOpen} {disableScrollLock} {onDismiss}>
  {#snippet children()}
    <BottomSheetBody>
      {#snippet children()}
        <p data-testid="sheet-body-content">body content</p>
      {/snippet}
    </BottomSheetBody>
  {/snippet}
</BottomSheet>
