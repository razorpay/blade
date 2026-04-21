import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTopNavContext } from './TopNavContext';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import { ThemeContext } from '~components/BladeProvider/useTheme';

const getOverrideColorScheme = ({
  isPrimaryVariant,
  shouldOverrideTheme,
  topNavContext,
}: {
  isPrimaryVariant: boolean;
  shouldOverrideTheme: boolean | undefined;
  topNavContext: ReturnType<typeof useTopNavContext>;
}): 'light' | 'dark' => {
  if (isPrimaryVariant) return 'light';
  if (shouldOverrideTheme) return topNavContext?.colorScheme ?? 'light';
  return 'dark';
};

const getIsDark = ({
  isPrimaryVariant,
  shouldOverrideTheme,
  topNavContext,
}: {
  isPrimaryVariant: boolean;
  shouldOverrideTheme: boolean | undefined;
  topNavContext: ReturnType<typeof useTopNavContext>;
}): boolean => {
  if (isPrimaryVariant) return false;
  if (shouldOverrideTheme) return topNavContext?.colorScheme === 'dark';
  return true;
};

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
  const { platform, themeTokens } = useTheme();

  const isPrimaryVariant = topNavContext?.variant === 'primary';
  const isDark = getIsDark({ isPrimaryVariant, shouldOverrideTheme, topNavContext });
  const overrideTheme: Theme = React.useMemo(
    () => ({
      ...themeTokens,
      colors: isDark ? themeTokens.colors.onDark : themeTokens.colors.onLight,
      elevation: isDark ? themeTokens.elevation.onDark : themeTokens.elevation.onLight,
      typography: themeTokens.typography[platform],
    }),
    [isDark, platform, themeTokens],
  );

  if (!topNavContext) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  if (shouldOverrideTheme !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = (): void => {};

    return (
      <ThemeContext.Provider
        value={{
          theme: overrideTheme,
          themeTokens,
          colorScheme: getOverrideColorScheme({
            isPrimaryVariant,
            shouldOverrideTheme,
            topNavContext,
          }),
          setColorScheme: noop,
          platform,
        }}
      >
        <StyledThemeProvider theme={overrideTheme}>{children}</StyledThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <BladeProvider
      themeTokens={themeTokens}
      colorScheme={isPrimaryVariant ? 'light' : topNavContext.colorScheme}
    >
      {children}
    </BladeProvider>
  );
};

export { TopNavOverlayThemeOverride };
