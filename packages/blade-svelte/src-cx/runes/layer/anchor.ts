import { place } from './placement';
import type { Placed, Placement } from './placement';

export interface AnchorOptions {
  /** The element the floating one points at. */
  anchor: HTMLElement;
  floating: () => HTMLElement | undefined;
  /** The LayerHost the floating element renders into, when there is one. */
  host: HTMLElement | undefined;
  placement: () => Placement;
  /** Distance between the two, in px. */
  gap: () => number;
  onPlaced: (placed: Placed) => void;
}

/**
 * Keeps a floating element (a tooltip, a popover) placed against its anchor:
 * measured now, and again on every scroll and resize. Web only. Returns the
 * stop; `update` is for a content change the caller knows about.
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
    const { host } = options;
    const hostRect = host?.getBoundingClientRect();
    const next = place({
      anchor: options.anchor.getBoundingClientRect(),
      floating: { width: floating.offsetWidth, height: floating.offsetHeight },
      // The host's frame when it has one, else the viewport.
      boundary:
        hostRect?.width && hostRect.height
          ? hostRect
          : { left: 0, top: 0, width: innerWidth, height: innerHeight },
      placement: options.placement(),
      gap: options.gap(),
    });
    // `place` answers in viewport space; the floating element is absolute,
    // so its origin is the padding box of whatever positioned ancestor it has.
    const parent = floating.offsetParent;
    const origin = parent instanceof HTMLElement ? parent.getBoundingClientRect() : undefined;
    options.onPlaced({
      ...next,
      x: next.x - (origin ? origin.left + (parent?.clientLeft ?? 0) : 0),
      y: next.y - (origin ? origin.top + (parent?.clientTop ?? 0) : 0),
    });
  }

  update();
  addEventListener('scroll', update, true);
  addEventListener('resize', update);
  return {
    update,
    stop() {
      removeEventListener('scroll', update, true);
      removeEventListener('resize', update);
    },
  };
}
