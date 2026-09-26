import type { Attachment } from 'svelte/attachments';
import { prefersReducedMotion } from '../dom/motion';
import { createTicker } from '../base/schedule';

export interface CarouselOptions {
  count: () => number;
  /** The slide on show. */
  index: () => number;
  /** The bindable write. */
  onValue: (index: number) => void;
  /** A move changed the slide on show. */
  onChange?: (index: number) => void;
  /** ms between slides; read once, at mount. 0 never moves by itself. */
  autoAdvance: () => number;
}

export interface Carousel {
  /** Scrolls to a slide, wrapping at either end. */
  go(next: number): void;
  handleScroll(): void;
  /** The pointer or focus is inside: the auto-advance holds. */
  hold(): void;
  release(): void;
  /** On the track. */
  readonly track: Attachment<HTMLElement>;
}

/**
 * The carousel's scrolling track and its auto-advance. Call during
 * component initialisation.
 */
export function createCarousel(options: CarouselOptions): Carousel {
  const isStill = prefersReducedMotion();
  let track = $state<HTMLElement>();
  let isHeld = $state(false);

  function settle(next: number) {
    if (next !== options.index()) {
      options.onValue(next);
      options.onChange?.(next);
    }
  }

  function go(next: number) {
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

  // A host-driven index scrolls the track there.
  $effect(() => {
    const width = track?.clientWidth ?? 0;
    const index = options.index();
    if (track && width && Math.round(track.scrollLeft / width) !== index) {
      go(index);
    }
  });

  const ticker = createTicker({
    delay: options.autoAdvance(),
    onTick: () => go(options.index() + 1),
  });
  $effect(() => {
    if (
      options.autoAdvance() > 0 &&
      !isStill &&
      !isHeld &&
      options.count() > 1
    ) {
      ticker.start();
    } else {
      ticker.stop();
    }
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
