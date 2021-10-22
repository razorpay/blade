import { useContext, createContext } from 'react';
import { Colors, Shadows, ShadowLevels } from '../../tokens/theme/theme.d';
import type { Typography } from '../../tokens/global/typography';
import type { Border } from '../../tokens/global/border';
import type { Spacing } from '../../tokens/global/spacing';
import type { UseColorScheme } from '../../utils/useColorScheme';

export type Theme = {
  colors: Colors;
  border: Border;
  spacing: Spacing;
  shadows: Omit<Shadows, 'color'> & {
    color: {
      level: Record<ShadowLevels, string>;
    };
  };
  typography: Typography;
};

export type ThemeContext = UseColorScheme & {
  theme: Theme | undefined;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: undefined,
  colorScheme: 'light',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (themeContext === undefined) {
    throw new Error(`[@razorpay/blade]: useTheme must be used within Blade's Provider`);
  }
  return themeContext;
};

export default useTheme;
