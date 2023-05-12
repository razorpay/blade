import type { ReactNode } from 'react';
import type { ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme';

type BladeProviderProps = {
  themeTokens: ThemeTokens;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

export { BladeProviderProps };
