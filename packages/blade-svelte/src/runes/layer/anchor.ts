import { place } from './placement';
import type { Placed, Placement, PlacementRect } from './placement';

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
 * What a floating element stays inside: the frame the overlay host sits in
 * (its nearest positioned ancestor — the host itself has no box of its own),
 * as much of it as the viewport shows; the viewport without one.
 */
function frameOf(host: HTMLElement | undefined): PlacementRect {
  const viewport = { left: 0, top: 0, width: innerWidth, height: innerHeight };
  const frame = host?.offsetParent;
  if (!(frame instanceof HTMLElement) || frame === document.body) {
    return viewport;
  }
  const rect = frame.getBoundingClientRect();
  const left = Math.max(rect.left, 0);
  const top = Math.max(rect.top, 0);
  const width = Math.min(rect.right, innerWidth) - left;
  const height = Math.min(rect.bottom, innerHeight) - top;
  return width > 0 && height > 0 ? { left, top, width, height } : viewport;
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
    const next = place({
      anchor: options.anchor.getBoundingClientRect(),
      floating: { width: floating.offsetWidth, height: floating.offsetHeight },
      boundary: frameOf(options.host()),
      placement: options.placement(),
      gap: options.gap(),
    });
    // `place` answers in viewport space; the floating element is absolute,
    // so its origin is the padding box of whatever positioned ancestor it has.
    const parent = floating.offsetParent;
    const origin = parent instanceof HTMLElement ? parent.getBoundingClientRect() : undefined;
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
