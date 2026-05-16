import { bladeTheme } from '~tokens/theme';

import type { Theme } from '~components/BladeProvider';

const bladeLightTheme: Theme = {
  name: 'bladeTheme',
  colors: bladeTheme.colors.onLight,
  border: bladeTheme.border,
  motion: bladeTheme.motion,
  spacing: bladeTheme.spacing,
  breakpoints: bladeTheme.breakpoints,
  elevation: bladeTheme.elevation.onLight,
  typography: bladeTheme.typography.onMobile,
  backdropBlur: bladeTheme.backdropBlur,
};

export default bladeLightTheme;
