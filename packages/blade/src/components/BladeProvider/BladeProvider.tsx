import { ReactNode, ReactElement } from 'react';
import { useColorScheme, toTitleCase } from '../../utils';
import { ThemeTokens, ColorSchemeNamesInput, colorSchemeNamesInput } from '../../tokens/theme';
import { ColorSchemeModes } from '../../tokens/theme/theme';
import { Theme, ThemeContext } from './useTheme';

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

  const colorMode = `on${toTitleCase(colorScheme)}` as ColorSchemeModes;

  const theme: Theme = {
    ...themeTokens,
    colors: themeTokens.colors[colorMode],
    shadows: {
      ...themeTokens.shadows,
      color: themeTokens.shadows.color[colorMode],
    },
    // add logic to fetch the platform
    typography: themeTokens.typography.onDesktop,
  };

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
  };

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export default BladeProvider;
