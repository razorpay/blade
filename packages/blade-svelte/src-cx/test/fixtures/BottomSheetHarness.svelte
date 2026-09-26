<script lang="ts">
  import type { DialogCloseSource } from '../../runes';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import {
    BottomSheet,
    type BottomSheetStyleProps,
  } from '../../components/bottom-sheet';

  interface Props {
    isOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (source: DialogCloseSource) => void;
    closeLabel?: string;
    title?: string;
    size?: BottomSheetStyleProps['size'];
    pace?: BottomSheetStyleProps['pace'];
    adaptive?: boolean;
    placement?: BottomSheetStyleProps['placement'];
    className?: string;
  }

  let {
    isOpen = $bindable(false),
    isDismissible,
    onDismiss,
    closeLabel = 'Close',
    title = 'Enter OTP',
    size,
    pace,
    adaptive,
    placement,
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
  {size}
  {pace}
  {adaptive}
  {placement}
  class={className}
  testID="sheet"
>
  {#snippet children({ close })}
    <button data-testid="cancel" onclick={close}>Cancel</button>
  {/snippet}
  {#snippet footer()}
    <button data-testid="last">Verify</button>
  {/snippet}
</BottomSheet>
<p data-testid="bound">{isOpen ? 'open' : 'closed'}</p>
