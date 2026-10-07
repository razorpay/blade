<script lang="ts">
  import { Button, BottomSheet, LayerHost, Text } from '../../index';

  interface Props {
    args: {
      isDismissible?: boolean;
      isDraggable?: boolean;
      variant?: 'sheet' | 'modal';
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);
  let lastSource = $state('—');
</script>

<!-- The frame stands in for the checkout modal card: the sheet stays inside it. -->
<div
  class="relative h-[32rem] max-w-96 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="grid gap-4 p-6">
    <Button class="w-40" testID="open" onClick={() => (isOpen = true)}>Open sheet</Button>
    <Text size="small" color="muted">Last closed by: <span data-testid="last-source">{lastSource}</span></Text>
  </div>
  <LayerHost />
</div>

<BottomSheet
  bind:isOpen
  isDismissible={args.isDismissible}
  isDraggable={args.isDraggable}
  variant={args.variant}
  title="Confirm payment"
  testID="sheet"
  onDismiss={({ source }) => {
    lastSource = source;
  }}
>
  {#snippet body()}
    <Text size="small" color="muted">
      Drag the handle or the header down to dismiss, or fling it. A short drag
      settles back.
    </Text>
  {/snippet}
  {#snippet footer()}
    <Button class="w-full" onClick={() => (isOpen = false)}>Pay now</Button>
  {/snippet}
</BottomSheet>
