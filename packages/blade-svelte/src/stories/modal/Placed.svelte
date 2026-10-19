<script lang="ts">
  import { BladeProvider, Button, Modal, ModalBody, ModalHeader, Text } from '../../index';

  interface Props {
    args: { placement?: 'top-end' | 'bottom-start' | 'top-start' };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);

  // `classes.root` replaces where the panel sits in the host (the layout's
  // alignment and gutter); the panel keeps its look and size.
  const ROOT = {
    'top-end': 'items-start justify-end p-6',
    'bottom-start': 'items-end justify-start p-6',
    'top-start': 'items-start justify-start pt-24 pl-6',
  };
</script>

<div
  class="relative h-[32rem] max-w-[760px] overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <BladeProvider>
    <div class="p-6">
      <Button onClick={() => (isOpen = true)}>Open a placed modal</Button>
    </div>
  </BladeProvider>
</div>

<Modal bind:isOpen size="small" closeLabel="Close" classes={{ root: ROOT[args.placement ?? 'top-end'] }}>
  <ModalHeader title="Saved cards" />
  <ModalBody><Text>Sits where its `classes.root` puts it.</Text></ModalBody>
</Modal>
