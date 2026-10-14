import { size as sizeTokens, spacing, border } from '~tokens/global';

// Figma draws the container stroke inside the frame without taking layout space, so the
// buttons sit 4px from the outer edge. In code the border takes real space, so the
// outer button margins subtract the border width to keep that same 4px visual gap.
const BUTTON_OUTER_MARGIN = spacing[2] - border.width.thin;

export const COUNTER_INPUT_ICON_SIZE_MAP = {
  xsmall: 'small',
  small: 'medium',
  medium: 'large',
  large: 'xlarge',
} as const;

export const COUNTER_INPUT_SIZE_TO_TEXT_SIZE = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

export const COUNTER_INPUT_TOKEN = {
  width: {
    xsmall: sizeTokens[76],
    small: sizeTokens[84],
    medium: sizeTokens[92],
    large: sizeTokens[120],
  },
  height: {
    xsmall: sizeTokens[28],
    small: sizeTokens[32],
    medium: sizeTokens[36],
    large: sizeTokens[48],
  },

  containerBorderRadius: {
    xsmall: 'small',
    small: 'small',
    medium: 'small',
    large: 'medium',
  },
  buttonBorderRadius: {
    xsmall: border.radius.xsmall,
    small: border.radius.xsmall,
    medium: border.radius.xsmall,
    large: border.radius.small,
  },

  decrementIconMargin: [BUTTON_OUTER_MARGIN, spacing[0], BUTTON_OUTER_MARGIN, BUTTON_OUTER_MARGIN],
  incrementIconMargin: [BUTTON_OUTER_MARGIN, BUTTON_OUTER_MARGIN, BUTTON_OUTER_MARGIN, spacing[0]],

  iconPadding: {
    xsmall: spacing[2],
    small: spacing[2],
    medium: spacing[2],
    large: spacing[3],
  },

  emphasis: {
    subtle: {
      color: 'surface.text.gray.subtle',
      disabledColor: 'surface.text.gray.disabled',
      iconColor: 'interactive.icon.gray.subtle',
      disabledIconColor: 'interactive.icon.gray.disabled',
      borderColor: 'interactive.border.gray.default',
      disabledBorderColor: 'interactive.border.gray.default',
      backgroundColor: 'surface.background.gray.intense',
      loadingOrDisabledBgColor: 'surface.background.gray.subtle',
      progressBarColor: 'neutral',
    },
    intense: {
      color: 'interactive.text.primary.subtle',
      disabledColor: 'interactive.text.primary.disabled',
      iconColor: 'interactive.icon.primary.subtle',
      disabledIconColor: 'interactive.icon.primary.disabled',
      borderColor: 'interactive.border.primary.highlighted',
      disabledBorderColor: 'interactive.border.primary.disabled',
      backgroundColor: 'surface.background.gray.intense',
      loadingOrDisabledBgColor: 'surface.background.gray.subtle',
      progressBarColor: undefined,
    },
  },
} as const;
