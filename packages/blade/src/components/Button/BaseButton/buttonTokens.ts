import type { BaseButtonProps } from './BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { IconProps } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner';
import type { Sizes } from '~tokens/global';
import sizes from '~tokens/global/sizes';

export type ButtonMinHeight = Sizes[700] | Sizes[800] | Sizes[900] | Sizes[1200];

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
  xsmall: sizes[700],
  small: sizes[800],
  medium: sizes[900],
  large: sizes[1200],
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

const buttonIconOnlyPadding: Record<
  NonNullable<BaseButtonProps['size']>,
  Record<'top' | 'bottom' | 'left' | 'right', keyof Theme['spacing']>
> = {
  xsmall: {
    top: 0,
    bottom: 0,
    left: 4, // should be `6px` as per design but we're making it `8px` since `6px` is not available as a spacing token
    right: 4, // should be `6px` as per design but we're making it `8px` since `6px` is not available as a spacing token
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
    left: 3,
    right: 3,
  },
  large: {
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
  },
};

const buttonSizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconProps['size']> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

const buttonIconOnlySizeToIconSizeMap: Record<
  NonNullable<BaseButtonProps['size']>,
  IconProps['size']
> = {
  xsmall: 'medium',
  small: 'medium',
  medium: 'large',
  large: 'xlarge',
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

const textPadding: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['spacing']> = {
  xsmall: 2,
  small: 2,
  medium: 3,
  large: 3,
};

export {
  typography,
  minHeight,
  buttonSizeToIconSizeMap,
  buttonIconOnlySizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  textPadding,
  buttonPadding,
  buttonIconOnlyPadding,
};
