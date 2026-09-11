export const SLIDER_TOKENS = {
  thumb: {
    // Single size by design decision (Sep 2026): Checkout Studio — the component's
    // customer — needs exactly one, so the earlier medium/large split was removed
    // to keep the API minimal. Reintroduce a size prop only when a surface asks.
    size: 16,
    pressedSize: 20,
    haloMultiplier: 1.5,
  },
  track: {
    height: 2,
    // Diameter of the step stop-indicator dots (Material 3 pattern: the track
    // stays continuous; small contrast dots mark each stop). 6px per the Figma
    // spec (node 4675:32133) — 3× the track height.
    stepDotSize: 6,
    // Minimum on-screen distance between adjacent stops for the dots to render —
    // 4× the 6px dot so each dot has breathing room. Denser than this, the dots
    // read as noise (and a 44px touch target can't reliably pick between stops
    // that close anyway), so the track auto-falls-back to continuous — Material's
    // tick auto-hide mode. Material's alternative auto-limit mode (thin to every
    // Nth stop) was rejected: our dots mean "you can stop here", and thinned dots
    // would misrepresent the snap positions.
    stepMinBlockWidth: 24,
  },
  // WCAG 2.5.5 minimum pointer target — shared by the track hit-area and the thumb
  // wrapper so the draggable/tappable region stays >= 44px regardless of thumb size.
  interactionArea: 44,
  color: {
    track: {
      // fill/thumb use interactive.background.neutral.default — the theme-aware
      // neutral interactive fill (near-black in light mode, near-white in dark),
      // which keeps the design's monochrome look while fixing the dark-mode
      // failure of the earlier staticBlack binding (static #000 disappears on
      // dark surfaces). Empty track uses interactive.background.neutral.faded;
      // disabled states use the neutral disabled tints.
      // fadedHighlighted (18%) rather than faded (12%): picked in design review
      // for legibility — the 12% wash all but disappears on dark-mode surfaces.
      bg: 'interactive.background.neutral.fadedHighlighted',
      fill: 'interactive.background.neutral.default',
      fillDisabled: 'interactive.background.neutral.fadedHighlighted',
    },
    thumb: {
      fill: 'interactive.background.neutral.default',
      // Disabled marker per the Figma construction (node 3715-21936): an opaque
      // base circle so the track can't show through the translucent tint, with
      // the disabled tint layered on top.
      disabled: 'interactive.background.neutral.fadedHighlighted',
      disabledBase: 'surface.background.gray.subtle',
    },
    // Step stop-indicator dots: surface.border.gray.normal — a SOLID theme-aware
    // grey that is deliberately LIGHT in light mode (80% lightness, matching the
    // subtle tone of the Figma spec) yet resolves to a mid grey in dark mode that
    // measures 3.6:1 against the dark surface (WCAG 1.4.11 target 3:1). Earlier
    // candidates were rejected: an onNeutral-based two-token stack collapses to
    // 1.07:1 in dark mode (onNeutral is for content ON the neutral fill), and
    // icon.gray.muted passed contrast but read too dark in light mode. Dots mark
    // only the stops AHEAD of the thumb; the filled rail stays a clean solid line
    // (contrast dots on a 2px fill read as holes).
    stepDot: 'surface.border.gray.normal',
    // Same color/opacity for hover and drag, per the design spec (~8% light wash).
    // Note: this is the interactive-state tint — overlay.background.* is the much
    // darker modal-scrim scale and must not be used for the halo.
    halo: 'interactive.background.gray.fadedHighlighted',
  },
} as const;
