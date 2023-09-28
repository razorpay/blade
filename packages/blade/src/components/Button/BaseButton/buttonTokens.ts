import type { BaseButtonProps } from './BaseButton';
import type { Theme } from '~components/BladeProvider';
import type { IconSize } from '~components/Icons';
import type { SpinnerProps } from '~components/Spinner';
import type { Size } from '~tokens/global';
import { size } from '~tokens/global';

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
    xsmall: 50,
    small: 50,
    medium: 100,
    large: 300,
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
    left: 2,
    right: 2,
  },
};

const buttonSizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
};

const buttonIconOnlySizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize> = {
  xsmall: 'small',
  small: 'small',
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
  buttonIconPadding,
  buttonPadding,
  buttonIconOnlyPadding,
};
