import type { ThemeTokens } from '../../../tokens/theme/theme.d';
import type { TypographyPlatforms } from '../../../tokens/global/typography';
import type { Required } from '../../../_helpers/types';
import type { BaseButtonProps } from './BaseButton';

export type ButtonMinHeight = '48px' | '40px' | '32px' | '28px';

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

export { typography };
