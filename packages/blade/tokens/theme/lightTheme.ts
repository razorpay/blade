import border from '../global/border';
import spacing from '../global/spacing';
import globalColors from '../global/colors';

const colors = {
  brand: {
    primary: {
      300: {
        onLight: globalColors.chromatic.azure.a50,
        onDark: globalColors.chromatic.azure.a100,
      },
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
    secondary: {
      500: {
        onLight: globalColors.chromatic.emerald[500],
        onDark: globalColors.chromatic.emerald[500],
      },
    },
    gray: {
      300: {
        onLight: globalColors.neutral.blueGrayLight[50],
        onDark: globalColors.neutral.blueGrayDark[600],
      },
      400: {
        onLight: globalColors.neutral.blueGrayLight[300],
        onDark: globalColors.neutral.blueGrayDark[600],
      },
      500: {
        onLight: globalColors.neutral.blueGrayLight[500],
        onDark: globalColors.neutral.blueGrayDark[300],
      },
      600: {
        onLight: globalColors.neutral.blueGrayLight[600],
        onDark: globalColors.neutral.blueGrayDark[200],
      },
      700: {
        onLight: globalColors.neutral.blueGrayLight[800],
        onDark: globalColors.neutral.blueGrayDark[50],
      },
    },
  },
  feedback: {
    background: {
      positive: {
        highContrast: {
          onLight: globalColors.chromatic.emerald[600],
          onDark: globalColors.chromatic.emerald[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.emerald.a50,
          onDark: globalColors.chromatic.emerald.a100,
        },
      },
      negative: {
        highContrast: {
          onLight: globalColors.chromatic.crimson[600],
          onDark: globalColors.chromatic.crimson[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.crimson.a50,
          onDark: globalColors.chromatic.crimson.a100,
        },
      },
      notice: {
        highContrast: {
          onLight: globalColors.chromatic.cider[600],
          onDark: globalColors.chromatic.cider[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.cider.a50,
          onDark: globalColors.chromatic.cider.a100,
        },
      },
      information: {
        highContrast: {
          onLight: globalColors.chromatic.sapphire[500],
          onDark: globalColors.chromatic.sapphire[400],
        },
        lowContrast: {
          onLight: globalColors.chromatic.sapphire.a50,
          onDark: globalColors.chromatic.sapphire.a100,
        },
      },
    },
    border: {
      positive: {
        highContrast: {
          onLight: globalColors.chromatic.emerald[600],
          onDark: globalColors.chromatic.emerald[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.emerald.a200,
          onDark: globalColors.chromatic.emerald.a200,
        },
      },
      negative: {
        highContrast: {
          onLight: globalColors.chromatic.crimson[600],
          onDark: globalColors.chromatic.crimson[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.crimson.a200,
          onDark: globalColors.chromatic.crimson.a200,
        },
      },
      notice: {
        highContrast: {
          onLight: globalColors.chromatic.cider[600],
          onDark: globalColors.chromatic.cider[500],
        },
        lowContrast: {
          onLight: globalColors.chromatic.cider.a200,
          onDark: globalColors.chromatic.cider.a200,
        },
      },
      information: {
        highContrast: {
          onLight: globalColors.chromatic.sapphire[500],
          onDark: globalColors.chromatic.sapphire[400],
        },
        lowContrast: {
          onLight: globalColors.chromatic.sapphire.a200,
          onDark: globalColors.chromatic.sapphire.a200,
        },
      },
    },
    text: {
      positive: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1000],
          onDark: globalColors.neutral.blueGrayDark[50],
        },
      },
      negative: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1000],
          onDark: globalColors.neutral.blueGrayDark[50],
        },
      },
      notice: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1000],
          onDark: globalColors.neutral.blueGrayDark[50],
        },
      },
      information: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1000],
          onDark: globalColors.neutral.blueGrayDark[50],
        },
      },
    },
    icon: {
      positive: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.chromatic.emerald[500],
          onDark: globalColors.chromatic.emerald[500],
        },
      },
      negative: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.chromatic.crimson[600],
          onDark: globalColors.chromatic.crimson[600],
        },
      },
      notice: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.chromatic.cider[600],
          onDark: globalColors.chromatic.cider[600],
        },
      },
      infromation: {
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[0],
        },
        lowContrast: {
          onLight: globalColors.chromatic.sapphire[500],
          onDark: globalColors.chromatic.sapphire[500],
        },
      },
    },
  },
  surface: {
    background: {
      level1: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[100],
          onDark: globalColors.neutral.blueGrayDark[1300],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[1100],
          onDark: globalColors.neutral.blueGrayDark[700],
        },
      },
      level2: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[800],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[900],
          onDark: globalColors.neutral.blueGrayDark[600],
        },
      },
      level3: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[50],
          onDark: globalColors.neutral.blueGrayDark[1200],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[1300],
          onDark: globalColors.neutral.blueGrayDark[1100],
        },
      },
    },
    border: {
      normal: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[400],
          onDark: globalColors.neutral.blueGrayDark[600],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[400],
          onDark: globalColors.neutral.blueGrayDark[600],
        },
      },
      subtle: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[800],
          onDark: globalColors.neutral.blueGrayDark[500],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[800],
          onDark: globalColors.neutral.blueGrayDark[500],
        },
      },
    },
    text: {
      normal: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1200],
          onDark: globalColors.neutral.blueGrayDark[50],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[0],
          onDark: globalColors.neutral.blueGrayDark[1200],
        },
      },
      subtle: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[1000],
          onDark: globalColors.neutral.blueGrayDark[100],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[100],
          onDark: globalColors.neutral.blueGrayDark[1000],
        },
      },
      subdued: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[800],
          onDark: globalColors.neutral.blueGrayDark[200],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[300],
          onDark: globalColors.neutral.blueGrayDark[700],
        },
      },
      muted: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[600],
          onDark: globalColors.neutral.blueGrayDark[300],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[400],
          onDark: globalColors.neutral.blueGrayDark[400],
        },
      },
      placeholder: {
        lowContrast: {
          onLight: globalColors.neutral.blueGrayLight[500],
          onDark: globalColors.neutral.blueGrayDark[400],
        },
        highContrast: {
          onLight: globalColors.neutral.blueGrayLight[700],
          onDark: globalColors.neutral.blueGrayDark[200],
        },
      },
    },
  },
};

const shadows = {
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

const lightTheme = {
  colors,
  border,
  spacing,
  shadows,
};

export default lightTheme;
