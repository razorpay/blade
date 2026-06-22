import type { ReactElement } from 'react';
import { createContext, useContext } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';
import type { BladeProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';

const gestureHandlerStyle = {
  flex: 1,
};

// Set to `true` for everything rendered below a BladeProvider, so a nested
// BladeProvider can detect it is not the root and skip re-mounting root-only
// infra (gesture root, portal, bottom-sheet stack) that must exist only once.
const IsNestedBladeProviderContext = createContext(false);

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
  const isNested = useContext(IsNestedBladeProviderContext);
  const { theme, themeContextValue } = useBladeProvider({ initialColorScheme, themeTokens });

  if (isNested) {
    return (
      <ThemeContext.Provider value={themeContextValue}>
        <StyledComponentThemeProvider theme={theme}>{children}</StyledComponentThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <IsNestedBladeProviderContext.Provider value={true}>
      <GestureHandlerRootView style={gestureHandlerStyle}>
        <PortalProvider>
          <ThemeContext.Provider value={themeContextValue}>
            <StyledComponentThemeProvider theme={theme}>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
              <PortalHost name="BladeBottomSheetPortal" />
            </StyledComponentThemeProvider>
          </ThemeContext.Provider>
        </PortalProvider>
      </GestureHandlerRootView>
    </IsNestedBladeProviderContext.Provider>
  );
};

export { BladeProvider };
