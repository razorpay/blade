<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import OverlaySurface from '../layer/OverlaySurface.svelte';
  import {
    applyModalClasses,
    resolveModal,
    type ModalBehaviourProps,
    type ModalStyleProps,
  } from './styles';

  // Blade's Modal: the centred dialog on the layer stack. Its content is
  // composed — ModalHeader, ModalBody, ModalFooter, or parts built from
  // their classes. BottomSheet and Drawer are the same surface in another
  // layout; Popover and Menu float by their trigger over the same runes
  // (`createOverlay`).
  let {
    isOpen = $bindable(false),
    classes: customClasses,
    size,
    pace,
    ...behaviour
  }: ModalBehaviourProps & ModalStyleProps = $props();

  const style = useComponentDefaults('Modal', () => ({ size, pace }));
  const classes = $derived(
    applyModalClasses(resolveModal(style.current), customClasses, style.current.pace)
  );
</script>

<OverlaySurface bind:isOpen layout="modal" {classes} {...behaviour} />
