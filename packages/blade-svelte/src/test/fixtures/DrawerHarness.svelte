<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
  import DrawerHeader from '../../components/modal-children/DrawerHeader.svelte';
  import DrawerBody from '../../components/modal-children/DrawerBody.svelte';
  import { Drawer, type DrawerStyleProps } from '../../components/drawer';

  interface Props {
    isOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (event: DialogDismissEvent) => void;
    title?: string;
    side?: DrawerStyleProps['side'];
    pace?: DrawerStyleProps['pace'];
    isDraggable?: boolean;
    className?: string;
  }

  let {
    isOpen = $bindable(false),
    isDismissible,
    onDismiss,
    title = 'Filters',
    side,
    pace,
    isDraggable,
    className,
  }: Props = $props();
</script>

<BladeProvider testID="host">
<button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>

<Drawer
  bind:isOpen
  {isDismissible}
  {onDismiss}
  {side}
  {pace}
  {isDraggable}
  class={className}
  testID="drawer"
>
  {#snippet children({ close })}
    <DrawerHeader {title} testID="drawer-header" />
    <DrawerBody>
      <button data-testid="cancel" onclick={close}>Cancel</button>
    </DrawerBody>
  {/snippet}
</Drawer>
<p data-testid="bound">{isOpen ? 'open' : 'closed'}</p>
</BladeProvider>
