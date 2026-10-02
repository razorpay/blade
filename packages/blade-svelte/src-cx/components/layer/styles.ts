/**
 * The parts an overlay surface needs from its styles, shared by the web
 * anatomy (Surface.svelte) and its native twin (Surface.native.svelte).
 */
export interface SurfaceClasses {
  /**
   * Web: fills the host's surfaces box, lays the panel out and carries
   * `data-state`. The scrim is the LayerHost's, one under every open
   * surface (see `layer-host.ts`); native draws its own.
   */
  root: string;
  /** The surface itself, on both platforms. It does not clip. */
  panel: string;
  /** Inside the panel: the box that holds the content and clips it. */
  content: string;
  /**
   * A full-width, zero-height box on the panel's top edge, not clipped:
   * the close button, the drag handle and the `chrome` snippet sit in it.
   */
  chrome: string;
  /**
   * Drag-to-dismiss, which a sheet opts into. Web: the zone at the top of
   * the panel that takes the drag (it wraps the strip, if any, and the
   * surface's header), the strip, and the handle and grip drawn in the
   * chrome over the strip (a sheet's; a drawer has none). Native's sheet has its own, switched on through
   * `nativeSheet`.
   */
  drag: {
    isEnabled: boolean;
    /**
     * The way out: the axis the drag follows (`y` for a sheet, `x` for a
     * drawer) and its sign along it (`1` down or right, `-1` left).
     */
    axis: 'x' | 'y';
    direction: 1 | -1;
    /**
     * A media query the drag is confined to (a sheet that is a modal on
     * desktop): outside it the zone is plain content. The preset owns the
     * breakpoint, so it owns the query.
     */
    media?: string;
    zone: string;
    strip: string;
    handle: string;
    grip: string;
  };
  /**
   * Native: `data-*` configuration of the platform sheet (`data-height`,
   * `data-radius`, …) — the sheet's shape is style, so the styles own it.
   */
  nativeSheet: Record<string, string>;
}

/**
 * The parts the app's LayerHost needs from its styles: the one scrim under
 * every open modal, and the box their panels mount in. Static class strings
 * only; the host stamps `data-state="open" | "closed"` on the scrim and the
 * styles key their fade on it.
 */
export interface LayerHostClasses {
  /** The shared scrim, fading with `data-state`. */
  backdrop: string;
  /** The container modal surfaces render into, above the scrim. */
  surfaces: string;
}

/** LayerHost has no style props: the parts out. */
export type LayerHostStyleResolver = () => LayerHostClasses;

// The one scrim under every open modal: Blade's subtle overlay (black at
// 56%; each modal's own used to be 60%), fading over the modal's default
// pace (280ms, see
// PACE in ../modal) so it keeps step with the first panel in and the last
// panel out. Closed, it takes no pointer. The surfaces box lays the panel
// wrappers over it and takes no pointer of its own — the wrappers inherit
// that and the panels opt back in — so a click beside a panel falls
// through to the scrim.
export const resolveLayerHost: LayerHostStyleResolver = () => ({
  backdrop:
    'absolute inset-0 z-50 bg-overlay-subtle transition-opacity duration-moderate ease-entrance motion-reduce:transition-none data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0',
  surfaces: 'pointer-events-none absolute inset-0 z-50',
});
