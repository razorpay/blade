import React, { ReactNode, ReactElement } from 'react';
import { useColorScheme } from '../../utils';
import { Theme, ColorSchemeNames, colorSchemeNames } from '../../tokens/theme';
import { ThemeContext } from './useTheme';

type ThemeProviderProps = {
  theme: Theme;
  colorScheme: ColorSchemeNames;
  children: ReactNode;
};

const ThemeProvider = ({
  theme,
  colorScheme: initialColorScheme,
  children,
}: ThemeProviderProps): ReactElement => {
  /**
   * return all the theme related stuff:
   * [x] - current theme mode
   * [x] - function to change theme mode
   * [x] - current theme object
   * [x] - Create a function/hook to identify system settings for color scheme mode
   * [x] - eslint object multiline
   * [x] - Rename the ThemeProvider to ThemeProvider
   * [x] - Add types
   * [x] - move the constants and check for color scheme out at a central place for color scheme
   * [] - Add tests
   * [] - a sandbox environment to test these new changes
   *
   * Future:
   * - locale
   */
  if (!colorSchemeNames.includes(initialColorScheme)) {
    throw new Error(
      `[ThemeProvider]: Expected color scheme to be one of [${colorSchemeNames.toString()}] but received ${initialColorScheme}`,
    );
  }

  const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme);

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
  };

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
