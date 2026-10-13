<script lang="ts">
  import type { DialogDismissEvent } from '../../runes';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { Drawer, type DrawerStyleProps } from '../../components/drawer';

  interface Props {
    isOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (event: DialogDismissEvent) => void;
    title?: string;
    variant?: DrawerStyleProps['variant'];
    pace?: DrawerStyleProps['pace'];
    isDraggable?: boolean;
    className?: string;
  }

  let {
    isOpen = $bindable(false),
    isDismissible,
    onDismiss,
    title = 'Filters',
    variant,
    pace,
    isDraggable,
    className,
  }: Props = $props();
</script>

<button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>
<LayerHost testID="host" />

<Drawer
  bind:isOpen
  {isDismissible}
  {onDismiss}
  {title}
  {variant}
  {pace}
  {isDraggable}
  class={className}
  testID="drawer"
>
  {#snippet body({ close })}
    <button data-testid="cancel" onclick={close}>Cancel</button>
  {/snippet}
</Drawer>
<p data-testid="bound">{isOpen ? 'open' : 'closed'}</p>
