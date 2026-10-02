<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import { BottomSheet } from '../../components/bottom-sheet';
  import { Drawer } from '../../components/drawer';
  import type { ComponentDefaults } from '../../components/defaults';

  interface Props {
    defaults?: ComponentDefaults;
  }

  let { defaults }: Props = $props();
</script>

<BladeProvider {defaults}>
  <LayerHost />
  <Modal isOpen title="Modal" testID="modal">
    {#snippet children()}<p>Body</p>{/snippet}
  </Modal>
  <BottomSheet isOpen title="Sheet" testID="sheet">
    {#snippet children()}<p>Body</p>{/snippet}
  </BottomSheet>
  <Drawer isOpen title="Drawer" testID="drawer">
    {#snippet children()}<p>Body</p>{/snippet}
  </Drawer>
</BladeProvider>
