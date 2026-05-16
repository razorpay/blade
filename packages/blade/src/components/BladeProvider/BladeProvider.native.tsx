import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';

import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';

import type { ReactElement } from 'react';
import type { BladeProviderProps } from './types';

const gestureHandlerStyle = {
  flex: 1,
};

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
  const { theme, themeContextValue } = useBladeProvider({ initialColorScheme, themeTokens });

  return (
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
  );
};

export { BladeProvider };
