<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import OverlaySurface from '../layer/OverlaySurface.svelte';
  import { applyModalClasses } from '../modal/styles';
  import {
    resolveBottomSheet,
    type BottomSheetBehaviourProps,
    type BottomSheetStyleProps,
  } from './styles';

  // Blade's BottomSheet: a surface on the bottom edge, with a handle and a
  // drag down to dismiss. Its own defaults only: a provider's Modal
  // defaults never reach it.
  let {
    isOpen = $bindable(false),
    classes: customClasses,
    pace,
    isDraggable,
    ...behaviour
  }: BottomSheetBehaviourProps & BottomSheetStyleProps = $props();

  const style = useComponentDefaults('BottomSheet', () => ({ pace, isDraggable }));
  const classes = $derived(
    applyModalClasses(resolveBottomSheet(style.current), customClasses, style.current.pace)
  );
</script>

<OverlaySurface bind:isOpen layout="sheet" {classes} {...behaviour} />
