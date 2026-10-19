<script lang="ts" generics="T">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import {
    CAROUSEL_AUTOPLAY_INTERVAL,
    createCarousel,
  } from '../../runes/carousel/carousel.svelte';
  import { resolveCarousel, type CarouselStyleProps } from './styles';

  type Props = CarouselStyleProps &
    Partial<AnalyticsAttributes> & {
      items: readonly T[];
      itemKey: (item: T) => string;
      /**
       * The slide on show: initial, bound, or host-driven — so there is no
       * `defaultActiveSlide`.
       * @default 0
       */
      activeSlide?: number;
      onChange?: (slideIndex: number) => void;
      /**
       * Moves to the next slide every 6 seconds, wrapping at the end. Held
       * while the pointer or focus is inside, and never runs under reduced
       * motion.
       * @default false
       */
      autoPlay?: boolean;
      /** The dots under the slides; each goes to its slide. @default true */
      showIndicators?: boolean;
      /** Names the carousel. */
      accessibilityLabel?: string;
      /** Names each slide. @default (position, count) => `${position} of ${count}` */
      slideLabel?: (position: number, count: number) => string;
      /** Names each dot. @default (position) => `Slide ${position}` */
      indicatorLabel?: (position: number) => string;
      /** Names the row of dots. @default 'Slides' */
      indicatorsAccessibilityLabel?: string;
      testID?: string;
      class?: string;
      /** One slide. */
      children: Snippet<[T, number]>;
    };

  let {
    items,
    itemKey,
    activeSlide = $bindable(0),
    onChange,
    autoPlay = false,
    showIndicators = true,
    accessibilityLabel,
    slideLabel = (position, count) => `${position} of ${count}`,
    indicatorLabel = (position) => `Slide ${position}`,
    indicatorsAccessibilityLabel = 'Slides',
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const style = useComponentDefaults('Carousel', () => rest);

  const uid = $props.id();
  const classes = $derived(resolveCarousel(style.current));
  const analytics = $derived(analyticsAttributes(rest));
  const carousel = createCarousel({
    count: () => items.length,
    activeSlide: () => activeSlide,
    onValue: (next) => {
      activeSlide = next;
    },
    onChange: (next) => onChange?.(next),
    interval: () => (autoPlay ? CAROUSEL_AUTOPLAY_INTERVAL : 0),
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
  class={cx(classes.root, className)}
  aria-roledescription="carousel"
  aria-label={accessibilityLabel}
  data-testid={testID}
  {...analytics}
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
        id="{uid}-slide-{i}"
        class={classes.slide}
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={slideLabel(i + 1, items.length)}
        inert={i !== activeSlide}
      >
        {@render children(item, i)}
      </div>
    {/each}
  </div>
  {#if showIndicators && items.length > 1}
    <div class={classes.dots} role="tablist" aria-label={indicatorsAccessibilityLabel}>
      {#each items as item, i (itemKey(item))}
        <button
          type="button"
          role="tab"
          class={classes.dot[i === activeSlide ? 'current' : 'other']}
          aria-label={indicatorLabel(i + 1)}
          aria-selected={i === activeSlide}
          aria-controls="{uid}-slide-{i}"
          onclick={() => carousel.go(i)}
        ></button>
      {/each}
    </div>
  {/if}
</section>
