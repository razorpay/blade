import globalColors from '../global/colors';

const neoTheme = {
  colors: {
    brand: {
      primary: globalColors.chromatic.azure[400],
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
          default: globalColors.neutral.navyGray[0],
          hover: globalColors.neutral.navyGray[0],
          focused: globalColors.neutral.navyGray[0],
          disabled: globalColors.neutral.navyGray[0],
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
          highContrast: globalColors.chromatic.emerald[500],
          lowContrast: globalColors.chromatic.emerald.a100,
        },
        negative: {
          highContrast: globalColors.chromatic.crimson[500],
          lowContrast: globalColors.chromatic.crimson.a100,
        },
        notice: {
          highContrast: globalColors.chromatic.cider[500],
          lowContrast: globalColors.chromatic.cider.a100,
        },
        information: {
          highContrast: globalColors.chromatic.sapphire[400],
          lowContrast: globalColors.chromatic.sapphire.a100,
        },
      },
      border: {
        positive: {
          highContrast: globalColors.chromatic.emerald[500],
          lowContrast: globalColors.chromatic.emerald.a200,
        },
        negative: {
          highContrast: globalColors.chromatic.crimson[500],
          lowContrast: globalColors.chromatic.crimson.a200,
        },
        notice: {
          highContrast: globalColors.chromatic.cider[500],
          lowContrast: globalColors.chromatic.cider.a200,
        },
        information: {
          highContrast: globalColors.chromatic.sapphire[400],
          lowContrast: globalColors.chromatic.sapphire.a200,
        },
      },
      text: {
        positive: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.neutral.navyGray[50],
        },
        negative: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.neutral.navyGray[50],
        },
        notice: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.neutral.navyGray[50],
        },
        information: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.neutral.navyGray[50],
        },
      },
      icon: {
        positive: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.chromatic.emerald[500],
        },
        negative: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.chromatic.crimson[600],
        },
        notice: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.chromatic.cider[600],
        },
        infromation: {
          highContrast: globalColors.neutral.navyGray[0],
          lowContrast: globalColors.chromatic.sapphire[500],
        },
      },
    },
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.navyGray[1300],
          highContrast: globalColors.neutral.navyGray[700],
        },
        level2: {
          lowContrast: globalColors.neutral.navyGray[800],
          highContrast: globalColors.neutral.navyGray[600],
        },
        level3: {
          lowContrast: globalColors.neutral.navyGray[1200],
          highContrast: globalColors.neutral.navyGray[1100],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.navyGray[600],
          highContrast: globalColors.neutral.navyGray[600],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGray[500],
          highContrast: globalColors.neutral.navyGray[500],
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.navyGray[50],
          highContrast: globalColors.neutral.navyGray[1200],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGray[100],
          highContrast: globalColors.neutral.navyGray[1000],
        },
        subdued: {
          lowContrast: globalColors.neutral.navyGray[200],
          highContrast: globalColors.neutral.navyGray[700],
        },
        muted: {
          lowContrast: globalColors.neutral.navyGray[300],
          highContrast: globalColors.neutral.navyGray[400],
        },
        placeholder: {
          lowContrast: globalColors.neutral.navyGray[400],
          highContrast: globalColors.neutral.navyGray[200],
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default neoTheme;
