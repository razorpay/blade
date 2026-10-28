<script lang="ts">
  import type { BladeAdapters } from '../../adapters';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import ModalHeader from '../../components/modal-children/ModalHeader.svelte';
  import Popover from '../../components/popover/Popover.svelte';
  import type { Layers } from '../../runes/layer/layers';
  import LayersProbe from './LayersProbe.svelte';

  interface Props {
    adapters?: BladeAdapters;
    kind?: 'modal' | 'popover';
    /** The provider's layers, for a test that drives the host. */
    onLayers?: (layers: Layers) => void;
    isolatePage?: boolean;
  }

  let { adapters, kind = 'modal', onLayers, isolatePage = true }: Props = $props();
  // Open from the first render: the host mounts after it.
  let isOpen = $state(true);
</script>

{#snippet trigger()}
  <button type="button" data-testid="open">Open</button>
{/snippet}

<BladeProvider {adapters} {isolatePage} testID="host">
  <p data-testid="page">Page</p>
  {#if onLayers}<LayersProbe onReady={(layers) => onLayers(layers)} />{/if}
  {#if kind === 'modal'}
    <Modal bind:isOpen testID="modal">
      <ModalHeader title="Remove card?" />
    </Modal>
  {:else}
    <Popover bind:isOpen children={trigger} accessibilityLabel="Fees" testID="popover">
      {#snippet content()}
        <p>2% of the amount</p>
      {/snippet}
    </Popover>
  {/if}
</BladeProvider>
