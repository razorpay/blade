<script lang="ts" generics="T">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
  import Icon from '../icon/Icon.svelte';
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
      /**
       * The previous and next buttons. Off hides them at every width (Blade
       * hides them on phones only).
       * @default true
       */
      showNavigationButtons?: boolean;
      /** Names the previous button. @default 'Previous Slide' */
      previousButtonLabel?: string;
      /** Names the next button. @default 'Next Slide' */
      nextButtonLabel?: string;
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
    showNavigationButtons = true,
    previousButtonLabel = 'Previous Slide',
    nextButtonLabel = 'Next Slide',
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

  const isOnSide = $derived(style.current.navigationButtonPosition?.startsWith('side') ?? false);
  // Phones keep the buttons under the slides, as Blade's. `null`: no
  // buttons under the slides at all.
  // As the dots: nothing to step through with fewer than two slides.
  const hasSlides = $derived(items.length > 1);
  const bottomButtons = $derived.by(() => {
    if (!showNavigationButtons || !hasSlides) return null;
    return isOnSide ? 'd:hidden' : '';
  });
  const sideButtons = $derived(isOnSide && showNavigationButtons && hasSlides);
  const hasDots = $derived(showIndicators && hasSlides);
  // Without dots, the row under the slides shows where its buttons do.
  const controlsPlacement = $derived(hasDots ? '' : bottomButtons);

  // Blade's CircularIndicatorButton: a 2px ring 1px off the 6px dot, drawn
  // round over the auto-play interval.
  const RING_RADIUS = 5;
  const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const fillRing: Attachment<SVGCircleElement> = (node) => {
    if (typeof node.animate !== 'function') return undefined;
    const fill = node.animate([{ strokeDashoffset: CIRCUMFERENCE }, { strokeDashoffset: 0 }], {
      duration: CAROUSEL_AUTOPLAY_INTERVAL,
      easing: 'linear',
      fill: 'forwards',
    });
    return () => fill.cancel();
  };
</script>

{#snippet navigationButton(type: 'previous' | 'next', placement: string)}
  <button
    type="button"
    class={cx(classes.button, placement)}
    aria-label={type === 'previous' ? previousButtonLabel : nextButtonLabel}
    onclick={(event) => {
      event.stopPropagation();
      carousel.go(activeSlide + (type === 'previous' ? -1 : 1));
    }}
  >
    <Icon
      source={type === 'previous' ? ChevronLeftIcon : ChevronRightIcon}
      size="small"
      class="d:h-4 d:w-4 d:[font-size:16px]"
    />
  </button>
{/snippet}

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
  <div class={classes.body}>
    {#if sideButtons}{@render navigationButton('previous', classes.side.previous)}{/if}
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
    {#if sideButtons}{@render navigationButton('next', classes.side.next)}{/if}
  </div>
  {#if controlsPlacement !== null}
    <div class={cx(classes.controls, controlsPlacement)}>
      {#if bottomButtons !== null}{@render navigationButton('previous', bottomButtons)}{/if}
      {#if hasDots}
        <div class={classes.dots} role="tablist" aria-label={indicatorsAccessibilityLabel}>
          {#each items as item, i (itemKey(item))}
            {@const state = i === activeSlide ? 'current' : 'other'}
            <button
              type="button"
              role="tab"
              class={classes.dot[state]}
              aria-label={indicatorLabel(i + 1)}
              aria-selected={i === activeSlide}
              aria-controls="{uid}-slide-{i}"
              onclick={() => carousel.go(i)}
            >
              <span class={classes.pip[state]}></span>
              {#if i === activeSlide && carousel.isPlaying}
                <svg class={classes.ring} viewBox="0 0 12 12" aria-hidden="true">
                  <circle
                    cx="6"
                    cy="6"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-dasharray={CIRCUMFERENCE}
                    stroke-dashoffset={CIRCUMFERENCE}
                    transform="rotate(-90 6 6)"
                    {@attach fillRing}
                  />
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
      {#if bottomButtons !== null}{@render navigationButton('next', bottomButtons)}{/if}
    </div>
  {/if}
</section>
