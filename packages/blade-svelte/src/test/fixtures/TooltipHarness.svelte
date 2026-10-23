<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { Placement } from '../../runes/layer/placement';
  import ModalHeader from '../../components/modal-children/ModalHeader.svelte';
  import Modal from '../../components/modal/Modal.svelte';
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
    content={rich ? richContent : 'Charged by your bank'}
    {placement}
    {isDisabled}
    {onOpenChange}
    testID="tip"
    class="ml-2"
    title={richTitle ? titleSnippet : undefined}
  >
    {#snippet children({ isOpen })}<button data-testid="trigger" data-open={isOpen}>Fee</button>{/snippet}
  </Tooltip>
{/snippet}

{#snippet page()}
<main data-testid="page">
  {#if !inModal}
    {@render tip()}
  {/if}
  <button data-testid="elsewhere">Elsewhere</button>
</main>
{/snippet}

<div data-testid="frame">
  {#if withHost}
    <BladeProvider testID="host">{@render page()}</BladeProvider>
  {:else}
    {@render page()}
  {/if}
</div>

{#if inModal}
  <Modal isOpen closeLabel="Close" testID="modal">
    <ModalHeader title="Fees" />
    {@render tip()}
  </Modal>
{/if}
