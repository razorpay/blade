import type { ReactNode, ReactElement } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { ThemeContext } from './useTheme';
import type { Theme } from './';
import { useColorScheme, toTitleCase, useBreakpoint } from '~utils';
import { colorSchemeNamesInput } from '~tokens/theme';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { ColorSchemeModes, ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme/theme';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';

export type BladeProviderProps = {
  themeTokens: ThemeTokens;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

const BladeProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: BladeProviderProps): ReactElement => {
  if (!themeTokens) {
    throw new Error(
      `[BladeProvider]: Expected valid themeTokens of type ThemeTokens to be passed but found ${typeof themeTokens}`,
    );
  }

  if (initialColorScheme && !colorSchemeNamesInput.includes(initialColorScheme)) {
    throw new Error(
      `[BladeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
    );
  }

  const { colorScheme, setColorScheme } = useColorScheme(initialColorScheme);
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: themeTokens.breakpoints,
  });

  const onColorMode = `on${toTitleCase(colorScheme)}` as ColorSchemeModes;
  const onDeviceType = `on${toTitleCase(matchedDeviceType)}` as TypographyPlatforms;

  const theme: Theme = {
    ...themeTokens,
    colors: themeTokens.colors[onColorMode],
    shadows: {
      ...themeTokens.shadows,
      color: themeTokens.shadows.color[onColorMode],
    },
    typography: themeTokens.typography[onDeviceType],
  };

  const themeContextValue = {
    theme,
    colorScheme,
    setColorScheme,
    platform: onDeviceType,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <StyledComponentThemeProvider theme={theme}>
        <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
      </StyledComponentThemeProvider>
    </ThemeContext.Provider>
  );
};

export default BladeProvider;
