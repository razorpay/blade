import type { FontFamily } from './fontFamily';
import fontFamily from './fontFamily';

type FontWeight = {
  regular: 400;
  bold: 700;
};

type FontSize = {
  10: number;
  25: number;
  50: number;
  75: number;
  100: number;
  200: number;
  300: number;
  400: number;
  500: number;
  600: number;
  700: number;
  800: number;
  900: number;
  1000: number;
};

const fontWeight: FontWeight = {
  regular: 400,
  bold: 700,
};

export type Typography = Record<
  'desktop' | 'mobile',
  {
    fonts: {
      family: FontFamily;
      size: FontSize;
      weight: FontWeight;
    };
  }
>;

const typography: Typography = {
  mobile: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 10,
        25: 11,
        50: 12,
        75: 14,
        100: 15,
        200: 17,
        300: 18,
        400: 20,
        500: 22,
        600: 24,
        700: 27,
        800: 29,
        900: 32,
        1000: 35,
      },
      weight: {
        ...fontWeight,
      },
    },
    // lineHeights: {},
    // letterSpacings: {},
  },
  desktop: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 9,
        25: 10,
        50: 11,
        75: 12,
        100: 13,
        200: 16,
        300: 18,
        400: 20,
        500: 22,
        600: 25,
        700: 28,
        800: 32,
        900: 36,
        1000: 40,
      },
      weight: {
        ...fontWeight,
      },
    },
    // lineHeights: {},
    // letterSpacings: {},
  },
};

export default typography;
