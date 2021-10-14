import type { FontFamily } from './fontFamily';
import fontFamily from './fontFamily';

type FontWeight = {
  regular: 400;
  bold: 700;
};

type FontSize = {
  /** desktop: 9(px/rem/pt)
   *
   * mobile: 10(px/rem/pt)
   */
  10: number;
  /** desktop: 10(px/rem/pt)
   *
   * mobile: 11(px/rem/pt)
   */
  25: number;
  /** desktop: 11(px/rem/pt)
   *
   * mobile: 12(px/rem/pt)
   */
  50: number;
  /** desktop: 12(px/rem/pt)
   *
   * mobile: 14(px/rem/pt)
   */
  75: number;
  /** desktop: 13(px/rem/pt)
   *
   * mobile: 15(px/rem/pt)
   */
  100: number;
  /** desktop: 16(px/rem/pt)
   *
   * mobile: 17(px/rem/pt)
   */
  200: number;
  /** desktop: 18(px/rem/pt)
   *
   * mobile: 18(px/rem/pt)
   */
  300: number;
  /** desktop: 20(px/rem/pt)
   *
   * mobile: 20(px/rem/pt)
   */
  400: number;
  /** desktop: 22(px/rem/pt)
   *
   * mobile: 22(px/rem/pt)
   */
  500: number;
  /** desktop: 25(px/rem/pt)
   *
   * mobile: 24(px/rem/pt)
   */
  600: number;
  /** desktop: 28(px/rem/pt)
   *
   * mobile: 27(px/rem/pt)
   */
  700: number;
  /** desktop: 32(px/rem/pt)
   *
   * mobile: 29(px/rem/pt)
   */
  800: number;
  /** desktop: 36(px/rem/pt)
   *
   * mobile: 32(px/rem/pt)
   */
  900: number;
  /** desktop: 40(px/rem/pt)
   *
   * mobile: 35(px/rem/pt)
   */
  1000: number;
};

const fontWeight: FontWeight = {
  regular: 400,
  bold: 700,
};

export type Typography = {
  fonts: {
    family: FontFamily;
    size: FontSize;
    weight: FontWeight;
  };
  // lineHeights: {};
  // letterSpacings: {};
};

export type TypographyWithPlatforms = Record<'onDesktop' | 'onMobile', Typography>;

const typography: TypographyWithPlatforms = {
  onDesktop: {
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
  onMobile: {
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
};

export default typography;
