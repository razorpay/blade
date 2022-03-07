import { ReactNode, ReactElement } from 'react';
import { useColorScheme, toTitleCase, useBreakpoint } from '../../utils';
import { colorSchemeNamesInput } from '../../tokens/theme';
import type { TypographyPlatforms } from '../../tokens/global/typography';
import type {
  ColorSchemeModes,
  ThemeTokens,
  ColorSchemeNamesInput,
} from '../../tokens/theme/theme.d';
import type { Theme } from './useTheme';
import { ThemeContext } from './useTheme';

export type BladeProviderProps = {
  themeTokens: ThemeTokens;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
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

  const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme);
  const { deviceType } = useBreakpoint({ breakpoints: themeTokens.breakpoints });

  const colorMode = `on${toTitleCase(colorScheme)}` as ColorSchemeModes;
  const onDeviceType = `on${toTitleCase(deviceType)}` as TypographyPlatforms;

  const theme: Theme = {
    ...themeTokens,
    colors: themeTokens.colors[colorMode],
    shadows: {
      ...themeTokens.shadows,
      color: themeTokens.shadows.color[colorMode],
    },
    typography: themeTokens.typography[onDeviceType],
  };

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
  };

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export default BladeProvider;
