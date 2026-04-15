import React from 'react';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';

type TopNavContextProps = {
  colorScheme: ColorSchemeNames;
  themeTokens: ThemeTokens;
  variant?: 'primary' | 'neutral';
};

const TopNavContext = React.createContext<TopNavContextProps | null>(null);

/**
 * Returns the TopNav context if inside a TopNav, otherwise null.
 * Stores the original app colorScheme so that overlay components
 * (Menu, Popover, etc.) rendered inside TopNav can reset back to
 * the app's colorScheme instead of inheriting TopNav's dark theme.
 */
const useTopNavContext = (): TopNavContextProps | null => {
  return React.useContext(TopNavContext);
};

export type { TopNavContextProps };
export { TopNavContext, useTopNavContext };
