<script lang="ts">
  import type { BladeAdapters } from '../../adapters';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import ModalHeader from '../../components/modal-children/ModalHeader.svelte';
  import type { Layers } from '../../runes/layer/layers';
  import LayersProbe from './LayersProbe.svelte';

  interface Props {
    adapters?: BladeAdapters;
    isOpen?: boolean;
    onDismiss?: (event: { source: string }) => void;
    /** The provider's layers and back, from inside it. */
    onReady?: (layers: Layers, back: () => boolean) => void;
  }

  let { adapters, isOpen = $bindable(false), onDismiss, onReady }: Props = $props();
</script>

<BladeProvider {adapters}>
  <p data-testid="page">Page</p>
  {#if onReady}<LayersProbe {onReady} />{/if}
  <Modal bind:isOpen {onDismiss} testID="modal">
    <ModalHeader title="Remove card?" />
  </Modal>
</BladeProvider>
