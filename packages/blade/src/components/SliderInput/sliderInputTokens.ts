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
  tick: {
    size: { medium: 2, large: 4 },
  },
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
      bg: 'feedback.background.neutral.subtle',
      fill: 'surface.icon.staticBlack.normal',
      fillDisabled: 'surface.icon.staticBlack.disabled',
    },
    thumb: {
      fill: 'surface.icon.staticBlack.normal',
      disabled: 'surface.icon.staticBlack.disabled',
    },
    // Same color/opacity for hover and drag, per the design spec.
    halo: 'overlay.background.subtle',
    tick: {
      onActiveTrack: 'feedback.background.neutral.subtle',
      onInactiveTrack: 'surface.icon.staticBlack.normal',
    },
  },
} as const;
