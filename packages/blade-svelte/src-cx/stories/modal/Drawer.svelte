<script lang="ts">
  import { Button, Drawer, LayerHost, Text } from '../../index';

  interface Props {
    args: {
      isDismissible?: boolean;
      isDraggable?: boolean;
      variant?: 'drawer' | 'left-drawer';
      pace?: 'default' | 'snappy';
    };
  }

  let { args }: Props = $props();

  let isOpen = $state(false);
  let lastSource = $state('—');
</script>

<div
  class="relative h-[32rem] overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="grid gap-4 p-6">
    <Button class="w-40" testID="open" onClick={() => (isOpen = true)}>Open drawer</Button>
    <Text size="small" color="muted">Last closed by: <span data-testid="last-source">{lastSource}</span></Text>
  </div>
  <LayerHost />
</div>

<Drawer
  bind:isOpen
  isDismissible={args.isDismissible}
  isDraggable={args.isDraggable}
  variant={args.variant}
  pace={args.pace}
  title="Filters"
  testID="drawer"
  onDismiss={({ source }) => {
    lastSource = source;
  }}
>
  {#snippet body()}
    <Text size="small" color="muted">
      A full-height panel on the {args.variant === 'left-drawer' ? 'left' : 'right'} edge: 90% wide on
      phones, 375px from 480px, 420px from 768px.
    </Text>
  {/snippet}
  {#snippet footer()}
    <Button class="w-full" onClick={() => (isOpen = false)}>Apply</Button>
  {/snippet}
</Drawer>
