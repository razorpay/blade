<script lang="ts">
  import {
    Button,
    Icon,
    Modal,
    LayerHost,
    icons,
    type ModalStyleProps,
  } from '../../index';

  interface Props {
    args: ModalStyleProps & {
      isDismissible?: boolean;
      closeLabel?: string;
      title?: string;
      withChrome?: boolean;
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);
  let lastSource = $state('—');
</script>

<!-- The frame stands in for the checkout modal card: the modal stays inside it. -->
<div
  class="relative h-[32rem] max-w-[760px] overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="grid gap-4 p-6">
    <Button class="w-40" onClick={() => (isOpen = true)}>Open modal</Button>
    <p class="text-75 leading-50 text-surface-gray-subtle">Last closed by: {lastSource}</p>
  </div>
  <LayerHost />
</div>

<Modal
  bind:isOpen
  variant={args.variant}
  size={args.size}
  isDismissible={args.isDismissible}
  title={args.title}
  closeLabel={args.closeLabel || undefined}
  onDismiss={({ source }) => {
    lastSource = source;
  }}
>
  {#snippet chrome()}
    {#if args.withChrome}
      <!-- Hangs half over the panel's top edge; the panel does not clip it. -->
      <div
        class="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-max border-thin border-solid border-surface-gray-muted bg-popup-gray-subtle text-surface-gray-normal shadow-highRaised"
        aria-hidden="true"
      >
        <Icon source={icons.card} size="large" />
      </div>
    {/if}
  {/snippet}
  {#snippet body()}
    <p class="text-100 leading-100 text-surface-gray-subtle">
      The card ending 1111 will be removed from this device.
    </p>
  {/snippet}
  {#snippet footer()}
    <div class="flex justify-end gap-3">
      <Button variant="secondary" onClick={() => (isOpen = false)}>Cancel</Button>
      <Button color="negative" onClick={() => (isOpen = false)}>Remove</Button>
    </div>
  {/snippet}
</Modal>
