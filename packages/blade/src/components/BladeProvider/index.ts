import type { Colors, Shadows, ShadowLevels, ThemeTokens } from '~tokens/theme/theme';
import type { Border } from '~tokens/global/border';
import type { Breakpoints } from '~tokens/global/breakpoints';
import type { Motion } from '~tokens/global/motion';
import type { Spacing } from '~tokens/global/spacing';
import type { Typography } from '~tokens/global/typography';
export { default as BladeProvider } from './BladeProvider';
export * from './BladeProvider';
export { default as useTheme } from './useTheme';

export type Theme = {
  name: ThemeTokens['name'];
  border: Border;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  motion: Motion;
  shadows: Omit<Shadows, 'color'> & {
    color: {
      level: Record<ShadowLevels, string>;
    };
  };
  typography: Typography;
};
