/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Theme } from './index';
import { useColorScheme, useBreakpoint } from '~utils';
import type { ColorSchemeNames, ColorSchemeNamesInput, ThemeTokens } from '~tokens/theme';
import { colorSchemeNamesInput } from '~tokens/theme/theme';
import type { TypographyPlatforms } from '~tokens/global';
import type { ColorSchemeModes } from '~tokens/theme/theme';
import { toTitleCase } from '~utils/toTitleCase';

type ThemeContextValue = {
  theme: Theme;
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
  platform: TypographyPlatforms;
};

/**
 * Reusable hook to be used in BladeProvider.native & BladeProvider.web file
 *
 * This hook proccesses incoming themeTokens & initialColorScheme
 * And validates & returns the theme values
 */
const useBladeProvider = ({
  themeTokens,
  initialColorScheme,
}: {
  themeTokens: ThemeTokens;
  initialColorScheme?: ColorSchemeNamesInput;
}): { theme: Theme; themeContextValue: ThemeContextValue } => {
  if (__DEV__) {
    if (!themeTokens) {
      throw new Error(
        `[BladeProvider]: Expected valid themeTokens of type ThemeTokens to be passed but found ${typeof themeTokens}`,
      );
    }

    if (initialColorScheme && !colorSchemeNamesInput.includes(initialColorScheme)) {
      throw new Error(
        `[BladeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
      );
    }
  }

  const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme);
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: themeTokens.breakpoints,
  });

  const onColorMode = `on${toTitleCase(colorScheme)}` as ColorSchemeModes;
  const onDeviceType = `on${toTitleCase(matchedDeviceType)}` as TypographyPlatforms;

  const theme: Theme = {
    ...themeTokens,
    colors: themeTokens.colors[onColorMode],
    elevation: themeTokens.elevation[onColorMode],
    typography: themeTokens.typography[onDeviceType],
  };

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
    platform: onDeviceType,
  };

  return { themeContextValue, theme };
};

export { useBladeProvider };
