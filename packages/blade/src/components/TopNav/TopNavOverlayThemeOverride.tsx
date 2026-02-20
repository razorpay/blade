import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTopNavContext } from './TopNavContext';
import { bladeTheme } from '~tokens/theme';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import { ThemeContext } from '~components/BladeProvider/useTheme';

type TopNavOverlayThemeOverrideProps = {
  children: React.ReactNode;
  /**
   * When `true`, switches the theme to the app's original colorScheme
   * (stored in TopNavContext) instead of TopNav's default dark theme.
   *
   * Used by SearchInput to toggle between dark (unfocused) and the
   * original app theme (focused) while inside TopNav.
   *
   * @default false — stays in dark theme (TopNav's default)
   */
  shouldOverrideTheme?: boolean;
};

/**
 * Wraps children with the correct theme when rendered inside TopNav.
 *
 * TopNav forces a dark theme, but overlay/child components should render
 * in the app's original colorScheme. This wrapper centralises that logic.
 *
 * - Without `shouldOverrideTheme` (default): wraps with BladeProvider using
 *   the app's original colorScheme (for portalled overlays like Popover, Menu).
 * - With `shouldOverrideTheme={false}`: stays in TopNav's dark theme.
 * - With `shouldOverrideTheme={true}`: switches to the app's original colorScheme
 *   via ThemeContext + StyledThemeProvider (for inline theme switches like SearchInput).
 *
 * Outside TopNav this is a no-op passthrough.
 */
const TopNavOverlayThemeOverride = ({
  children,
  shouldOverrideTheme,
}: TopNavOverlayThemeOverrideProps): React.ReactElement => {
  const topNavContext = useTopNavContext();
  const { platform } = useTheme();

  if (!topNavContext) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  if (shouldOverrideTheme !== undefined) {
    const colorScheme = shouldOverrideTheme ? topNavContext.colorScheme : 'dark';
    const isDark = colorScheme === 'dark';
    const overrideTheme: Theme = {
      ...bladeTheme,
      colors: isDark ? bladeTheme.colors.onDark : bladeTheme.colors.onLight,
      elevation: isDark ? bladeTheme.elevation.onDark : bladeTheme.elevation.onLight,
      typography: bladeTheme.typography[platform],
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = (): void => {};

    return (
      <ThemeContext.Provider
        value={{
          theme: overrideTheme,
          colorScheme,
          setColorScheme: noop,
          platform,
        }}
      >
        <StyledThemeProvider theme={overrideTheme}>{children}</StyledThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme={topNavContext.colorScheme}>
      {children}
    </BladeProvider>
  );
};

export { TopNavOverlayThemeOverride };
