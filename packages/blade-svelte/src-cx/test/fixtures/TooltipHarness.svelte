<script lang="ts">
  import type { Placement } from '../../runes';
  import Modal from '../../components/modal/Modal.svelte';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import Tooltip from '../../components/tooltip/Tooltip.svelte';

  interface Props {
    withHost?: boolean;
    inModal?: boolean;
    placement?: Placement;
    isDisabled?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
  }

  let {
    withHost = false,
    inModal = false,
    placement,
    isDisabled,
    onOpenChange,
  }: Props = $props();
</script>

{#snippet tip()}
  <Tooltip
    content="Charged by your bank"
    {placement}
    {isDisabled}
    {onOpenChange}
    testID="tip"
    class="ml-2"
  >
    <button data-testid="trigger">Fee</button>
  </Tooltip>
{/snippet}

<div data-testid="frame">
  <main data-testid="page">
    {#if !inModal}
      {@render tip()}
    {/if}
    <button data-testid="elsewhere">Elsewhere</button>
  </main>
  {#if withHost}
    <LayerHost testID="host" />
  {/if}
</div>

{#if inModal}
  <Modal isOpen title="Fees" closeLabel="Close" testID="modal">
    {@render tip()}
  </Modal>
{/if}
