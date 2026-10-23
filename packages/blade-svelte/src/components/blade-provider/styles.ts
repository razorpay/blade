/**
 * The parts of BladeProvider's overlay host: the one scrim under every open
 * modal, the box their panels mount in, and the live region. Static class
 * strings only; the host stamps `data-state="open" | "closed"` on the scrim
 * and the styles key their fade on it.
 */
export interface OverlayHostClasses {
  /** The shared scrim, fading with `data-state`. */
  backdrop: string;
  /** The container modal surfaces render into, above the scrim. */
  surfaces: string;
  /** The one polite live region: heard, not seen. */
  live: string;
}

// The one scrim under every open modal: Blade's subtle overlay (black at
// 56%; each modal's own used to be 60%), fading over the modal's default
// pace (280ms, see PACE in ../modal) so it keeps step with the first panel
// in and the last panel out. Closed, it takes no pointer. The surfaces box
// lays the panel wrappers over it and takes no pointer of its own — the
// wrappers inherit that and the panels opt back in — so a click beside a
// panel falls through to the scrim. Both cover the app's shell (the host's
// positioned parent) and are scroll containers no one can scroll
// (`overflow-hidden`) that keep a wheel or swipe to themselves
// (`overscroll-contain`): nothing behind an open overlay scrolls, not even a
// page that scrolls as a whole. The surfaces box keeps its panels within the
// shell.
export const resolveOverlayHost = (): OverlayHostClasses => ({
  backdrop:
    'absolute inset-0 z-50 overflow-hidden overscroll-contain bg-overlay-subtle transition-opacity duration-moderate ease-entrance motion-reduce:transition-none data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0',
  surfaces: 'pointer-events-none absolute inset-0 z-50 overflow-hidden overscroll-contain',
  live: 'sr-only',
});
