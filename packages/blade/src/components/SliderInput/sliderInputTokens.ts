export const SLIDER_INPUT_TOKENS = {
  thumb: {
    size: { medium: 16, large: 20 },
    pressedSize: { medium: 20, large: 24 },
    haloMultiplier: 1.5,
  },
  track: {
    height: 2,
  },
  tick: {
    size: { medium: 2, large: 4 },
  },
  label: {
    width: 100,
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
    halo: {
      default: 'overlay.background.subtle',
      dragging: 'overlay.background.moderate',
    },
    tick: {
      onActiveTrack: 'feedback.background.neutral.subtle',
      onInactiveTrack: 'surface.icon.staticBlack.normal',
    },
    label: {
      text: 'surface.text.gray.muted',
      disabled: 'surface.text.gray.disabled',
    },
    error: 'feedback.text.negative.intense',
    help: 'surface.text.gray.muted',
    focusRing: 'surface.border.primary.muted',
  },
} as const;
