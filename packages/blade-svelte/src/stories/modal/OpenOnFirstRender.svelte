<script lang="ts">
  import { BladeProvider, Button, Modal, ModalBody, ModalHeader, Text, isModalOpen } from '../../index';

  // Open from the first render, and inside the provider: the modal renders
  // in place before the overlay host is there, then moves into the host.
  // The page beside it is the app's to make inert.
  let isOpen = $state(true);
</script>

<div
  class="relative h-[32rem] max-w-[760px] overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <BladeProvider testID="host">
    <div class="p-6" inert={isModalOpen()} data-testid="page">
      <Button testID="open" onClick={() => (isOpen = true)}>Open modal</Button>
    </div>
    <Modal bind:isOpen size="small" closeLabel="Close" testID="modal">
      <ModalHeader title="Your session is about to expire" />
      <ModalBody><Text>Open as the page loads, with focus already inside.</Text></ModalBody>
    </Modal>
  </BladeProvider>
</div>
