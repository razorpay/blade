import React, { ReactNode, ReactElement } from 'react';
import { useColorScheme } from '../../utils';
import { Theme as ThemeType } from '../../tokens/theme';
import { ThemeContext } from './useTheme';

export type ColorScheme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  theme: ThemeType;
  colorScheme: ColorScheme;
  children: ReactNode; // @TODO: change this
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
   * [] - Add types
   * [] - Add tests
   * [] - move the constants and check for color scheme out at a central place for color scheme
   * [] - a sandbox environment to test these new changes
   *
   * Future:
   * - locale
   */
  if (!['light', 'dark', 'system'].includes(initialColorScheme)) {
    throw new Error(
      `[ThemeProvider]: Expected color scheme to be one of [light, dark, system] but received ${initialColorScheme}`,
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
