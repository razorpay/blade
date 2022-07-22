import type { FontFamily } from './fontFamily';
import fontFamily from './fontFamily';

type FontWeight = {
  regular: 400;
  bold: 700;
};

export type FontSize = {
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
   * mobile: 11(px/rem/pt)
   */
  50: number;
  /** desktop: 12(px/rem/pt)
   *
   * mobile: 12(px/rem/pt)
   */
  75: number;
  /** desktop: 14(px/rem/pt)
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
   * mobile: 22(px/rem/pt)
   */
  600: number;
  /** desktop: 28(px/rem/pt)
   *
   * mobile: 24(px/rem/pt)
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
   * mobile: 29(px/rem/pt)
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
  lineHeights: {
    /** desktop: 16(px/rem/pt)
     *
     * mobile: 16(px/rem/pt)
     */
    s: number;
    /** desktop: 16(px/rem/pt)
     *
     * mobile: 18(px/rem/pt)
     */
    m: number;
    /** desktop: 20(px/rem/pt)
     *
     * mobile: 24(px/rem/pt)
     */
    l: number;
    /** desktop: 24(px/rem/pt)
     *
     * mobile: 28(px/rem/pt)
     */
    xl: number;
    /** desktop: 24(px/rem/pt)
     *
     * mobile: 24(px/rem/pt)
     */
    '2xl': number;
    /** desktop: 28(px/rem/pt)
     *
     * mobile: 28(px/rem/pt)
     */
    '3xl': number;
    /** desktop: 40(px/rem/pt)
     *
     * mobile: 32(px/rem/pt)
     */
    '4xl': number;
    /** desktop: 42(px/rem/pt)
     *
     * mobile: 30(px/rem/pt)
     */
    '5xl': number;
    /** desktop: 60(px/rem/pt)
     *
     * mobile: 40(px/rem/pt)
     */
    '6xl': number;
  };
  // letterSpacings: {};
};

export type TypographyPlatforms = 'onDesktop' | 'onMobile';

export type TypographyWithPlatforms = Record<TypographyPlatforms, Typography>;

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
        100: 14,
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
    lineHeights: {
      s: 16,
      m: 16,
      l: 20,
      xl: 24,
      '2xl': 24,
      '3xl': 28,
      '4xl': 40,
      '5xl': 42,
      '6xl': 60,
    },
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
        50: 11,
        75: 12,
        100: 15,
        200: 17,
        300: 18,
        400: 20,
        500: 22,
        600: 22,
        700: 24,
        800: 29,
        900: 32,
        1000: 29,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      s: 16,
      m: 18,
      l: 24,
      xl: 28,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 30,
      '6xl': 40,
    },
    // letterSpacings: {},
  },
};

export default typography;
