export const SLIDER_INPUT_TOKENS = {
  thumb: {
    size: { medium: 16, large: 20 },
    pressedSize: { medium: 20, large: 24 },
    haloMultiplier: 1.5,
  },
  track: {
    height: 2,
  },
  // WCAG 2.5.5 minimum pointer target — shared by the track hit-area and the thumb
  // wrapper so the draggable/tappable region stays >= 44px regardless of thumb size.
  interactionArea: 44,
  label: {
    width: 100,
  },
  input: {
    // Width of the numeric TextInput slot — 60px per the Figma spec (design-verified
    // to accommodate up to "100" alongside a short unit suffix like px/%).
    width: 60,
  },
  gap: {
    labelToSlider: 8,
  },
  color: {
    track: {
      // Per the Figma spec bindings (interactive.background.neutral family):
      // empty track = .faded, disabled = .disabled.
      bg: 'interactive.background.neutral.faded',
      // The Figma spec binds fill/thumb to interactive.background.neutral.default,
      // whose value in the Figma (Spark v12) library is #000000 — but the code
      // theme still resolves that token to dark gray-blue (blueGrayLight[1000]).
      // Until the code theme catches up with the Figma library, staticBlack.normal
      // is the token that actually renders the spec's #000.
      fill: 'surface.icon.staticBlack.normal',
      fillDisabled: 'interactive.background.neutral.disabled',
    },
    thumb: {
      fill: 'surface.icon.staticBlack.normal',
      disabled: 'interactive.background.neutral.disabled',
    },
    // Same color/opacity for hover and drag, per the design spec (~8% light wash).
    // Note: this is the interactive-state tint — overlay.background.* is the much
    // darker modal-scrim scale and must not be used for the halo.
    halo: 'interactive.background.gray.fadedHighlighted',
  },
} as const;
