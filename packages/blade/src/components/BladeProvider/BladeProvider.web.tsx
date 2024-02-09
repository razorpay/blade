import type { ReactElement } from 'react';
import {
  ThemeProvider as StyledComponentThemeProvider,
  StyleSheetManager,
} from 'styled-components';
import { FloatingDelayGroup } from '@floating-ui/react';
import stylisCSSHigherSpecificity from './stylisCSSHigherSpecificity';
import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';
import type { BladeProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { GlobalStateProvider } from '~utils/GlobalStateProvider';

const tooltipDelays = { open: 300, close: 300 };

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
  const { theme, themeContextValue } = useBladeProvider({ initialColorScheme, themeTokens });

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <FloatingDelayGroup delay={tooltipDelays}>
        <StyledComponentThemeProvider theme={theme}>
          <StyleSheetManager stylisPlugins={[stylisCSSHigherSpecificity()]}>
            <GlobalStateProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </GlobalStateProvider>
          </StyleSheetManager>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { BladeProvider };
