<script lang="ts">
  import Modal from '../modal/Modal.svelte';
  import {
    bottomSheetLook,
    type BottomSheetBehaviourProps,
    type BottomSheetStyleProps,
  } from './styles';

  // Blade's name over Modal, drawn through its internal `look`: style-only.
  // The model, the layer, the focus and the drag are the modal's.
  let {
    isOpen = $bindable(false),
    ...modal
  }: BottomSheetBehaviourProps & BottomSheetStyleProps = $props();
</script>

<Modal look={bottomSheetLook} bind:isOpen {...modal} />
