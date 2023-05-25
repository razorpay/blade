import type { Theme } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const paymentLightTheme: Theme = {
  name: 'paymentTheme',
  colors: paymentTheme.colors.onLight,
  border: paymentTheme.border,
  motion: paymentTheme.motion,
  spacing: paymentTheme.spacing,
  breakpoints: paymentTheme.breakpoints,
  elevation: paymentTheme.elevation.onLight,
  typography: paymentTheme.typography.onMobile,
};

export default paymentLightTheme;
