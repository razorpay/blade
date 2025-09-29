import { size as sizeTokens } from '~tokens/global';

export const COUNTER_INPUT_TOKEN = {
  width: {
    xsmall: sizeTokens[80],
    medium: sizeTokens[90],
    large: sizeTokens[120],
  },
  height: {
    xsmall: sizeTokens[30],
    medium: sizeTokens[38],
    large: sizeTokens[50],
  },

  leftIconMargin: ['spacing.2', 'spacing.0', 'spacing.2', 'spacing.2'],

  rightIconMargin: ['spacing.2', 'spacing.2', 'spacing.2', 'spacing.0'],

  leftIconPadding: {
    xsmall: ['spacing.2', 'spacing.2', 'spacing.2', 'spacing.2'],
    medium: ['6px', '6px', '6px', '6px'],
    large: ['spacing.3', 'spacing.3', 'spacing.3', 'spacing.3'],
  },

  rightIconPadding: {
    xsmall: ['spacing.2', 'spacing.2', 'spacing.2', 'spacing.2'],
    medium: ['6px', '6px', '6px', '6px'],
    large: ['spacing.3', 'spacing.3', 'spacing.3', 'spacing.3'],
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
