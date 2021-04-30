import { ReactNode, ReactElement } from 'react';
import { useColorScheme } from '../../utils';
import { Theme, ColorSchemeNamesInput, colorSchemeNamesInput } from '../../tokens/theme';
import { ThemeContext } from './useTheme';

export type ThemeProviderProps = {
  theme: Theme;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

const ThemeProvider = ({
  theme,
  colorScheme: initialColorScheme,
  children,
}: ThemeProviderProps): ReactElement => {
  if (!theme) {
    throw new Error(
      `[ThemeProvider]: Expected valid theme object of type Theme to be passed but found ${typeof theme}`,
    );
  }

  if (initialColorScheme && !colorSchemeNamesInput.includes(initialColorScheme)) {
    throw new Error(
      `[ThemeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
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
