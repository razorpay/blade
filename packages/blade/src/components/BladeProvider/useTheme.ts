import { useContext, createContext } from 'react';
import type { UseColorScheme } from '../../utils/useColorScheme';
import emptyTheme from './emptyTheme';
import type { Theme } from './';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: emptyTheme,
  colorScheme: 'light',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (themeContext === undefined) {
    throw new Error(`[@razorpay/blade:BladeProvider]: useTheme must be used within BladeProvider`);
  }
  return themeContext;
};

export default useTheme;
