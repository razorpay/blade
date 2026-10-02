import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { captureFocusReturn, focusableWithin } from '../dom/focus';
import { anchorTo } from './anchor';
import type { Placed, Placement } from './placement';
import { getLayers } from './layers';
import { portal } from './portal';
import { createPresence } from './presence';

export interface FloatingOptions {
  /** The element the floating one points at. */
  anchor: () => HTMLElement;
  placement: () => Placement;
  /** Distance between the two, in px. */
  gap: () => number;
  /**
   * Escape pressed while this is the topmost layer: a modal beneath, or a
   * floating one under it, does not see it.
   */
  onEscape: () => void;
  /** A press landed outside the anchor and the floating element. */
  onOutside: () => void;
  /** Opening moves focus in, closing returns it to where it was. */
  isFocusMoved?: boolean;
  /** Names the anchor's first focusable as described by this id, while open. */
  describes?: string;
  /** See `portal`. */
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
 * outside presses). It renders into the LayerHost so scroll and overflow
 * cannot clip it, and joins the layer stack as a floating layer — not
 * modal, the page stays live, but Escape reaches only the topmost overlay.
 * Call during component initialisation; native twins never use it.
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
      const leave = portal(() => host, {
        removesItself: options.removesItself,
      })(node);
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
      const returnFocus = captureFocusReturn(() => node, { preventScroll: true });
      if (options.isFocusMoved) {
        (focusableWithin(node)[0] ?? node).focus({ preventScroll: true });
      }
      // Untracked: joining the stack reads and writes it, and this
      // attachment must not re-run on that.
      const removeLayer = untrack(() =>
        layers.push({
          isModal: false,
          dismiss: (source) => {
            if (source !== 'escape') {
              return false;
            }
            options.onEscape();
            return true;
          },
          back: () => undefined,
        })
      );

      function handlePointerDown(event: PointerEvent) {
        const target = event.target as Node | null;
        if (!anchor.contains(target) && !node.contains(target)) {
          options.onOutside();
        }
      }
      document.addEventListener('pointerdown', handlePointerDown, true);
      return () => {
        anchored.stop();
        untrack(removeLayer);
        described?.removeAttribute('aria-describedby');
        document.removeEventListener('pointerdown', handlePointerDown, true);
        if (options.isFocusMoved) {
          // Back to the anchor, unless focus already went somewhere on purpose.
          returnFocus();
        }
        leave?.();
      };
    },
  };
}
