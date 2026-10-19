import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { prefersReducedMotion } from '../dom/motion';
import { createTicker } from '../base/schedule';

/** Blade's auto-play pace: a slide every 6 seconds. */
export const CAROUSEL_AUTOPLAY_INTERVAL = 6000;

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

  function settle(next: number): void {
    if (next !== options.activeSlide()) {
      options.onValue(next);
      options.onChange?.(next);
    }
  }

  function go(next: number): void {
    const count = options.count();
    const width = track?.clientWidth ?? 0;
    const target = ((next % count) + count) % count;
    if (track && typeof track.scrollTo === 'function') {
      track.scrollTo({
        left: target * width,
        behavior: isStill ? 'auto' : 'smooth',
      });
    }
    settle(target);
  }

  // A host-driven slide scrolls the track there.
  $effect(() => {
    const width = track?.clientWidth ?? 0;
    const activeSlide = options.activeSlide();
    if (track && width && Math.round(track.scrollLeft / width) !== activeSlide) {
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
      if (track?.clientWidth) {
        settle(Math.round(track.scrollLeft / track.clientWidth));
      }
    },
    hold() {
      isHeld = true;
    },
    release() {
      isHeld = false;
    },
    track(node) {
      track = node;
      return () => {
        track = undefined;
      };
    },
  };
}
