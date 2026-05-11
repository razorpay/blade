import type { ReactElement } from 'react';
import {
  ThemeProvider as StyledComponentThemeProvider,
  StyleSheetManager,
  createGlobalStyle,
} from 'styled-components';
import { FloatingDelayGroup } from '@floating-ui/react';
import stylisCSSHigherSpecificity from './stylisCSSHigherSpecificity';
import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';
import type { BladeProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const tooltipDelays = { open: 300, close: 300 };

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Match Figma's font rendering */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

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
          <GlobalStyle />
          <StyleSheetManager stylisPlugins={[stylisCSSHigherSpecificity()]}>
            {/* 
              If you want to add a new provider for keeping track of stack in component,
              You can move DrawerStackProvider to common utils and rename to GlobalStackProvider
              and reuse it for your component.
            */}
            <DrawerStackProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </DrawerStackProvider>
          </StyleSheetManager>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { BladeProvider };
