import globalColors from '../global/colors';

const lightTheme = {
  colors: {
    brand: {
      primary: {
        300: {
          onLight: globalColors.chromatic.azure.a50,
          onDark: '',
        },
        400: {
          onLight: globalColors.chromatic.azure.a100,
          onDark: '',
        },
        500: {
          onLight: globalColors.chromatic.azure[500],
          onDark: '',
        },
        600: {
          onLight: globalColors.chromatic.azure[600],
          onDark: '',
        },
        700: {
          onLight: globalColors.chromatic.azure[700],
          onDark: '',
        },
      },
      secondary: {
        500: {
          onLight: globalColors.chromatic.emerald[500],
          onDark: '',
        },
      },
      gray: {
        300: {
          onLight: globalColors.neutral.blueGray[50],
          onDark: '',
        },
        400: {
          onLight: globalColors.neutral.blueGray[300],
          onDark: '',
        },
        500: {
          onLight: globalColors.neutral.blueGray[500],
          onDark: '',
        },
        600: {
          onLight: globalColors.neutral.blueGray[600],
          onDark: '',
        },
        700: {
          onLight: globalColors.neutral.blueGray[800],
          onDark: '',
        },
      },
    },
    feedback: {
      background: {
        positive: {
          highContrast: {
            onLight: globalColors.chromatic.emerald[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.emerald.a50,
            onDark: '',
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.chromatic.crimson[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.crimson.a50,
            onDark: '',
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.chromatic.cider[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.cider.a50,
            onDark: '',
          },
        },
        information: {
          highContrast: {
            onLight: globalColors.chromatic.sapphire[500],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.sapphire.a50,
            onDark: '',
          },
        },
      },
      border: {
        positive: {
          highContrast: {
            onLight: globalColors.chromatic.emerald[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.emerald.a200,
            onDark: '',
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.chromatic.crimson[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.crimson.a200,
            onDark: '',
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.chromatic.cider[600],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.cider.a200,
            onDark: '',
          },
        },
        information: {
          highContrast: {
            onLight: globalColors.chromatic.sapphire[500],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.sapphire.a200,
            onDark: '',
          },
        },
      },
      text: {
        positive: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1000],
            onDark: '',
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1000],
            onDark: '',
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1000],
            onDark: '',
          },
        },
        information: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1000],
            onDark: '',
          },
        },
      },
      icon: {
        positive: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.emerald[500],
            onDark: '',
          },
        },
        negative: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.crimson[600],
            onDark: '',
          },
        },
        notice: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.cider[600],
            onDark: '',
          },
        },
        infromation: {
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          lowContrast: {
            onLight: globalColors.chromatic.sapphire[500],
            onDark: '',
          },
        },
      },
    },
    surface: {
      background: {
        level1: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[100],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[1100],
            onDark: '',
          },
        },
        level2: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[900],
            onDark: '',
          },
        },
        level3: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[50],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[1300],
            onDark: '',
          },
        },
      },
      border: {
        normal: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[400],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[400],
            onDark: '',
          },
        },
        subtle: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[800],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[800],
            onDark: '',
          },
        },
      },
      text: {
        normal: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1200],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[0],
            onDark: '',
          },
        },
        subtle: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[1000],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[100],
            onDark: '',
          },
        },
        subdued: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[800],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[300],
            onDark: '',
          },
        },
        muted: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[600],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[400],
            onDark: '',
          },
        },
        placeholder: {
          lowContrast: {
            onLight: globalColors.neutral.blueGray[500],
            onDark: '',
          },
          highContrast: {
            onLight: globalColors.neutral.blueGray[700],
            onDark: '',
          },
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default lightTheme;
