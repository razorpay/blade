<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { NavDirectionSource } from '../../runes/nav-stack/nav';
  import { nativeNavSlide } from '../../runes/nav-stack/screen.svelte';
  import type { NavStackClasses } from './styles';

  // Native plays an exit after the element unmounts, from the `exit` spec it
  // carries by then — so every change of direction re-declares it.
  interface Props {
    name: string | undefined;
    nav: NavDirectionSource;
    classes: NavStackClasses;
    /** The first screen does not slide in. */
    isFirst: boolean;
    children: Snippet;
  }

  let { name, nav, isFirst, classes, children }: Props = $props();

  const slide = nativeNavSlide({
    nav: () => nav,
    isFirst: () => isFirst,
    enter: () => classes.nativeMotion.enter,
    exit: () => classes.nativeMotion.exit,
  });
</script>

<div class={classes.screen} data-screen={name} {@attach slide}>
  {@render children()}
</div>
