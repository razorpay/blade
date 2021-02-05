import globalColors from '../global/colors';

const lightTheme = {
  colors: {
    brand: {
      primary: globalColors.chromatic.azure[500],
      secondary: globalColors.chromatic.azure.a50,
      tertiary: globalColors.chromatic.emerald[500],
    },
    action: {
      background: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[400],
          focused: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
        secondary: {
          default: globalColors.chromatic.azure.a50,
          hover: globalColors.chromatic.azure.a100,
          focused: globalColors.chromatic.azure.a200,
          disabled: globalColors.chromatic.azure.a50,
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[400],
          focused: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
        secondary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focused: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
      },
      text: {
        primary: {
          default: globalColors.neutral.blueGray[0],
          hover: globalColors.neutral.blueGray[0],
          focused: globalColors.neutral.blueGray[0],
          disabled: globalColors.neutral.blueGray[0],
        },
        secondary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focused: globalColors.chromatic.azure[500],
          disabled: globalColors.chromatic.azure.a200,
        },
      },
    },
    feedback: {
      background: {
        positive: {
          highContrast: globalColors.chromatic.emerald[600],
          lowContrast: globalColors.chromatic.emerald.a50,
        },
        negative: {
          highContrast: globalColors.chromatic.crimson[600],
          lowContrast: globalColors.chromatic.crimson.a50,
        },
        notice: {
          highContrast: globalColors.chromatic.cider[600],
          lowContrast: globalColors.chromatic.cider.a50,
        },
        information: {
          highContrast: globalColors.chromatic.sapphire[500],
          lowContrast: globalColors.chromatic.sapphire.a50,
        },
      },
      border: {
        positive: {
          highContrast: globalColors.chromatic.emerald[600],
          lowContrast: globalColors.chromatic.emerald.a200,
        },
        negative: {
          highContrast: globalColors.chromatic.crimson[600],
          lowContrast: globalColors.chromatic.crimson.a200,
        },
        notice: {
          highContrast: globalColors.chromatic.cider[600],
          lowContrast: globalColors.chromatic.cider.a200,
        },
        information: {
          highContrast: globalColors.chromatic.sapphire[500],
          lowContrast: globalColors.chromatic.sapphire.a200,
        },
      },
      text: {
        positive: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.neutral.blueGray[1000],
        },
        negative: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.neutral.blueGray[1000],
        },
        notice: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.neutral.blueGray[1000],
        },
        information: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.neutral.blueGray[1000],
        },
      },
      icon: {
        positive: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.chromatic.emerald[500],
        },
        negative: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.chromatic.crimson[600],
        },
        notice: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.chromatic.cider[600],
        },
        infromation: {
          highContrast: globalColors.neutral.blueGray[0],
          lowContrast: globalColors.chromatic.sapphire[500],
        },
      },
    },
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.blueGray[100],
          highContrast: globalColors.neutral.blueGray[1100],
        },
        level2: {
          lowContrast: globalColors.neutral.blueGray[0],
          highContrast: globalColors.neutral.blueGray[900],
        },
        level3: {
          lowContrast: globalColors.neutral.blueGray[50],
          highContrast: globalColors.neutral.blueGray[1300],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.blueGray[400],
          highContrast: globalColors.neutral.blueGray[400],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGray[800],
          highContrast: globalColors.neutral.blueGray[800],
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.blueGray[1200],
          highContrast: globalColors.neutral.blueGray[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGray[1000],
          highContrast: globalColors.neutral.blueGray[100],
        },
        subdued: {
          lowContrast: globalColors.neutral.blueGray[800],
          highContrast: globalColors.neutral.blueGray[300],
        },
        muted: {
          lowContrast: globalColors.neutral.blueGray[600],
          highContrast: globalColors.neutral.blueGray[400],
        },
        placeholder: {
          lowContrast: globalColors.neutral.blueGray[500],
          highContrast: globalColors.neutral.blueGray[700],
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default lightTheme;
