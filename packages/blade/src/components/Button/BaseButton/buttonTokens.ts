/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { BaseButtonProps } from './BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { IconSize } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner';
import type { Size } from '~tokens/global';
import { size } from '~tokens/global';
import type { FeedbackColors } from '~tokens/theme/theme';
import { makeSize } from '~utils';
import { DotNotationToken } from '~utils/lodashButBetter/get';

export type ButtonMinHeight = Size[28] | Size[32] | Size[36] | Size[48];

export type ButtonTypography = {
  fonts: {
    size: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['typography']['fonts']['size']>;
  };
  lineHeights: Record<
    NonNullable<BaseButtonProps['size']>,
    keyof Theme['typography']['lineHeights']
  >;
};

const backgroundGradient = (color: FeedbackColors | 'primary') => {
  return {
    base: {
      primary: {
        default: `interactive.background.${color}.default`,
        highlighted: `interactive.background.${color}.highlighted`,
        disabled: `interactive.background.${color}.disabled`,
      },
      secondary: {
        default: 'surface.background.gray.intense',
        highlighted: 'surface.background.gray.intense',
        disabled: 'interactive.background.staticWhite.ghost',
      },
      tertiary: {
        default: 'surface.background.gray.intense',
        highlighted: 'surface.background.gray.intense',
        disabled: 'interactive.background.staticWhite.ghost',
      },
      transparent: {
        default: 'transparent',
        highlighted: 'interactive.background.gray.faded',
        disabled: 'interactive.background.gray.disabled',
      },
    },
    white: {
      primary: {
        default: 'interactive.background.staticWhite.default',
        highlighted: 'interactive.background.staticWhite.highlighted',
        disabled: 'interactive.background.staticWhite.disabled',
      },
      secondary: {
        default: 'interactive.background.staticWhite.faded',
        highlighted: 'interactive.background.staticBlack.faded',
        disabled: 'interactive.background.gray.disabled',
      },
      tertiary: {
        default: 'interactive.background.staticWhite.faded',
        highlighted: 'interactive.background.staticBlack.faded',
        disabled: 'interactive.background.gray.disabled',
      },
    },
  } as const;
};

type BoxShadowValue = {
  y: number;
  blur: number;
  spread: number;
  color: DotNotationToken<Theme['colors']>;
};

type ButtonBoxShadow = BoxShadowValue[];

/**
 * Box-shadow tokens for buttons (includes border + 3D effects)
 * Each shadow is: inset 0 {y}px {blur}px {spread}px {color}
 */
