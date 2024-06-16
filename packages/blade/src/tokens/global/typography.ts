import { fontFamily } from './fontFamily';
import type { FontFamily } from './fontFamily/types';

type FontWeight = {
  regular: 400;
  medium: 500;
  semibold: 600;
  bold: 700;
};

/**
 * For font size and line-heights we can’t say from xl to 2xl the value will necessary increase.
 * it might decrease or remain same because these are alias tokens and we need aliases for cross platform.
 * so for example xl on mobile can be 32px and on desktop xl can be 34px,
 * similarly 2xl on mobile can be 34px but on desktop doesn’t necessarily mean 2xl will be more than xl(34px) it can be 32 as well since visually they make better hierarchy.
 */

export type FontSize = {
  /** desktop: 10(px/rem/pt)
   *
   * mobile: 10(px/rem/pt)
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
   * mobile: 14(px/rem/pt)
   */
  100: number;
  /** desktop: 16(px/rem/pt)
   *
   * mobile: 16(px/rem/pt)
   */
  200: number;
  /** desktop: 18(px/rem/pt)
   *
   * mobile: 16(px/rem/pt)
   */
  300: number;
  /** desktop: 20(px/rem/pt)
   *
   * mobile: 18(px/rem/pt)
   */
  400: number;
  /** desktop: 24(px/rem/pt)
   *
   * mobile: 20(px/rem/pt)
   */
  500: number;
  /** desktop: 32(px/rem/pt)
   *
   * mobile: 24(px/rem/pt)
   */
  600: number;
  /** desktop: 40(px/rem/pt)
   *
   * mobile: 32(px/rem/pt)
   */
  700: number;
  /** desktop: 48(px/rem/pt)
   *
   * mobile: 34(px/rem/pt)
   */
  800: number;
  /** desktop: 56(px/rem/pt)
   *
   * mobile: 36(px/rem/pt)
   */
  900: number;
  /** desktop: 64(px/rem/pt)
   *
   * mobile: 38(px/rem/pt)
   */
  1000: number;
  /** desktop: 72(px/rem/pt)
   *
   * mobile: 40(px/rem/pt)
   */
  1100: number;
};

const fontWeight: FontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export type Typography = {
  fonts: {
    family: FontFamily;
    size: FontSize;
    weight: FontWeight;
  };
  lineHeights: {
    /** desktop: 0(px/rem/pt)
     *
     * mobile: 0(px/rem/pt)
     */
    0: number;
    /** desktop: 14(px/rem/pt)
     *
     * mobile: 14(px/rem/pt)
     */
    25: number;
    /** desktop: 16(px/rem/pt)
     *
     * mobile: 16(px/rem/pt)
     */
    50: number;
    /** desktop: 18(px/rem/pt)
     *
     * mobile: 18(px/rem/pt)
     */
    75: number;
    /** desktop: 20(px/rem/pt)
     *
     * mobile: 20(px/rem/pt)
     */
    100: number;
    /** desktop: 24(px/rem/pt)
     *
     * mobile: 24(px/rem/pt)
     */
    200: number;
    /** desktop: 24(px/rem/pt)
     *
     * mobile: 22(px/rem/pt)
     */
    300: number;
    /** desktop: 26(px/rem/pt)
     *
     * mobile: 24(px/rem/pt)
     */
    400: number;
    /** desktop: 32(px/rem/pt)
     *
     * mobile: 26(px/rem/pt)
     */
    500: number;
    /** desktop: 38(px/rem/pt)
     *
     * mobile: 32(px/rem/pt)
     */
    600: number;
    /** desktop: 46(px/rem/pt)
     *
     * mobile: 38(px/rem/pt)
     */
    700: number;
    /** desktop: 56(px/rem/pt)
     *
     * mobile: 40(px/rem/pt)
     */
    800: number;
    /** desktop: 64(px/rem/pt)
     *
     * mobile: 42(px/rem/pt)
     */
    900: number;
    /** desktop: 70(px/rem/pt)
     *
     * mobile: 46(px/rem/pt)
     */
    1000: number;
    /** desktop: 78(px/rem/pt)
     *
     * mobile: 48(px/rem/pt)
     */
    1100: number;
  };
  letterSpacings: {
    /** -1% */
    50: number;
    /** 0% */
    100: number;
  };
};

export type TypographyPlatforms = 'onDesktop' | 'onMobile';

export type TypographyWithPlatforms = Record<TypographyPlatforms, Typography>;

export const typography: TypographyWithPlatforms = {
  onDesktop: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        25: 10,
        50: 11,
        75: 12,
        100: 14,
        200: 16,
        300: 18,
        400: 20,
        500: 24,
        600: 32,
        700: 40,
        800: 48,
        900: 56,
        1000: 64,
        1100: 72,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      0: 0,
      25: 14,
      50: 16,
      75: 18,
      100: 20,
      200: 24,
      300: 24,
      400: 26,
      500: 32,
      600: 38,
      700: 46,
      800: 56,
      900: 64,
      1000: 70,
      1100: 78,
    },
    letterSpacings: {
      50: -1,
      100: 0,
    },
  },
  onMobile: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        25: 10,
        50: 11,
        75: 12,
        100: 14,
        200: 16,
        300: 16,
        400: 18,
        500: 20,
        600: 24,
        700: 32,
        800: 34,
        900: 36,
        1000: 38,
        1100: 40,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      0: 0,
      25: 14,
      50: 16,
      75: 18,
      100: 20,
      200: 24,
      300: 22,
      400: 24,
      500: 26,
      600: 32,
      700: 38,
      800: 40,
      900: 42,
      1000: 46,
      1100: 48,
    },
    letterSpacings: {
      50: -1,
      100: 0,
    },
  },
};
