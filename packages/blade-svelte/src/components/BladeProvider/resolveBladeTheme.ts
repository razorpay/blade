import type {
  ColorSchemeNames,
  ColorSchemeNamesInput,
  ThemeTokens,
  TypographyPlatforms,
} from '@razorpay/blade-core/tokens';
import type { Theme } from './types';
import { getColorScheme } from './getColorScheme';
import { getTypographyPlatform } from './getTypographyPlatform';

/**
 * Flatten ThemeTokens into a resolved Theme for the active color scheme + platform.
 */
export const resolveBladeTheme = ({
  themeTokens,
  colorSchemeInput,
  viewportWidth,
}: {
  themeTokens: ThemeTokens;
  colorSchemeInput: ColorSchemeNamesInput;
  viewportWidth?: number;
}): {
  theme: Theme;
  colorScheme: ColorSchemeNames;
  platform: TypographyPlatforms;
} => {
  const colorScheme = getColorScheme(colorSchemeInput);
  const platform = getTypographyPlatform(themeTokens.breakpoints, viewportWidth);
  const onColorMode = colorScheme === 'dark' ? 'onDark' : 'onLight';

  const theme: Theme = {
    name: themeTokens.name,
    border: themeTokens.border,
    backdropBlur: themeTokens.backdropBlur,
    breakpoints: themeTokens.breakpoints,
    spacing: themeTokens.spacing,
    motion: themeTokens.motion,
    colors: themeTokens.colors[onColorMode],
    elevation: themeTokens.elevation[onColorMode],
    typography: themeTokens.typography[platform],
  };

  return { theme, colorScheme, platform };
};
