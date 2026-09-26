import type { Attachment } from 'svelte/attachments';
import { focusableWithin } from '../dom/focus';
import { anchorTo } from './anchor';
import type { Placed, Placement } from './placement';
import { getLayers } from './layers';
import { createPresence } from './presence';

export interface FloatingOptions {
  /** The element the floating one points at. */
  anchor: () => HTMLElement;
  placement: () => Placement;
  /** Distance between the two, in px. */
  gap: () => number;
  /** Escape pressed — in capture, so a modal beneath does not see it. */
  onEscape: () => void;
  /** A press landed outside the anchor and the floating element. */
  onOutside: () => void;
  /** Opening moves focus in, closing returns it to where it was. */
  isFocusMoved?: boolean;
  /** Names the anchor's first focusable as described by this id, while open. */
  describes?: string;
  /**
   * Leaves the host by its own hand on teardown: moved out of the branch
   * Svelte made it in, Svelte's teardown no longer finds it there.
   */
  removesItself?: boolean;
}

export interface Floating {
  /** Undefined until measured; the element is hidden meanwhile. */
  readonly placed: Placed | undefined;
  readonly presence: ReturnType<typeof createPresence>;
  /**
   * On the floating element: portals it into the LayerHost, keeps it placed
   * against the anchor, and answers Escape and outside presses.
   */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * The web half of a tooltip or popover: DOM-bound (portal, measurement,
 * document listeners). It renders into the LayerHost so scroll and overflow
 * cannot clip it, but stays off the layer stack — it is not modal, the page
 * stays live. Call during component initialisation; native twins never use
 * it.
 */
export function createFloating(options: FloatingOptions): Floating {
  const layers = getLayers();
  const host = layers.host();
  const presence = createPresence((node) => [node]);
  let placed = $state<Placed>();

  return {
    get placed() {
      return placed;
    },
    presence,
    attach(node) {
      host?.appendChild(node);
      const anchor = options.anchor();
      const anchored = anchorTo({
        anchor,
        floating: () => node,
        host,
        placement: options.placement,
        gap: options.gap,
        onPlaced: (next) => {
          placed = next;
        },
      });
      const described = options.describes
        ? (focusableWithin(anchor)[0] ?? anchor)
        : undefined;
      described?.setAttribute('aria-describedby', options.describes as string);
      const returnTo = document.activeElement;
      if (options.isFocusMoved) {
        (focusableWithin(node)[0] ?? node).focus({ preventScroll: true });
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          event.stopPropagation();
          options.onEscape();
        }
      }
      function handlePointerDown(event: PointerEvent) {
        const target = event.target as Node | null;
        if (!anchor.contains(target) && !node.contains(target)) {
          options.onOutside();
        }
      }
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('pointerdown', handlePointerDown, true);
      return () => {
        anchored.stop();
        described?.removeAttribute('aria-describedby');
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('pointerdown', handlePointerDown, true);
        if (options.isFocusMoved) {
          // Back to the anchor, unless focus already went somewhere on purpose.
          const active = document.activeElement;
          if (
            returnTo instanceof HTMLElement &&
            (!active || active === document.body || node.contains(active))
          ) {
            returnTo.focus({ preventScroll: true });
          }
        }
        if (options.removesItself) {
          node.remove();
        }
      };
    },
  };
}
