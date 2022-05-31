import { useContext, createContext } from 'react';
import type { UseColorScheme } from '../../utils/useColorScheme';
import type { TypographyPlatforms } from '../../tokens/global/typography';
import emptyTheme from './emptyTheme';
import type { Theme } from './';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
  platform: TypographyPlatforms;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: emptyTheme,
  colorScheme: 'light',
  platform: 'onDesktop',
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
