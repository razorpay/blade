import React from 'react';
import { useTopNavContext } from './TopNavContext';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

/**
 * Wraps children with BladeProvider reset to the app's original colorScheme
 * when rendered inside TopNav.
 *
 * TopNav forces a dark theme, but overlay components (Popover, Menu, DropdownOverlay)
 * that portal out should render in the app's original colorScheme. This wrapper
 * centralises that logic so individual components don't repeat it.
 *
 * Outside TopNav this is a no-op passthrough.
 */
const TopNavOverlayThemeOverride = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const topNavContext = useTopNavContext();

  if (topNavContext) {
    return (
      <BladeProvider themeTokens={bladeTheme} colorScheme={topNavContext.colorScheme}>
        {children}
      </BladeProvider>
    );
  }

  return <>{children}</>;
};

export { TopNavOverlayThemeOverride };
