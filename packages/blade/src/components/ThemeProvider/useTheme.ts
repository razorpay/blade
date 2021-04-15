import { useContext, createContext } from 'react';
import { lightTheme, Theme } from '../../tokens/theme';
import { UseColorScheme } from '../../utils/useColorScheme';

export type ThemeContext = {
  theme: Theme;
} & UseColorScheme;

export const ThemeContext = createContext<ThemeContext>({
  theme: lightTheme,
  colorScheme: 'light',
  setColorScheme: () => '',
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (themeContext === undefined) {
    throw new Error(`useTheme must be used within Blade's ThemeProvider`);
  }
  return themeContext;
};

export default useTheme;
