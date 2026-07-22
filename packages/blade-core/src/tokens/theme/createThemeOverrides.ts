import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';
import { typography as defaultTypography } from '~tokens/global/typography';
import type { FontSize, Typography, TypographyWithPlatforms } from '~tokens/global/typography';
import type { ThemeTokens } from './theme';
import type {
  CreateThemeFontFamilyOverride,
  CreateThemeFontSizeScaleOverride,
  CreateThemeSurfaceBackgroundOverride,
  CreateThemeSurfaceOverride,
} from './createThemeConfig';

const mapSurfaceBackgroundOverride = (
  override: CreateThemeSurfaceBackgroundOverride,
): DeepPartial<ThemeTokens['colors']['onLight']['surface']['background']> => {
  const background: DeepPartial<ThemeTokens['colors']['onLight']['surface']['background']> = {};

  const assign = (key: keyof CreateThemeSurfaceBackgroundOverride, value: string): void => {
    if (key === 'page') {
      background.gray = { ...background.gray, moderate: value };
      return;
    }
    if (key === 'graySubtle') {
      background.gray = { ...background.gray, subtle: value };
      return;
    }
    if (key === 'grayIntense') {
      background.gray = { ...background.gray, intense: value };
      return;
    }
    if (key === 'primarySubtle') {
      background.primary = { ...background.primary, subtle: value };
      return;
    }
    if (key === 'primaryIntense') {
      background.primary = { ...background.primary, intense: value };
      return;
    }
    if (key === 'seaSubtle') {
      background.sea = { ...background.sea, subtle: value };
      return;
    }
    if (key === 'seaIntense') {
      background.sea = { ...background.sea, intense: value };
      return;
    }
    if (key === 'cloudSubtle') {
      background.cloud = { ...background.cloud, subtle: value };
      return;
    }
    if (key === 'cloudIntense') {
      background.cloud = { ...background.cloud, intense: value };
    }
  };

  for (const key of Object.keys(override) as (keyof CreateThemeSurfaceBackgroundOverride)[]) {
    const value = override[key];
    if (value !== undefined) {
      assign(key, value);
    }
  }

  return background;
};

export const buildSurfaceColorOverrides = (
  surface?: CreateThemeSurfaceOverride,
): DeepPartial<ThemeTokens['colors']> | undefined => {
  if (!surface) {
    return undefined;
  }

  const buildMode = (
    background?: CreateThemeSurfaceBackgroundOverride,
  ): DeepPartial<ThemeTokens['colors']['onLight']> | undefined => {
    if (!background || Object.keys(background).length === 0) {
      return undefined;
    }
    return {
      surface: {
        background: mapSurfaceBackgroundOverride(background),
      },
    };
  };

  const onLightBackground: CreateThemeSurfaceBackgroundOverride = {
    ...surface.background,
    ...surface.onLight?.background,
  };
  const onDarkBackground: CreateThemeSurfaceBackgroundOverride = {
    ...surface.background,
    ...surface.onDark?.background,
  };

  const onLight = buildMode(onLightBackground);
  const onDark = buildMode(onDarkBackground);

  if (!onLight && !onDark) {
    return undefined;
  }

  return {
    ...(onLight ? { onLight } : {}),
    ...(onDark ? { onDark } : {}),
  };
};

const applyFontSizeScaleFactor = (size: FontSize, factor: number): FontSize => {
  const next = { ...size };
  for (const key of (Object.keys(next) as unknown) as (keyof FontSize)[]) {
    next[key] = Math.round(next[key] * factor);
  }
  return next;
};

const mergeFontSizeScale = (
  size: FontSize,
  scale?: CreateThemeFontSizeScaleOverride,
  factor?: number,
): FontSize => {
  let next = scale ? { ...size, ...scale } : { ...size };
  if (factor !== undefined && factor !== 1) {
    next = applyFontSizeScaleFactor(next, factor);
  }
  return next;
};

export const buildTypographyOverrides = ({
  fontFamily,
  fontSizeOverrides,
  fontSizeScaleFactor,
}: {
  fontFamily?: CreateThemeFontFamilyOverride;
  fontSizeOverrides?: CreateThemeFontSizeScaleOverride;
  fontSizeScaleFactor?: number;
}): DeepPartial<TypographyWithPlatforms> | undefined => {
  const hasFamily = fontFamily && Object.keys(fontFamily).length > 0;
  const hasSize =
    (fontSizeOverrides && Object.keys(fontSizeOverrides).length > 0) ||
    (fontSizeScaleFactor !== undefined && fontSizeScaleFactor !== 1);

  if (!hasFamily && !hasSize) {
    return undefined;
  }

  const patchPlatform = (platform: Typography): DeepPartial<Typography> => {
    const fonts: DeepPartial<Typography['fonts']> = {};
    if (hasFamily) {
      fonts.family = { ...fontFamily };
    }
    if (hasSize) {
      fonts.size = mergeFontSizeScale(platform.fonts.size, fontSizeOverrides, fontSizeScaleFactor);
    }
    return { fonts };
  };

  return {
    onDesktop: patchPlatform(defaultTypography.onDesktop),
    onMobile: patchPlatform(defaultTypography.onMobile),
  };
};
