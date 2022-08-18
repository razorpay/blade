import type { BaseButtonProps } from './BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { IconProps } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner/Spinner';

export type ButtonMinHeight = 28 | 32 | 36 | 48;

export type ButtonTypography = {
  fonts: {
    size: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['typography']['fonts']['size']>;
  };
  lineHeights: Record<
    NonNullable<BaseButtonProps['size']>,
    keyof Theme['typography']['lineHeights']
  >;
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
    xsmall: 's',
    small: 's',
    medium: 'l',
    large: 'm',
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
  Record<'top' | 'bottom' | 'left' | 'right', keyof Theme['spacing']>
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
  medium: 'small',
  large: 'small',
};

const buttonIconOnlySizeToIconSizeMap: Record<
  NonNullable<BaseButtonProps['size']>,
  IconProps['size']
> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const buttonSizeToSpinnerSizeMap: Record<
  NonNullable<BaseButtonProps['size']>,
  SpinnerProps['size']
> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const textPadding: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['spacing']> = {
  xsmall: 1,
  small: 1,
  medium: 2,
  large: 2,
};

export {
  typography,
  minHeight,
  buttonSizeToIconSizeMap,
  buttonIconOnlySizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  textPadding,
  buttonPadding,
};
