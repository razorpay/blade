import type { ReactElement } from 'react';
import {
  ThemeProvider as StyledComponentThemeProvider,
  StyleSheetManager,
} from 'styled-components';
import { FloatingDelayGroup } from '@floating-ui/react';
import { MotionConfig } from 'framer-motion';
import stylisCSSHigherSpecificity from './stylisCSSHigherSpecificity';
import { ThemeContext } from './useTheme';
import { useBladeProvider } from './useBladeProvider';
import type { BladeProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

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
            {/* 
              If you want to add a new provider for keeping track of stack in component,
              You can move DrawerStackProvider to common utils and rename to GlobalStackProvider
              and reuse it for your component.
            */}
            {/* reducedMotion="user" reads the OS-level "Reduce Motion" preference
                and sets all framer-motion animation durations to 0 when enabled.
                This covers BaseMotion, Scale, Stagger, AnimateInteractions, etc. */}
            <MotionConfig reducedMotion="user">
              <DrawerStackProvider>
                <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
              </DrawerStackProvider>
            </MotionConfig>
          </StyleSheetManager>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { BladeProvider };
