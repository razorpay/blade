<script lang="ts">
  import {
    Button,
    Modal,
    LayerHost,
    type ModalStyleProps,
  } from '../../index';

  interface Props {
    args: ModalStyleProps & {
      isDismissible?: boolean;
      closeLabel?: string;
      title?: string;
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);
  let lastSource = $state('—');
</script>

<!-- The frame stands in for the checkout modal card: the modal stays inside it. -->
<div
  class="relative [height:32rem] max-w-blade-760 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="grid gap-4 p-6">
    <Button class="w-40" onClick={() => (isOpen = true)}>Open modal</Button>
    <p class="text-75 leading-50 text-surface-gray-subtle">Last closed by: {lastSource}</p>
  </div>
  <LayerHost />
</div>

<Modal
  bind:isOpen
  placement={args.placement}
  size={args.size}
  isDismissible={args.isDismissible}
  title={args.title}
  closeLabel={args.closeLabel || undefined}
  onDismiss={(source) => {
    lastSource = source;
  }}
>
  {#snippet body()}
    <p class="text-100 leading-100 text-surface-gray-subtle">
      The card ending 1111 will be removed from this device.
    </p>
  {/snippet}
  {#snippet footer()}
    <Button class="flex-1" variant="secondary" onClick={() => (isOpen = false)}>
      Cancel
    </Button>
    <Button class="flex-1" color="negative" onClick={() => (isOpen = false)}>
      Remove
    </Button>
  {/snippet}
</Modal>
