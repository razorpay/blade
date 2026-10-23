<script lang="ts">
  import { BladeProvider, Button } from '../../index';
    import { Modal } from '../../components/modal';
  import { BottomSheet } from '../../components/bottom-sheet';
  import {
    BottomSheetBody,
    BottomSheetHeader,
    ModalBody,
    ModalHeader,
  } from '../../components/modal-children';

  let isOpen = $state(false);
  let confirmOpen = $state(false);
</script>

<div
  class="relative h-[32rem] max-w-[760px] overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
<BladeProvider>
  <div class="p-6">
    <Button class="w-40" onClick={() => (isOpen = true)}>Open modal</Button>
  </div>
</BladeProvider>
</div>

<BottomSheet bind:isOpen closeLabel="Close">
  <BottomSheetHeader title="Saved cards" />
  <BottomSheetBody>
    <Button
      variant="secondary"
      size="small"
      onClick={() => (confirmOpen = true)}
    >
      Remove a card
    </Button>
  </BottomSheetBody>
</BottomSheet>

<Modal bind:isOpen={confirmOpen} closeLabel="Close">
  {#snippet children({ close })}
    <ModalHeader title="Are you sure?" />
    <ModalBody>
      <Button color="negative" size="small" onClick={close}>Remove</Button>
    </ModalBody>
  {/snippet}
</Modal>
