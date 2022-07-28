import type { Theme } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const paymentLightTheme: Theme = {
  colors: { ...paymentTheme.colors.onLight },
  border: { ...paymentTheme.border },
  motion: { ...paymentTheme.motion },
  spacing: { ...paymentTheme.spacing },
  breakpoints: { ...paymentTheme.breakpoints },
  shadows: {
    ...paymentTheme.shadows,
    color: {
      ...paymentTheme.shadows.color.onLight,
    },
  },
  typography: { ...paymentTheme.typography.onMobile },
};

export default paymentLightTheme;
