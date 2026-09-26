<script lang="ts">
  import { Button, Modal, LayerHost } from '../../index';

  let isOpen = $state(false);
  let confirmOpen = $state(false);
</script>

<div
  class="relative [height:32rem] max-w-blade-760 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="p-6">
    <Button class="w-40" onClick={() => (isOpen = true)}>Open modal</Button>
  </div>
  <LayerHost />
</div>

<Modal bind:isOpen placement="bottom" title="Saved cards" closeLabel="Close">
  {#snippet body()}
    <Button
      variant="secondary"
      size="small"
      onClick={() => (confirmOpen = true)}
    >
      Remove a card
    </Button>
  {/snippet}
</Modal>

<Modal bind:isOpen={confirmOpen} title="Are you sure?" closeLabel="Close">
  {#snippet body({ close })}
    <Button color="negative" size="small" onClick={close}>Remove</Button>
  {/snippet}
</Modal>
