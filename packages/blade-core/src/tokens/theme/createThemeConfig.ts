import type { ColorInput } from 'tinycolor2';
import type { Border } from '~tokens/global';
import type { ColorChromaticScale } from '~tokens/global/colors';
import type { FontFamily } from '~tokens/global/fontFamily/types';
import type { FontSize } from '~tokens/global/typography';
import type { ThemeTokens } from './theme';

export type CreateThemeFontFace = {
  fontFamily: string;
  src: string | string[];
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic';
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /** Passed to `format()` when src has no format hint, e.g. `woff2`. */
  format?: string;
};

export type CreateThemeFontFamilyOverride = Partial<FontFamily>;

export type CreateThemeFontSizeScaleOverride = Partial<Record<keyof FontSize, number>>;

/**
 * Merchant-friendly surface background overrides (hex / hsl / css colors).
 * `page` maps to `surface.background.gray.moderate` (checkout canvas).
 */
export type CreateThemeSurfaceBackgroundOverride = Partial<{
  page: string;
  graySubtle: string;
  grayIntense: string;
  primarySubtle: string;
  primaryIntense: string;
  seaSubtle: string;
  seaIntense: string;
  cloudSubtle: string;
  cloudIntense: string;
}>;

export type CreateThemeSurfaceOverride = {
  /** Applied to both color modes unless `onLight` / `onDark` are set. */
  background?: CreateThemeSurfaceBackgroundOverride;
  onLight?: { background?: CreateThemeSurfaceBackgroundOverride };
  onDark?: { background?: CreateThemeSurfaceBackgroundOverride };
};

export type CreateThemeConfig = {
  brandColor: ColorInput;
  borderRadius?: Partial<Record<keyof Border['radius'], number | string>>;
  fontFamily?: CreateThemeFontFamilyOverride;
  /**
   * `@font-face` rules emitted as `fontFaceCss` on the result.
   * Pair with `fontFamily` names that match `fontFamily` on each face.
   */
  fontFaces?: CreateThemeFontFace[];
  /** Overrides named font-size tokens on desktop + mobile scales. */
  fontSizeOverrides?: CreateThemeFontSizeScaleOverride;
  /** Multiplies every font-size token on both platforms (applied after `fontSizeOverrides`). */
  fontSizeScaleFactor?: number;
  surface?: CreateThemeSurfaceOverride;
};

export type CreateThemeResult = {
  theme: ThemeTokens;
  brandColors: ColorChromaticScale;
  /** Inject once (e.g. `<style>` or BladeProvider) before themed UI renders. */
  fontFaceCss?: string;
};
