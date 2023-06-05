import type { ReactElement } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { FloatingDelayGroup } from '@floating-ui/react';
import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';
import type { BladeProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
  const { theme, themeContextValue } = useBladeProvider({ initialColorScheme, themeTokens });

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <FloatingDelayGroup delay={{ open: 400, close: 1000 }}>
        <StyledComponentThemeProvider theme={theme}>
          <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { BladeProvider };
