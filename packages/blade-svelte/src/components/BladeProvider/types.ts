import type { Snippet } from 'svelte';
import type {
  BackdropBlur,
  Border,
  Breakpoints,
  Motion,
  Spacing,
  Typography,
  Elevation,
  TypographyPlatforms,
} from '@razorpay/blade-core/tokens';
import type {
  Colors,
  ThemeTokens,
  ColorSchemeNames,
  ColorSchemeNamesInput,
} from '@razorpay/blade-core/tokens';

/**
 * Resolved (mode + platform flattened) theme used at runtime.
 */
export type Theme = {
  name: ThemeTokens['name'];
  border: Border;
  backdropBlur: BackdropBlur;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  motion: Motion;
  elevation: Elevation;
  typography: Typography;
};

export type BladeProviderProps = {
  /**
   * Theme token bag — pass `bladeTheme` or `createTheme({ brandColor }).theme`.
   */
  themeTokens: ThemeTokens;
  /**
   * Color scheme for this provider scope.
   * @default 'light'
   */
  colorScheme?: ColorSchemeNamesInput;
  children: Snippet;
};

export type BladeThemeContextValue = {
  theme: Theme;
  themeTokens: ThemeTokens;
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
  platform: TypographyPlatforms;
};
