<script lang="ts">
  import type { Snippet } from 'svelte';
  import { slide, type TransitionConfig } from 'svelte/transition';
  import { easeStandard, prefersReducedMotion } from '../../runes/dom/motion';

  interface Props {
    id: string;
    labelledBy: string;
    class?: string;
    /** ms. Reduced motion makes it 0. */
    duration: number;
    scrollIntoView: boolean;
    children: Snippet;
  }

  let {
    id,
    labelledBy,
    class: className = '',
    duration,
    scrollIntoView,
    children,
  }: Props = $props();

  const reduced = prefersReducedMotion();
  // Svelte slides through the Web Animations API: without it, just mount.
  const still = reduced || typeof document.body.animate !== 'function';

  // Blade's Collapsible: the height on the standard easing, fading from 0.8.
  function collapse(node: Element): TransitionConfig {
    const base = slide(node, {
      duration: still ? 0 : duration,
      easing: easeStandard,
    });
    return {
      ...base,
      css: (t, u) => `${base.css?.(t, u) ?? ''}opacity: ${0.8 + 0.2 * t};`,
    };
  }

  function reveal(event: Event) {
    const panel = event.currentTarget as HTMLElement;
    if (scrollIntoView && typeof panel.scrollIntoView === 'function') {
      panel.scrollIntoView({
        block: 'nearest',
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  }
</script>

<div
  {id}
  role="region"
  aria-labelledby={labelledBy}
  class={className}
  transition:collapse
  onintroend={reveal}
>
  {@render children()}
</div>
