<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import OverlaySurface from '../layer/OverlaySurface.svelte';
  import { applyModalClasses } from '../modal/styles';
  import { resolveDrawer, type DrawerBehaviourProps, type DrawerStyleProps } from './styles';

  // Blade's Drawer: a surface docked to the right edge, or the left
  // (`side`). Its own defaults only: a provider's Modal defaults never
  // reach it.
  let {
    isOpen = $bindable(false),
    classes: customClasses,
    side,
    pace,
    isDraggable,
    ...behaviour
  }: DrawerBehaviourProps & DrawerStyleProps = $props();

  const style = useComponentDefaults('Drawer', () => ({ side, pace, isDraggable }));
  const classes = $derived(
    applyModalClasses(resolveDrawer(style.current), customClasses, style.current.pace)
  );
</script>

<OverlaySurface
  bind:isOpen
  layout={style.current.side === 'left' ? 'left-drawer' : 'drawer'}
  {classes}
  {...behaviour}
/>
