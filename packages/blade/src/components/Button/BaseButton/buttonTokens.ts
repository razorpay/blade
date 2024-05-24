/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { BaseButtonProps } from './BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { IconSize } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner';
import type { Size } from '~tokens/global';
import { size } from '~tokens/global';
import type { FeedbackColors } from '~tokens/theme/theme';
import { makeSize } from '~utils';

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

const backgroundColor = (property: 'background' | 'border') => {
  const isBorder = property === 'border';
  return {
    base: {
      primary: {
        default: `interactive.${property}.primary.default`,
        highlighted: `interactive.${property}.primary.highlighted`,
        disabled: `interactive.${property}.primary.disabled`,
      },
      secondary: {
        default: isBorder ? 'interactive.border.primary.default' : 'transparent',
        highlighted: isBorder
          ? `interactive.border.primary.default`
          : `interactive.background.primary.faded`,
        disabled: isBorder ? `interactive.border.primary.disabled` : `transparent`,
      },
      tertiary: {
        default: `interactive.${property}.gray.default`,
        highlighted: `interactive.${property}.gray.highlighted`,
        disabled: `interactive.${property}.gray.disabled`,
      },
    },
    white: {
      primary: {
        default: `interactive.${property}.staticWhite.default`,
        highlighted: `interactive.${property}.staticWhite.highlighted`,
        disabled: `interactive.${property}.staticWhite.disabled`,
      },
      secondary: {
        default: isBorder ? 'interactive.border.staticWhite.highlighted' : 'transparent',
        highlighted: isBorder
          ? 'interactive.border.staticWhite.highlighted'
          : 'interactive.background.staticWhite.faded',
        disabled: isBorder ? `interactive.border.staticWhite.disabled` : 'transparent',
      },
      tertiary: {
        default: `interactive.background.staticWhite.faded`,
        highlighted: `interactive.background.staticWhite.fadedHighlighted`,
        disabled: `interactive.background.staticWhite.disabled`,
      },
    },
    color: (color: FeedbackColors) => {
      return {
        primary: {
          default: `interactive.${property}.${color}.default`,
          highlighted: `interactive.${property}.${color}.highlighted`,
          disabled: `interactive.${property}.${color}.disabled`,
        },
        secondary: {
          default: isBorder
            ? (`interactive.border.${color}.default` as const)
            : (`interactive.background.${color}.faded` as const),
          highlighted: isBorder
            ? (`interactive.border.${color}.default` as const)
            : (`interactive.background.${color}.fadedHighlighted` as const),
          disabled: `interactive.${property}.${color}.disabled`,
        },
      } as const;
    },
  } as const;
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
        default: `interactive.${property}.primary.subtle`,
        highlighted: `interactive.${property}.primary.subtle`,
        disabled: `interactive.${property}.primary.disabled`,
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
      xsmall: 50,
      small: 50,
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
    left: 4,
    right: 4,
  },
  medium: {
    top: 0,
    bottom: 0,
    left: 6,
    right: 6,
  },
  large: {
    top: 0,
    bottom: 0,
    left: 6,
    right: 6,
  },
};

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
  small: 'large',
  medium: 'large',
  large: 'xlarge',
};

const buttonIconPadding: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['spacing']> = {
  xsmall: 1,
  small: 2,
  medium: 3,
  large: 3,
};

export {
  backgroundColor,
  textColor,
  typography,
  minHeight,
  buttonSizeToIconSizeMap,
  buttonIconOnlySizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  buttonIconPadding,
  buttonPadding,
  buttonIconOnlyHeightWidth,
};
