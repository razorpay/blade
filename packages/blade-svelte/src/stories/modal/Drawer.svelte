<script lang="ts">
  import { BladeProvider, Button, Text } from '../../index';
    import { Drawer } from '../../components/drawer';
  import { DrawerBody, DrawerFooter, DrawerHeader } from '../../components/modal-children';

  interface Props {
    args: {
      isDismissible?: boolean;
      isDraggable?: boolean;
      side?: 'right' | 'left';
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
<BladeProvider>
  <div class="grid gap-4 p-6">
    <Button class="w-40" testID="open" onClick={() => (isOpen = true)}>Open drawer</Button>
    <Text size="small" color="muted">Last closed by: <span data-testid="last-source">{lastSource}</span></Text>
  </div>
</BladeProvider>
</div>

<Drawer
  bind:isOpen
  isDismissible={args.isDismissible}
  isDraggable={args.isDraggable}
  side={args.side}
  pace={args.pace}
  testID="drawer"
  onDismiss={({ source }) => {
    lastSource = source;
  }}
>
  <DrawerHeader title="Filters" />
  <DrawerBody>
    <Text size="small" color="muted">
      A full-height panel on the {args.side === 'left' ? 'left' : 'right'} edge: 24px short of
      the screen on phones, 380px on desktop.
    </Text>
  </DrawerBody>
  <DrawerFooter>
    <Button class="w-full" onClick={() => (isOpen = false)}>Apply</Button>
  </DrawerFooter>
</Drawer>
