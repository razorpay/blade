<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createCarousel } from '../../runes/carousel/carousel.svelte';
  import { resolveCarousel, type CarouselStyleProps } from './styles';

  type Props = CarouselStyleProps & {
    items: readonly T[];
    itemKey: (item: T) => string;
    /** The slide on show: initial, bound, or host-driven. */
    index?: number;
    onChange?: (index: number) => void;
    /**
     * ms between slides, wrapping at the end; 0 (the default) never moves by
     * itself. Held while the pointer or focus is inside, and never runs under
     * reduced motion.
     */
    autoAdvance?: number;
    /** Names the carousel. */
    accessibilityLabel: string;
    /** Localized, e.g. "Slide 2 of 5". Names each slide, and each dot — which exist only with it. */
    slideLabel?: (position: number, count: number) => string;
    testID?: string;
    class?: string;
    /** One slide. */
    children: Snippet<[T, number]>;
  };

  let {
    items,
    itemKey,
    index = $bindable(0),
    onChange,
    autoAdvance = 0,
    accessibilityLabel,
    slideLabel,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveCarousel(styleProps));
  const carousel = createCarousel({
    count: () => items.length,
    index: () => index,
    onValue: (next) => {
      index = next;
    },
    onChange: (next) => onChange?.(next),
    autoAdvance: () => autoAdvance,
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
  class={cx(classes.root, className)}
  aria-roledescription="carousel"
  aria-label={accessibilityLabel}
  data-testid={testID}
  onpointerenter={carousel.hold}
  onpointerleave={carousel.release}
  onfocusin={carousel.hold}
  onfocusout={carousel.release}
>
  <div
    class={classes.track}
    onscroll={carousel.handleScroll}
    {@attach carousel.track}
  >
    {#each items as item, i (itemKey(item))}
      <div
        class={classes.slide}
        role="group"
        aria-roledescription="slide"
        aria-label={slideLabel?.(i + 1, items.length)}
        inert={i !== index}
      >
        {@render children(item, i)}
      </div>
    {/each}
  </div>
  {#if slideLabel && items.length > 1}
    <div class={classes.dots}>
      {#each items as item, i (itemKey(item))}
        <button
          type="button"
          class={classes.dot[i === index ? 'current' : 'other']}
          aria-label={slideLabel(i + 1, items.length)}
          aria-current={i === index ? 'true' : undefined}
          onclick={() => carousel.go(i)}
        ></button>
      {/each}
    </div>
  {/if}
</section>
