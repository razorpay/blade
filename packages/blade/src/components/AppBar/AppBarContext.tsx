import React from 'react';
import type { AppBarProps } from './types';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';

type AppBarContextProps = {
  colorScheme: ColorSchemeNames;
  themeTokens: ThemeTokens;
  variant?: AppBarProps['variant'];
};

const AppBarContext = React.createContext<AppBarContextProps | null>(null);

/**
 * Returns the AppBar context if inside an AppBar, otherwise null.
 * Stores the original app colorScheme so that overlay components
 * (Menu, Popover, etc.) rendered inside AppBar can reset back to
 * the app's colorScheme instead of inheriting AppBar's forced theme.
 */
const useAppBarContext = (): AppBarContextProps | null => {
  return React.useContext(AppBarContext);
};

export type { AppBarContextProps };
export { AppBarContext, useAppBarContext };
