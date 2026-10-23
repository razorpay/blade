<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import {
    BottomSheetBody,
    BottomSheetHeader,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '../../components/modal-children';
  import CustomSheetHeader from './CustomSheetHeader.svelte';

  interface Props {
    /** Which overlay and header the harness draws. */
    which: 'modal' | 'modal-no-header' | 'sheet' | 'custom' | 'standalone';
    onBack?: () => void;
    onDismiss?: (event: { source: string }) => void;
  }

  let { which, onBack, onDismiss }: Props = $props();
</script>

<BladeProvider testID="host">
{#if which === 'modal'}
  <Modal isOpen testID="overlay">
    <ModalHeader title="Remove card?" subtitle="Ending 1111" testID="header" />
    <ModalBody testID="body"><p>Body</p></ModalBody>
    <ModalFooter testID="footer"><button>Remove</button></ModalFooter>
  </Modal>
{:else if which === 'modal-no-header'}
  <Modal isOpen accessibilityLabel="Notice" testID="overlay">
    <ModalBody><p>Body</p></ModalBody>
  </Modal>
{:else if which === 'sheet'}
  <BottomSheet isOpen testID="overlay" onDismiss={(event) => onDismiss?.(event)}>
    <BottomSheetHeader title="Pick a bank" showBackButton onBackButtonClick={onBack} testID="header" />
    <BottomSheetBody><p>Body</p></BottomSheetBody>
  </BottomSheet>
{:else if which === 'custom'}
  <BottomSheet isOpen testID="overlay">
    <CustomSheetHeader />
    <BottomSheetBody><p>Body</p></BottomSheetBody>
  </BottomSheet>
{:else}
  <ModalHeader title="On its own" testID="header" />
{/if}
</BladeProvider>
