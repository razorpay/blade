import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { prefersReducedMotion } from '../dom/motion';
import { createTicker } from '../base/schedule';

/** Blade's auto-play pace: a slide every 6 seconds. */
export const CAROUSEL_AUTOPLAY_INTERVAL = 6000;

/** ms the track must be still before a swipe settles (React's debounce). */
const CAROUSEL_SCROLL_REST = 50;

export interface CarouselOptions {
  count: () => number;
  /** The slide on show. */
  activeSlide: () => number;
  /** The bindable write. */
  onValue: (activeSlide: number) => void;
  /** A move changed the slide on show. */
  onChange?: (activeSlide: number) => void;
  /** ms between slides, read as it changes; 0 never moves by itself. */
  interval: () => number;
}

export interface Carousel {
  /** Scrolls to a slide, wrapping at either end. */
  go(next: number): void;
  handleScroll(): void;
  /** The pointer or focus is inside: the auto-play holds. */
  hold(): void;
  release(): void;
  /** Auto-play is moving the slides: on, not held, motion allowed. */
  readonly isPlaying: boolean;
  /** On the track. */
  readonly track: Attachment<HTMLElement>;
}

/**
 * The carousel's scrolling track and its auto-play. Call during
 * component initialisation.
 */
export function createCarousel(options: CarouselOptions): Carousel {
  const isStill = prefersReducedMotion();
  let track = $state<HTMLElement>();
  let isHeld = $state(false);
  // The slide a smooth scroll is heading to. On the way, the track passes
  // the slide it left (and any between): those are not where it rests.
  // `restTimer`: a swipe settles once the track is still for a moment, as
  // React's debounced scroll: a fling past several slides reports only the
  // last.
  let heading: number | undefined,
    headingTimer: ReturnType<typeof setTimeout> | undefined,
    restTimer: ReturnType<typeof setTimeout> | undefined;

  function arrive(): void {
    heading = undefined;
    clearTimeout(headingTimer);
  }

  // A slide is the track's width plus the gap between slides.
  function stride(): number {
    if (!track?.clientWidth) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return track.clientWidth + gap;
  }

  function settle(next: number): void {
    if (next !== options.activeSlide()) {
      options.onValue(next);
      options.onChange?.(next);
    }
  }

  function go(next: number): void {
    const count = options.count();
    const target = ((next % count) + count) % count;
    if (track && typeof track.scrollTo === 'function') {
      if (!isStill) {
        heading = target;
        clearTimeout(headingTimer);
        // Without `scrollend`, a scroll cut short never arrives.
        headingTimer = setTimeout(arrive, 1000);
      }
      track.scrollTo({
        left: target * stride(),
        behavior: isStill ? 'auto' : 'smooth',
      });
    }
    settle(target);
  }

  // A host-driven slide scrolls the track there.
  $effect(() => {
    const width = track?.clientWidth ? stride() : 0;
    const activeSlide = options.activeSlide();
    if (
      track &&
      width &&
      heading !== activeSlide &&
      Math.round(track.scrollLeft / width) !== activeSlide
    ) {
      go(activeSlide);
    }
  });

  // One ticker per interval: a new interval (0 to 6000, say) starts a new
  // one at that pace.
  $effect(() => {
    const interval = options.interval();
    if (interval <= 0 || isStill || isHeld || options.count() <= 1) {
      return undefined;
    }
    const ticker = createTicker({
      delay: interval,
      onTick: () => go(untrack(options.activeSlide) + 1),
    });
    ticker.start();
    return () => ticker.stop();
  });

  return {
    go,
    // Where the track rests is the truth: a swipe moves it without asking.
    handleScroll() {
      if (!track?.clientWidth) return;
      const resting = Math.round(track.scrollLeft / stride());
      if (heading !== undefined) {
        if (resting === heading) arrive();
        return;
      }
      clearTimeout(restTimer);
      restTimer = setTimeout(() => {
        if (track?.clientWidth && heading === undefined) {
          settle(Math.round(track.scrollLeft / stride()));
        }
      }, CAROUSEL_SCROLL_REST);
    },
    hold() {
      isHeld = true;
    },
    release() {
      isHeld = false;
    },
    get isPlaying() {
      return options.interval() > 0 && !isStill && !isHeld && options.count() > 1;
    },
    track(node) {
      track = node;
      // A scroll that stops short of where it was heading (a swipe takes
      // over) rests where it stopped.
      const handleScrollEnd = (): void => {
        if (heading === undefined) return;
        arrive();
        if (node.clientWidth) settle(Math.round(node.scrollLeft / stride()));
      };
      node.addEventListener('scrollend', handleScrollEnd);
      return () => {
        node.removeEventListener('scrollend', handleScrollEnd);
        arrive();
        clearTimeout(restTimer);
        track = undefined;
      };
    },
  };
}
