import type { Colors, ThemeTokens } from '~tokens/theme/theme';
import type { Border, Breakpoints, Motion, Spacing, Typography, Elevation } from '~tokens/global';
export { BladeProvider } from './BladeProvider';
export * from './types';
export * from './BladeProvider';
export { default as useTheme } from './useTheme';

export type Theme = {
  name: ThemeTokens['name'];
  border: Border;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  motion: Motion;
  elevation: Elevation;
  typography: Typography;
};
