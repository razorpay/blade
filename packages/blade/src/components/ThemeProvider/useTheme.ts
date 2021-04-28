import { useContext, createContext } from 'react';
import { paymentsTheme, Theme } from '../../tokens/theme';
import { UseColorScheme } from '../../utils/useColorScheme';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: paymentsTheme,
  colorScheme: 'light',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (themeContext === undefined) {
    throw new Error(`useTheme must be used within Blade's ThemeProvider`);
  }
  return themeContext;
};

export default useTheme;