const boxShadow = (
  color: FeedbackColors | 'primary',
): {
  base: Record<
    'primary' | 'secondary' | 'tertiary' | 'transparent',
    Record<'default' | 'highlighted' | 'disabled', ButtonBoxShadow>
  >;
  white: Record<
    'primary' | 'secondary' | 'tertiary',
    Record<'default' | 'highlighted' | 'disabled', ButtonBoxShadow>
  >;
} => {
  return {
    base: {
      primary: {
        default: [
          { y: -1.5, blur: 0, spread: 0, color: `interactive.border.${color}.highlighted` },
          { y: 0, blur: 0, spread: 0.5, color: `interactive.border.${color}.default` },
          { y: 1.5, blur: 0, spread: 0, color: 'interactive.border.staticWhite.faded' },
          { y: -2, blur: 0, spread: 0, color: 'interactive.border.staticWhite.faded' },
        ],
        highlighted: [
          { y: -1.5, blur: 0, spread: 0, color: `interactive.border.${color}.highlighted` },
          { y: 0, blur: 0, spread: 0.5, color: `interactive.border.${color}.highlighted` },
          { y: 1.5, blur: 0, spread: 0, color: 'interactive.border.staticWhite.faded' },
          { y: -2, blur: 0, spread: 0, color: 'interactive.border.staticWhite.faded' },
        ],
        disabled: [],
      },
      secondary: {
        default: [
          { y: -1, blur: 0.5, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.default' },
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.gray.default' },
        ],
        highlighted: [
          { y: -1, blur: 0.5, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.default' },
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.gray.default' },
        ],
        disabled: [{ y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.disabled' }],
      },
      tertiary: {
        default: [
          { y: -1, blur: 0.5, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.default' },
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.gray.default' },
        ],
        highlighted: [
          { y: -1, blur: 0.5, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.default' },
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.gray.default' },
        ],
        disabled: [{ y: 0, blur: 0, spread: 1, color: 'interactive.border.gray.disabled' }],
      },
      transparent: {
        default: [],
        highlighted: [],
        disabled: [],
      },
    },
    white: {
      primary: {
        default: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 0.5, color: 'interactive.border.staticWhite.default' },
        ],
        highlighted: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 0.5, color: 'interactive.border.staticWhite.default' },
        ],
        disabled: [],
      },
      secondary: {
        default: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.highlighted' },
        ],
        highlighted: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.highlighted' },
        ],
        disabled: [{ y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.disabled' }],
      },
      tertiary: {
        default: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.highlighted' },
        ],
        highlighted: [
          { y: -1.5, blur: 0, spread: 0, color: 'interactive.border.staticBlack.fadedHighlighted' },
          { y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.highlighted' },
        ],
        disabled: [{ y: 0, blur: 0, spread: 1, color: 'interactive.border.staticWhite.disabled' }],
      },
    },
  };
};

const textColor = (property: 'icon' | 'text') => {
  return {
    base: {
      primary: {
        default: `interactive.${property}.onPrimary.normal`,
        highlighted: `interactive.${property}.onPrimary.normal`,
        disabled: `interactive.${property}.primary.disabled`,
      },
      secondary: {
        default: `interactive.${property}.gray.normal`,
        highlighted: `interactive.${property}.gray.normal`,
        disabled: `interactive.${property}.gray.disabled`,
      },
      tertiary: {
        default: `interactive.${property}.gray.normal`,
        highlighted: `interactive.${property}.gray.normal`,
        disabled: `interactive.${property}.gray.disabled`,
      },
    },
    white: {
      primary: {
        default: `interactive.${property}.staticBlack.muted`,
        highlighted: `interactive.${property}.staticBlack.muted`,
        disabled: `interactive.${property}.staticBlack.disabled`,
      },
      secondary: {
        default: `interactive.${property}.staticWhite.normal`,
        highlighted: `interactive.${property}.staticWhite.normal`,
        disabled: `interactive.${property}.staticWhite.disabled`,
      },
      tertiary: {
        default: `interactive.${property}.staticWhite.normal`,
        highlighted: `interactive.${property}.staticWhite.normal`,
        disabled: `interactive.${property}.staticWhite.disabled`,
      },
    },
    transparent: {
      tertiary: {
        default: property === 'icon' ? 'interactive.icon.gray.muted' : 'surface.text.gray.normal',
        highlighted:
          property === 'icon' ? 'interactive.icon.gray.subtle' : 'surface.text.gray.normal',
        disabled: `interactive.${property}.gray.disabled`,
      },
    },

    color: (color: FeedbackColors) => {
      return {
        primary: {
          default: `interactive.${property}.staticWhite.normal`,
          highlighted: `interactive.${property}.staticWhite.normal`,
          disabled: `interactive.${property}.${color}.disabled`,
        },
        secondary: {
          default: `interactive.${property}.${color}.normal`,
          highlighted: `interactive.${property}.${color}.normal`,
          disabled: `interactive.${property}.${color}.disabled`,
        },
      } as const;
    },
  } as const;
};

const typography: ButtonTypography = {
  fonts: {
    size: {
      xsmall: 75,
      small: 75,
      medium: 100,
      large: 200,
    },
  },
  lineHeights: {
    xsmall: 75,
    small: 75,
    medium: 100,
    large: 200,
  },
};

const minHeight: Record<NonNullable<BaseButtonProps['size']>, ButtonMinHeight> = {
  xsmall: size[28],
  small: size[32],
  medium: size[36],
  large: size[48],
};

const buttonPadding: Record<
  NonNullable<BaseButtonProps['size']>,
  Record<'top' | 'bottom' | 'left' | 'right', keyof Theme['spacing']>
> = {
  xsmall: {
    top: 0,
    bottom: 0,
    left: 3,
    right: 3,
  },
  small: {
    top: 0,
    bottom: 0,
    left: 3,
    right: 3,
  },
  medium: {
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
  },
  large: {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
  },
};

const buttonBorderRadius = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

const buttonIconOnlyHeightWidth = {
  xsmall: makeSize(size['28']),
  small: makeSize(size['32']),
  medium: makeSize(size['36']),
  large: makeSize(size['48']),
} as const;

const buttonSizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

const buttonIconOnlySizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize> = {
  xsmall: 'medium',
  small: 'medium',
  medium: 'medium',
  large: 'medium',
};

const buttonSizeToSpinnerSizeMap: Record<
  NonNullable<BaseButtonProps['size']>,
  SpinnerProps['size']
> = {
  xsmall: 'medium',
  small: 'medium',
  medium: 'medium',
  large: 'large',
};

/**
 * Spinner color mapping based on button variant and color
 */
const spinnerColor = {
  base: {
    primary: 'primary',
    secondary: 'neutral',
    tertiary: 'neutral',
    transparent: 'primary',
  },
  white: {
    primary: 'white',
    secondary: 'white',
    tertiary: 'white',
  },
  positive: {
    primary: 'positive',
    secondary: 'positive',
  },
  negative: {
    primary: 'negative',
    secondary: 'negative',
  },
  notice: {
    primary: 'notice',
    secondary: 'notice',
  },
  information: {
    primary: 'information',
    secondary: 'information',
  },
  neutral: {
    primary: 'neutral',
    secondary: 'neutral',
  },
} as const;

export {
  boxShadow,
  backgroundGradient,
  textColor,
  spinnerColor,
  typography,
  minHeight,
  buttonSizeToIconSizeMap,
  buttonIconOnlySizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  buttonPadding,
  buttonIconOnlyHeightWidth,
  buttonBorderRadius,
};

export type { ButtonBoxShadow };
