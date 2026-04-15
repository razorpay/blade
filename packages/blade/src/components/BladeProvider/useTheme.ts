import { useContext, createContext } from 'react';
import type { Theme } from './';
import type { ThemeTokens } from '~tokens/theme';
import type { UseColorScheme } from '~utils/useColorScheme';
import type { TypographyPlatforms } from '~tokens/global';
import { throwBladeError } from '~utils/logger';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
  themeTokens: ThemeTokens;
  platform: TypographyPlatforms;
};

export const ThemeContext = createContext<ThemeContext>({
  // @ts-expect-error set null
  theme: null,
  // @ts-expect-error set null
  themeTokens: null,
  colorScheme: 'light',
  platform: 'onDesktop',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (__DEV__) {
    if (!themeContext.theme) {
      throwBladeError({
        message: 'BladeProvider is missing theme',
        moduleName: 'BladeProvider',
      });
    }
    if (themeContext === undefined) {
      throwBladeError({
        message: 'useTheme must be used within BladeProvider',
        moduleName: 'BladeProvider',
      });
    }
  }
  return themeContext;
};

export default useTheme;
