import { size as sizeTokens } from '~tokens/global';

export const COUNTER_INPUT_TOKEN = {
  width: {
    xsmall: sizeTokens[78],
    medium: sizeTokens[86],
    large: sizeTokens[114],
  },
  height: {
    xsmall: sizeTokens[30],
    medium: sizeTokens[34],
    large: sizeTokens[46],
  },

  decrementIconMargin: ['spacing.2', 'spacing.0', 'spacing.2', 'spacing.2'],

  incrementIconMargin: ['spacing.2', 'spacing.2', 'spacing.2', 'spacing.0'],

  iconPadding: {
    xsmall: ['spacing.2'],
    medium: ['spacing.2'],
    large: ['spacing.3'],
  },

  emphasis: {
    subtle: {
      color: 'surface.text.gray.subtle',
      disabledColor: 'surface.text.gray.disabled',
      iconColor: 'interactive.icon.gray.normal',
      disabledIconColor: 'interactive.icon.gray.disabled',
      borderColor: 'interactive.border.gray.default',
      disabledBorderColor: 'interactive.border.gray.default',
      backgroundColor: 'surface.background.gray.intense',
      progressBarColor: 'neutral',
    },
    intense: {
      color: 'interactive.text.primary.subtle',
      disabledColor: 'interactive.text.primary.disabled',
      iconColor: 'interactive.icon.primary.normal',
      disabledIconColor: 'interactive.icon.primary.disabled',
      borderColor: 'interactive.border.primary.highlighted',
      disabledBorderColor: 'interactive.border.primary.disabled',
      backgroundColor: 'surface.background.gray.intense',
      progressBarColor: undefined,
    },
  },
} as const;
