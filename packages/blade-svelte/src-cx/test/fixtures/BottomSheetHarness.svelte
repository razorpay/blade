<script lang="ts">
  import type { DialogDismissEvent } from '../../runes';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import {
    BottomSheet,
    type BottomSheetStyleProps,
  } from '../../components/bottom-sheet';

  interface Props {
    isOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (event: DialogDismissEvent) => void;
    closeLabel?: string;
    title?: string;
    pace?: BottomSheetStyleProps['pace'];
    isDraggable?: boolean;
    variant?: 'modal' | 'sheet';
    className?: string;
  }

  let {
    isOpen = $bindable(false),
    isDismissible,
    onDismiss,
    closeLabel = 'Close',
    title = 'Enter OTP',
    pace,
    isDraggable,
    variant,
    className,
  }: Props = $props();
</script>

<button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>
<LayerHost testID="host" />

<BottomSheet
  bind:isOpen
  {isDismissible}
  {onDismiss}
  {closeLabel}
  {title}
  {pace}
  {isDraggable}
  {variant}
  class={className}
  testID="sheet"
>
  {#snippet children({ close })}
    <button data-testid="cancel" onclick={close}>Cancel</button>
  {/snippet}
  {#snippet footer(_: { close: () => void })}
    <button data-testid="last">Verify</button>
  {/snippet}
</BottomSheet>
<p data-testid="bound">{isOpen ? 'open' : 'closed'}</p>
