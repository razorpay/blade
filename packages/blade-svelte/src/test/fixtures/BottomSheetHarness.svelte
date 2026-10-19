<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
  import BottomSheetHeader from '../../components/modal-children/BottomSheetHeader.svelte';
  import BottomSheetFooter from '../../components/modal-children/BottomSheetFooter.svelte';
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
    className,
  }: Props = $props();
</script>

<BladeProvider testID="host">
<button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>

<BottomSheet
  bind:isOpen
  {isDismissible}
  {onDismiss}
  {closeLabel}
  {pace}
  {isDraggable}
  class={className}
  testID="sheet"
>
  {#snippet children({ close })}
    <BottomSheetHeader {title} />
    <button data-testid="cancel" onclick={close}>Cancel</button>
    <BottomSheetFooter>
      <button data-testid="last">Verify</button>
    </BottomSheetFooter>
  {/snippet}
</BottomSheet>
<p data-testid="bound">{isOpen ? 'open' : 'closed'}</p>
</BladeProvider>
