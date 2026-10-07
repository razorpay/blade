<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import Modal from '../modal/Modal.svelte';
  import type { DrawerBehaviourProps, DrawerStyleProps } from './styles';

  // Blade's name over Modal on the left or right edge: style-only. The
  // model, the layer, the focus and back are the modal's. Its own defaults
  // come first, and it passes its variant explicitly: a provider's
  // Modal defaults never turn a Drawer into a sheet.
  let {
    isOpen = $bindable(false),
    variant,
    pace,
    isDraggable,
    ...modal
  }: DrawerBehaviourProps & DrawerStyleProps = $props();

  const style = useComponentDefaults('Drawer', () => ({ variant, pace, isDraggable }));
</script>

<Modal
  bind:isOpen
  {...modal}
  variant={style.current.variant ?? 'drawer'}
  pace={style.current.pace}
  isDraggable={style.current.isDraggable}
/>
