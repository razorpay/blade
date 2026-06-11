export const SLIDER_INPUT_TOKENS = {
  thumb: {
    size: { medium: 12, large: 16 },
    pressedSize: { medium: 16, large: 20 },
    haloMultiplier: 1.5,
  },
  track: {
    height: 2,
  },
  input: {
    width: 59,
    height: { medium: 32, large: 40 },
  },
  label: {
    width: 100,
  },
  gap: {
    labelToSlider: 8,
    sliderToInput: 16,
    inputInner: 8,
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
    input: {
      bg: 'surface.background.gray.intense',
      bgDisabled: 'surface.background.gray.moderate',
      border: 'interactive.border.gray.default',
      borderHover: 'interactive.border.gray.highlighted',
      borderFocus: 'interactive.border.primary.default',
      borderError: 'interactive.border.negative.default',
      borderDisabled: 'interactive.border.gray.disabled',
    },
    label: {
      text: 'surface.text.gray.muted',
      disabled: 'surface.text.gray.disabled',
    },
    value: {
      text: 'interactive.text.gray.normal',
      disabled: 'interactive.text.gray.disabled',
    },
    suffix: {
      text: 'surface.text.gray.muted',
      disabled: 'surface.text.gray.disabled',
    },
    error: 'feedback.text.negative.intense',
    help: 'surface.text.gray.muted',
    focusRing: 'surface.border.primary.muted',
  },
} as const;
