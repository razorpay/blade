import border from '../global/border';
import spacing from '../global/spacing';
import globalColors from '../global/colors';
import typography from '../global/typography';
import type { Theme, Colors, Shadows } from '../theme';

const colors: Colors = {
  brand: {
    primary: {
      300: { onLight: globalColors.chromatic.azure.a50, onDark: globalColors.chromatic.azure.a100 },
      400: {
        onLight: globalColors.chromatic.azure.a100,
        onDark: globalColors.chromatic.azure.a200,
      },
      500: {
        onLight: globalColors.chromatic.azure[500],
        onDark: globalColors.chromatic.azure[400],
      },
      600: {
        onLight: globalColors.chromatic.azure[600],
        onDark: globalColors.chromatic.azure[500],
      },
      700: {
        onLight: globalColors.chromatic.azure[700],
        onDark: globalColors.chromatic.azure[600],
      },
    },
    gray: {
      300: {
        onLight: globalColors.neutral.navyGrayLight[50],
        onDark: globalColors.neutral.navyGrayDark[600],
      },
      400: {
        onLight: globalColors.neutral.navyGrayLight[300],
        onDark: globalColors.neutral.navyGrayDark[400],
      },
      500: {
        onLight: globalColors.neutral.navyGrayLight[500],
        onDark: globalColors.neutral.navyGrayDark[300],
      },
      600: {
        onLight: globalColors.neutral.navyGrayLight[600],
        onDark: globalColors.neutral.navyGrayDark[200],
      },
      700: {
        onLight: globalColors.neutral.navyGrayLight[800],
        onDark: globalColors.neutral.navyGrayDark[50],
      },
    },
    secondary: {
      500: {
        onLight: globalColors.chromatic.cider[600],
        onDark: globalColors.chromatic.cider[600],
      },
    },
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
      1: 2,
      2: 2,
      3: 2,
      4: 2,
      5: 2,
    },
  },
  blurRadius: {
    level: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  color: {
    level: {
      1: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      2: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      3: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      4: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      5: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
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

const bankingTheme: Theme = {
  colors,
  border,
  spacing,
  shadows,
  typography,
};

export default bankingTheme;
