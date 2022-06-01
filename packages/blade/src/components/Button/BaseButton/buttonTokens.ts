import type { ThemeTokens } from '../../../tokens/theme/theme.d';
import type { TypographyPlatforms } from '../../../tokens/global/typography';

type ButtonTypography = {
  [key in TypographyPlatforms]: {
    fonts: {
      size: Record<string, keyof ThemeTokens['typography'][key]['fonts']['size']>;
    };
    lineHeights: Record<string, keyof ThemeTokens['typography'][key]['lineHeights']>;
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
      large: 'm', // this is 24px but we need 20px
      medium: 'm', // this is 24px but we need 20px
      small: 's',
      xsmall: 'xl',
    },
  },
};

export { typography };
