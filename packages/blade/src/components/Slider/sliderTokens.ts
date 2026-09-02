export const SLIDER_TOKENS = {
  thumb: {
    size: { medium: 16, large: 20 },
    pressedSize: { medium: 20, large: 24 },
    haloMultiplier: 1.5,
  },
  track: {
    height: 2,
    // Width of the gap sliced into the track at each step position when
    // `showSteps` is on. 2px (not 1px): stays crisp on 1x displays where a
    // fractional/1px gap anti-aliases away, and matches the 2px track height.
    stepGap: 2,
    // Minimum on-screen width of one step block for the segments to render.
    // Below this the gaps read as noise, so the track auto-falls-back to
    // continuous — mirroring Material's tick auto-hide for dense sliders.
    stepMinBlockWidth: 8,
  },
  // WCAG 2.5.5 minimum pointer target — shared by the track hit-area and the thumb
  // wrapper so the draggable/tappable region stays >= 44px regardless of thumb size.
  interactionArea: 44,
  color: {
    track: {
      // Bound 1:1 to the Figma spec's tokens: fill/thumb use
      // interactive.background.staticBlack.default (#000 — static across
      // themes, per the design's binding), the empty track uses
      // interactive.background.neutral.faded, and disabled states use
      // interactive.background.neutral.disabled.
      bg: 'interactive.background.neutral.faded',
      fill: 'interactive.background.staticBlack.default',
      fillDisabled: 'interactive.background.neutral.fadedHighlighted',
    },
    thumb: {
      fill: 'interactive.background.staticBlack.default',
      // Disabled marker per the Figma construction (node 3715-21936): an opaque
      // base circle so the track can't show through the translucent tint, with
      // the disabled tint layered on top.
      disabled: 'interactive.background.neutral.fadedHighlighted',
      disabledBase: 'surface.background.gray.subtle',
    },
    // Same color/opacity for hover and drag, per the design spec (~8% light wash).
    // Note: this is the interactive-state tint — overlay.background.* is the much
    // darker modal-scrim scale and must not be used for the halo.
    halo: 'interactive.background.gray.fadedHighlighted',
  },
} as const;
