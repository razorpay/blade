import type { ThemeTokens } from '../../../tokens/theme/theme.d';
import type { TypographyPlatforms } from '../../../tokens/global/typography';

export type ButtonMinHeight = '48px' | '36px' | '32px' | '28px';

export type ButtonTypography = {
  [Key in TypographyPlatforms]: {
    fonts: {
      size: Record<string, keyof ThemeTokens['typography'][Key]['fonts']['size']>;
    };
    lineHeights: Record<string, keyof ThemeTokens['typography'][Key]['lineHeights']>;
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
