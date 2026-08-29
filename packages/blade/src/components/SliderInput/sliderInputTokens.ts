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
      // Bound 1:1 to the Figma spec's tokens (interactive.background.neutral
      // family): fill/thumb = .default, empty track = .faded, disabled =
      // .disabled. Note: the Figma (Spark v12) library resolves .default to
      // #000000 while the code theme currently resolves it to
      // blueGrayLight[1000] — the rendered color will follow the code theme
      // until Blade updates it; the binding itself matches the design.
      bg: 'interactive.background.neutral.faded',
      fill: 'interactive.background.neutral.default',
      fillDisabled: 'interactive.background.neutral.disabled',
    },
    thumb: {
      fill: 'interactive.background.neutral.default',
      disabled: 'interactive.background.neutral.disabled',
    },
    // Same color/opacity for hover and drag, per the design spec (~8% light wash).
    // Note: this is the interactive-state tint — overlay.background.* is the much
    // darker modal-scrim scale and must not be used for the halo.
    halo: 'interactive.background.gray.fadedHighlighted',
  },
} as const;
