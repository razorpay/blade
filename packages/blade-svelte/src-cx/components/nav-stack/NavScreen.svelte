<script lang="ts">
  import type { Snippet } from 'svelte';
  import { longestTransition, phaseTransition } from '../../runes/layer/presence';
  import type { NavDirectionSource } from '../../runes/nav-stack/nav';
  import type { NavStackClasses } from './styles';

  // The platform leaf of NavStack: presence, the slide's two attributes and
  // focus. Web only (computed styles); the native twin declares its own.
  interface Props {
    name: string | undefined;
    nav: NavDirectionSource;
    /** The first screen on show does not slide in. */
    isFirst: boolean;
    classes: NavStackClasses;
    children: Snippet;
  }

  let { name, nav, isFirst, classes, children }: Props = $props();

  // Svelte owns presence, the CSS transitions in styles.ts own the visuals. The
  // direction is read when the transition starts, never at mount: a leaving
  // screen learns which way it goes only once the navigation happens.
  const presence = phaseTransition((node, phase) => {
    const isForward = nav.direction === 'forward';
    if (phase === 'out') {
      node.dataset.side = isForward ? 'behind' : 'ahead';
      node.dataset.state = 'closed';
    } else if (!isFirst) {
      node.dataset.side = isForward ? 'ahead' : 'behind';
      // Park it closed without a transition, and have that style computed,
      // or the flip to open has nowhere to travel from.
      node.style.transition = 'none';
      node.dataset.state = 'closed';
      void node.offsetWidth;
      node.style.transition = '';
      node.dataset.state = 'open';
      node.focus({ preventScroll: true });
    }
    return longestTransition([node]);
  });
</script>

<div
  class={classes.screen}
  data-state="open"
  data-screen={name}
  tabindex="-1"
  transition:presence
>
  {@render children()}
</div>
