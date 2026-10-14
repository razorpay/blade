import { defineContext } from '../context';

/** What a Modal is asked to be. */
export type OverlayVariant = 'modal' | 'sheet' | 'drawer' | 'left-drawer' | 'popover' | 'menu';

/**
 * What an open Modal tells the content inside it. `variant` is what was
 * asked for and decides intent (a `menu` closes on every pick, as a sheet
 * too); `isAnchored` is how it resolved and decides semantics (an anchored
 * menu's rows are `menuitem`s; a sheet's are plain buttons).
 */
export interface OverlayContext {
  readonly variant: OverlayVariant;
  /** A floating panel by the trigger, not a surface on the layer stack. */
  readonly isAnchored: boolean;
  /** The panel's element id: what names it for `aria-controls`. */
  readonly panelId: string;
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
