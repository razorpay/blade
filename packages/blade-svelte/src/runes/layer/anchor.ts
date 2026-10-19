import { place } from './placement';
import type { Placed, Placement } from './placement';

export interface AnchorOptions {
  /** The element the floating one points at. */
  anchor: HTMLElement;
  floating: () => HTMLElement | undefined;
  /** The overlay host the floating element renders into, when there is one. */
  host: () => HTMLElement | undefined;
  placement: () => Placement;
  /** Distance between the two, in px. */
  gap: () => number;
  onPlaced: (placed: Placed) => void;
}

/**
 * Keeps a floating element (a tooltip, a popover) placed against its anchor:
 * measured now, and again on every scroll and resize, and whenever the
 * floating element changes size (a list filtered, loaded or emptied). Web
 * only. Returns the stop; `update` is for a change the caller knows about.
 */
export function anchorTo(
  options: AnchorOptions,
): {
  update(): void;
  stop(): void;
} {
  function update(): void {
    const floating = options.floating();
    if (!floating) {
      return;
    }
    const host = options.host();
    const hostRect = host?.getBoundingClientRect();
    // `place` answers in viewport space; the floating element is absolute,
    // so its origin is the padding box of whatever positioned ancestor it
    // has. That box is also the frame it must stay inside: the host is a
    // zero-size marker of its own, so it says nothing about the frame.
    const parent = floating.offsetParent;
    const origin = parent instanceof HTMLElement ? parent.getBoundingClientRect() : undefined;
    const next = place({
      anchor: options.anchor.getBoundingClientRect(),
      floating: { width: floating.offsetWidth, height: floating.offsetHeight },
      // The box the floating element lays out in, when it has one; the
      // host's own frame when that is sized; else the viewport.
      boundary:
        origin?.width && origin.height
          ? origin
          : hostRect?.width && hostRect.height
          ? hostRect
          : { left: 0, top: 0, width: innerWidth, height: innerHeight },
      placement: options.placement(),
      gap: options.gap(),
    });
    options.onPlaced({
      ...next,
      anchorWidth: options.anchor.getBoundingClientRect().width,
      x: next.x - (origin ? origin.left + (parent?.clientLeft ?? 0) : 0),
      y: next.y - (origin ? origin.top + (parent?.clientTop ?? 0) : 0),
    });
  }

  update();
  addEventListener('scroll', update, true);
  addEventListener('resize', update);
  const floating = options.floating();
  const resized =
    typeof ResizeObserver === 'undefined' || !floating ? undefined : new ResizeObserver(update);
  if (floating) {
    resized?.observe(floating);
  }
  return {
    update,
    stop() {
      removeEventListener('scroll', update, true);
      removeEventListener('resize', update);
      resized?.disconnect();
    },
  };
}
