import { Easing } from 'react-native-reanimated';
import { bladeTheme } from '~tokens/theme';
import type { Theme } from '~components/BladeProvider';

const bladeLightTheme: Theme = {
  name: 'bladeTheme',
  colors: bladeTheme.colors.onLight,
  border: bladeTheme.border,
  spacing: bladeTheme.spacing,
  breakpoints: bladeTheme.breakpoints,
  elevation: bladeTheme.elevation.onLight,
  typography: bladeTheme.typography.onMobile,
  motion: {
    ...bladeTheme.motion,
    easing: {
      linear: Easing.bezier(0, 0, 0, 0),
      entrance: Easing.bezier(0, 0, 0.2, 1),
      exit: Easing.bezier(0.17, 0, 1, 1),
      standard: Easing.bezier(0.3, 0, 0.2, 1),
      emphasized: Easing.bezier(0.5, 0, 0, 1),
      overshoot: Easing.bezier(0.5, 0, 0.3, 1.5),
      shake: Easing.bezier(1, 0.5, 0, 0.5),
    },
  },
};

export default bladeLightTheme;
