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
  /** The surface itself, on both platforms. */
  panel: string;
  /**
   * Drag-to-dismiss, a look a sheet opts into. Web:
   * the zone at the top of the panel that takes the drag (it wraps the
   * handle strip and the surface's header), the strip, and the grip drawn
   * in it. Native's sheet has its own, switched on through
   * `nativeSheet`.
   */
  drag: {
    isEnabled: boolean;
    /**
     * A media query the drag is confined to (a sheet that is a modal on
     * desktop): outside it the zone is plain content. The preset owns the
     * breakpoint, so it owns the query.
     */
    media?: string;
    zone: string;
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
