import type { BaseButtonProps } from './BaseButton';
import type { ThemeTokens } from '~tokens/theme/theme';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { IconProps } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner/Spinner';

export type ButtonMinHeight = 28 | 32 | 36 | 48;

export type ButtonTypography = {
  [Key in TypographyPlatforms]: {
    fonts: {
      size: Record<
        NonNullable<BaseButtonProps['size']>,
        keyof ThemeTokens['typography'][Key]['fonts']['size']
      >;
    };
    lineHeights: Record<
      NonNullable<BaseButtonProps['size']>,
      keyof ThemeTokens['typography'][Key]['lineHeights']
    >;
  };
};

const typography: ButtonTypography = {
  onDesktop: {
    fonts: {
      size: {
        xsmall: 75,
        small: 75,
        medium: 100,
        large: 200,
      },
    },
    lineHeights: {
      xsmall: 'l',
      small: 'l',
      medium: 'l',
      large: 's',
    },
  },
  onMobile: {
    fonts: {
      size: {
        xsmall: 50,
        small: 50,
        medium: 100,
        large: 200,
      },
    },
    lineHeights: {
      xsmall: 's',
      small: 's',
      medium: 'm',
      large: 'm',
    },
  },
};

const minHeight: Record<NonNullable<BaseButtonProps['size']>, ButtonMinHeight> = {
  xsmall: 28,
  small: 32,
  medium: 36,
  large: 48,
};

const buttonPadding: Record<
  NonNullable<BaseButtonProps['size']>,
  Record<'top' | 'bottom' | 'left' | 'right', keyof ThemeTokens['spacing']>
> = {
  xsmall: {
    top: 0,
    bottom: 0,
    left: 2,
    right: 2,
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
    left: 5,
    right: 5,
  },
  large: {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
  },
};

const buttonSizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'medium',
  large: 'medium',
};

const buttonSizeToSpinnerSizeMap: Record<
  NonNullable<BaseButtonProps['size']>,
  SpinnerProps['size']
> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'medium',
  large: 'medium',
};

const textPadding: Record<NonNullable<BaseButtonProps['size']>, keyof ThemeTokens['spacing']> = {
  xsmall: 1,
  small: 1,
  medium: 2,
  large: 2,
};

export {
  typography,
  minHeight,
  buttonSizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  textPadding,
  buttonPadding,
};
