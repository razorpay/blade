export const SLIDER_INPUT_TOKENS = {
  thumb: {
    size: { medium: 12, large: 16 },
    pressedSize: { medium: 16, large: 20 },
    haloMultiplier: 1.5,
  },
  track: {
    height: 4,
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
      fillDisabledHardcoded: '#AFB6BB',
    },
    thumb: {
      fill: 'surface.icon.staticBlack.normal',
      disabledHardcoded: '#AFB6BB',
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
