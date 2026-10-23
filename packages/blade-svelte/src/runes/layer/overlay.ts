import { defineContext } from '../context';
import type { HeaderRegistry } from '../base/header-registry.svelte';

/** The shape an open overlay takes: Modal, BottomSheet, Drawer, Popover or Menu's. */
export type OverlayLayout = 'modal' | 'sheet' | 'drawer' | 'left-drawer' | 'popover' | 'menu';

/**
 * What an open overlay tells the content inside it: the shape it took
 * (for this screen, when it switches by screen) and whether it floats by a trigger.
 * A phone picker sizes its gutter by them. Lists do not read it: a menu's
 * content closes it itself.
 */
export interface OverlayContext {
  readonly layout: OverlayLayout;
  /** A floating panel by the trigger, not a surface on the layer stack. */
  readonly isAnchored: boolean;
  /** The panel's element id: what names it for `aria-controls`. */
  readonly panelId: string;
  /** The close button shows: a header leaves room for it. */
  readonly hasClose?: boolean;
  /** The headers composed into the content (`useModalHeader`). */
  readonly header?: HeaderRegistry;
  /** Closes the overlay without a dismissal. */
  close(): void;
}

const OVERLAY = defineContext<OverlayContext>('blade-overlay');

/** Call during component init (Modal): content below reads it. */
export function provideOverlay(overlay: OverlayContext): void {
  OVERLAY.set(overlay);
}

export function getOverlay(): OverlayContext | undefined {
  return OVERLAY.get();
}
