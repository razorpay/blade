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
    onOpenChange?: (change: { isOpen: boolean }) => void;
    /** Rich content through `children` in place of `content`. */
    rich?: boolean;
    /** A title snippet above the content. */
    richTitle?: boolean;
  }

  let {
    withHost = false,
    inModal = false,
    placement,
    isDisabled,
    onOpenChange,
    rich = false,
    richTitle = false,
  }: Props = $props();
</script>

{#snippet titleSnippet()}<em data-testid="rich-title">Fee</em> details{/snippet}

{#snippet richContent()}<strong data-testid="rich">2%</strong> of the amount{/snippet}

{#snippet tip()}
  <Tooltip
    content="Charged by your bank"
    {placement}
    {isDisabled}
    {onOpenChange}
    testID="tip"
    class="ml-2"
    children={rich ? richContent : undefined}
    title={richTitle ? titleSnippet : undefined}
  >
    {#snippet trigger({ isOpen })}<button data-testid="trigger" data-open={isOpen}>Fee</button>{/snippet}
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
