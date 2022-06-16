import border from '../global/border';
import breakpoints from '../global/breakpoints';
import spacing from '../global/spacing';
import globalColors from '../global/colors';
import typography from '../global/typography';
import motion from '../global/motion';
import type { ThemeTokens, ColorsWithModes, Shadows } from './theme.d';

const colors: ColorsWithModes = {
  onLight: {
    surface: { background: { level1: { lowContrast: globalColors.neutral.blueGrayLight[100] } } },
  },
};

const shadows: Shadows = {
  offsetX: {
    level: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  offsetY: {
    level: {
      1: 1,
      2: 3,
      3: 8,
      4: 10,
      5: 18,
    },
  },
  blurRadius: {
    level: {
      1: 2,
      2: 8,
      3: 12,
      4: 18,
      5: 28,
    },
  },
  color: {
    onLight: {
      level: {
        1: globalColors.neutral.blueGrayLight.a100,
        2: globalColors.neutral.blueGrayLight.a100,
        3: globalColors.neutral.blueGrayLight.a100,
        4: globalColors.neutral.blueGrayLight.a100,
        5: globalColors.neutral.blueGrayLight.a100,
      },
    },
    onDark: {
      level: {
        1: globalColors.neutral.blueGrayDark.a100,
        2: globalColors.neutral.blueGrayDark.a100,
        3: globalColors.neutral.blueGrayDark.a100,
        4: globalColors.neutral.blueGrayDark.a100,
        5: globalColors.neutral.blueGrayDark.a100,
      },
    },
  },
  androidElevation: {
    // this is required for android
    level: {
      1: 5,
      2: 5,
      3: 5,
      4: 5,
      5: 5,
    },
  },
  // shadowOpacity: 1, // this is required for iOS
};

const paymentTheme: ThemeTokens = {
  border,
  breakpoints,
  colors,
  motion,
  spacing,
  shadows,
  typography,
};

export default paymentTheme;
