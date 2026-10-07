<script lang="ts">
  import type { ResponsiveProps } from '../../runes/defaults/responsive';
  import { useComponentDefaults } from '../defaults';
  import Modal from '../modal/Modal.svelte';
  import type {
    BottomSheetBehaviourProps,
    BottomSheetStyleProps,
  } from './styles';

  // Blade's name over Modal in its `sheet` variant: style-only. The model,
  // the layer, the focus and the drag are the modal's. Its own defaults
  // come first, and its variant is `sheet` unless one says otherwise: a
  // provider's Modal defaults never turn a BottomSheet into a modal.
  let {
    isOpen = $bindable(false),
    variant,
    pace,
    isDraggable,
    ...modal
  }: BottomSheetBehaviourProps & ResponsiveProps<BottomSheetStyleProps> = $props();

  const style = useComponentDefaults('BottomSheet', () => ({
    variant,
    pace,
    isDraggable,
  }));
</script>

<Modal
  bind:isOpen
  {...modal}
  variant={style.current.variant ?? 'sheet'}
  pace={style.current.pace}
  isDraggable={style.current.isDraggable}
/>
