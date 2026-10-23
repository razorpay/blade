import type { OverlayLayout } from '../../runes/layer/overlay';

/**
 * `--overlay-gutter`, set on an overlay's panel per layout: the padding the
 * overlay's body keeps from the panel's edge — 20px on a centred modal or a
 * drawer, 16px on a sheet, a popover or a menu. What goes on a bare body
 * (`padding="none"`) and scrolls to the panel's edge pads its own rows by
 * it: PhoneCountryList's rows (ActionList's `inset="overlay"`), an app's
 * search box over them (`px-[var(--overlay-gutter,0px)]`). Unset outside an
 * overlay, and 0px in a field's own dropdown: read it with a 0px fallback.
 * A class, not a value read once: it follows the overlay's layout as it
 * switches.
 */
export const OVERLAY_GUTTER: Record<OverlayLayout, string> = {
  modal: '[--overlay-gutter:20px]',
  drawer: '[--overlay-gutter:20px]',
  'left-drawer': '[--overlay-gutter:20px]',
  sheet: '[--overlay-gutter:16px]',
  popover: '[--overlay-gutter:16px]',
  menu: '[--overlay-gutter:16px]',
};

/** The parts an overlay surface (Surface.svelte) needs from its styles. */
export interface SurfaceClasses {
  /**
   * Fills the host's surfaces box, lays the panel out and carries
   * `data-state`. The scrim is the overlay host's, one under every open
   * surface.
   */
  root: string;
  /** The surface itself. It does not clip. */
  panel: string;
  /** Inside the panel: the box that holds the content and clips it. */
  content: string;
  /**
   * A full-width, zero-height box on the panel's top edge, not clipped:
   * the close button, the drag handle and the `chrome` snippet sit in it.
   */
  chrome: string;
  /**
   * Drag-to-dismiss, which a sheet opts into: the zone at the top of
   * the panel that takes the drag (it wraps the strip, if any, and the
   * surface's header), the strip, and the handle and grip drawn in the
   * chrome over the strip (a sheet's; a drawer has none).
   */
  drag: {
    isEnabled: boolean;
    /**
     * The way out: the axis the drag follows (`y` for a sheet, `x` for a
     * drawer) and its sign along it (`1` down or right, `-1` left).
     */
    axis: 'x' | 'y';
    direction: 1 | -1;
    zone: string;
    strip: string;
    handle: string;
    grip: string;
  };
}
