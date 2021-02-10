import globalColors from '../global/colors';

const neoTheme = {
  colors: {
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
          onLight: globalColors.neutral.navyGrayLight[50],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
        400: {
          onLight: globalColors.neutral.navyGrayLight[300],
          onDark: globalColors.neutral.navyGrayDark[600],
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
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1000],
            onDark: globalColors.neutral.navyGrayDark[50],
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1000],
            onDark: globalColors.neutral.navyGrayDark[50],
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1000],
            onDark: globalColors.neutral.navyGrayDark[50],
          },
        },
        information: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1000],
            onDark: globalColors.neutral.navyGrayDark[50],
          },
        },
      },
      icon: {
        positive: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.chromatic.emerald[500],
            onDark: globalColors.chromatic.emerald[500],
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.chromatic.crimson[600],
            onDark: globalColors.chromatic.crimson[600],
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
          },
          lowContrast: {
            onLight: globalColors.chromatic.cider[600],
            onDark: globalColors.chromatic.cider[600],
          },
        },
        infromation: {
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[0],
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
            onLight: globalColors.neutral.navyGrayLight[100],
            onDark: globalColors.neutral.navyGrayDark[1300],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[1100],
            onDark: globalColors.neutral.navyGrayDark[700],
          },
        },
        level2: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[800],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[900],
            onDark: globalColors.neutral.navyGrayDark[600],
          },
        },
        level3: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[50],
            onDark: globalColors.neutral.navyGrayDark[1200],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[1300],
            onDark: globalColors.neutral.navyGrayDark[1100],
          },
        },
      },
      border: {
        normal: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[400],
            onDark: globalColors.neutral.navyGrayDark[600],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[400],
            onDark: globalColors.neutral.navyGrayDark[600],
          },
        },
        subtle: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[800],
            onDark: globalColors.neutral.navyGrayDark[500],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[800],
            onDark: globalColors.neutral.navyGrayDark[500],
          },
        },
      },
      text: {
        normal: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1200],
            onDark: globalColors.neutral.navyGrayDark[50],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[0],
            onDark: globalColors.neutral.navyGrayDark[1200],
          },
        },
        subtle: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[1000],
            onDark: globalColors.neutral.navyGrayDark[100],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[100],
            onDark: globalColors.neutral.navyGrayDark[1000],
          },
        },
        subdued: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[800],
            onDark: globalColors.neutral.navyGrayDark[200],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[300],
            onDark: globalColors.neutral.navyGrayDark[700],
          },
        },
        muted: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[600],
            onDark: globalColors.neutral.navyGrayDark[300],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[400],
            onDark: globalColors.neutral.navyGrayDark[400],
          },
        },
        placeholder: {
          lowContrast: {
            onLight: globalColors.neutral.navyGrayLight[500],
            onDark: globalColors.neutral.navyGrayDark[400],
          },
          highContrast: {
            onLight: globalColors.neutral.navyGrayLight[700],
            onDark: globalColors.neutral.navyGrayDark[200],
          },
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default neoTheme;
