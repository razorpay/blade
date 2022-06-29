import type { ThemeTokens } from '../../../tokens/theme/theme.d';
import type { TypographyPlatforms } from '../../../tokens/global/typography';
import type { IconProps } from '../../Icons';
import type { SpinnerProps } from '../../Spinner/BaseSpinner/Spinner';
import type { BaseButtonProps } from './BaseButton';

//TODO: Sort keys in all objects

export type ButtonMinHeight = 48 | 36 | 32 | 28;

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
        large: 200,
        medium: 100,
        small: 75,
        xsmall: 75,
      },
    },
    lineHeights: {
      large: 's',
      medium: 'l',
      small: 'l',
      xsmall: 'l',
    },
  },
  onMobile: {
    fonts: {
      size: {
        large: 200,
        medium: 100,
        small: 50,
        xsmall: 50,
      },
    },
    lineHeights: {
      large: 'm',
      medium: 'm',
      small: 's',
      xsmall: 's',
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

const iconSize: Record<NonNullable<BaseButtonProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'medium',
  large: 'medium',
};

const spinnerSize: Record<NonNullable<BaseButtonProps['size']>, SpinnerProps['size']> = {
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

export { typography, minHeight, iconSize, spinnerSize, textPadding, buttonPadding };
