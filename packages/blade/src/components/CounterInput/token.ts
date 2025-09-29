import { size as sizeTokens } from '~tokens/global';

export const COUNTER_INPUT_TOKEN = {
  width: {
    xsmall: 78, // Custom value (not in size tokens)
    medium: 86, // Custom value (not in size tokens)
    large: 118, // Custom value (not in size tokens)
  },
  height: {
    xsmall: sizeTokens[30], // 28px
    medium: sizeTokens[38], // 36px
    large: sizeTokens[50], // 48px
  },

  leftIconMargin: {
    xsmall: ['spacing.3', 'spacing.0', 'spacing.3', 'spacing.3'],
    medium: ['10px', 'spacing.0', '10px', '10px'],
    large: ['spacing.4', 'spacing.0', 'spacing.4', 'spacing.4'],
  },

  rightIconMargin: {
    xsmall: ['spacing.3', 'spacing.3', 'spacing.3', 'spacing.0'],
    medium: ['10px', '10px', '10px', 'spacing.0'],
    large: ['spacing.4', 'spacing.4', 'spacing.4', 'spacing.0'],
  },

  emphasis: {
    subtle: {
      color: 'surface.text.gray.subtle',
      disabledColor: 'surface.text.gray.disabled',
      iconColor: 'surface.icon.gray.subtle',
      disabledIconColor: 'surface.icon.gray.disabled',
      borderColor: 'interactive.border.gray.default',
      disabledBorderColor: 'interactive.border.gray.default',
      backgroundColor: 'surface.background.gray.intense',
      progressBarColor: 'neutral',
    },
    intense: {
      color: 'interactive.text.primary.subtle',
      disabledColor: 'interactive.text.primary.disabled',
      iconColor: 'surface.icon.primary.normal',
      disabledIconColor: 'interactive.icon.primary.disabled',
      borderColor: 'interactive.border.primary.highlighted',
      disabledBorderColor: 'interactive.border.primary.disabled',
      backgroundColor: 'surface.background.gray.intense',
      progressBarColor: undefined,
    },
  },
} as const;
