import type { ThemeTokens } from '../../../tokens/theme/theme.d';
import type { TypographyPlatforms } from '../../../tokens/global/typography';
import type { Required } from '../../../_helpers/types';
import type { IconProps } from '../../Icons';
import type { BaseButtonProps } from './BaseButton';

//TODO: Sort keys in all objects

export type ButtonMinHeight = 48 | 40 | 32 | 28;

export type ButtonTypography = {
  [key in TypographyPlatforms]: {
    fonts: {
      size: Record<
        Required<BaseButtonProps['size']>,
        keyof ThemeTokens['typography'][key]['fonts']['size']
      >;
    };
    lineHeights: Record<
      Required<BaseButtonProps['size']>,
      keyof ThemeTokens['typography'][key]['lineHeights']
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

const minHeight: Record<Required<BaseButtonProps['size']>, ButtonMinHeight> = {
  xsmall: 28,
  small: 32,
  medium: 40,
  large: 48,
};

const spacing: Record<
  Required<BaseButtonProps['size']>,
  Record<'topBottom' | 'rightLeft', keyof ThemeTokens['spacing']>
> = {
  xsmall: {
    topBottom: 0,
    rightLeft: 2,
  },
  small: {
    topBottom: 0,
    rightLeft: 3,
  },
  medium: {
    topBottom: 0,
    rightLeft: 5,
  },
  large: {
    topBottom: 0,
    rightLeft: 5,
  },
};

const iconSize: Record<Required<BaseButtonProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'medium',
  large: 'medium',
};

const iconSpacing: Record<Required<BaseButtonProps['size']>, keyof ThemeTokens['spacing']> = {
  xsmall: 1,
  small: 1,
  medium: 2,
  large: 2,
};

export { typography, minHeight, iconSize, iconSpacing, spacing };
