<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import { BottomSheet } from '../../components/bottom-sheet';
  import { Drawer } from '../../components/drawer';
  import {
    BottomSheetBody,
    BottomSheetHeader,
    DrawerBody,
    DrawerHeader,
    ModalBody,
    ModalHeader,
  } from '../../components/modal-children';
  import type { ComponentDefaults } from '../../components/defaults';

  interface Props {
    defaults?: ComponentDefaults;
  }

  let { defaults }: Props = $props();
</script>

<BladeProvider {defaults}>
  <Modal isOpen testID="modal">
    <ModalHeader title="Modal" />
    <ModalBody><p>Body</p></ModalBody>
  </Modal>
  <BottomSheet isOpen testID="sheet">
    <BottomSheetHeader title="Sheet" />
    <BottomSheetBody><p>Body</p></BottomSheetBody>
  </BottomSheet>
  <Drawer isOpen testID="drawer">
    <DrawerHeader title="Drawer" />
    <DrawerBody><p>Body</p></DrawerBody>
  </Drawer>
</BladeProvider>
