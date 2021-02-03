import globalColors from '../global/colors';

const neoTheme = {
  colors: {
    black: globalColors.neutral.navyGray[1300],
    primary: globalColors.chromatic.azure[400],
    white: globalColors.neutral.navyGray[0],
    action: {
      background: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[400],
          focused: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
        secondary: {
          default: '',
          hover: globalColors.chromatic.azure.a100,
          focused: globalColors.chromatic.azure.a200,
          disabled: '', // confirm with saurav
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
          hover: globalColors.chromatic.azure[400], // check with saurav
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
          default: globalColors.chromatic.azure[500], // check with saurav it should have neutral scale
          hover: globalColors.chromatic.azure[500], // check with saurav the color looks different but the name is same,
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
      text: {
        1: globalColors.neutral.navyGray[50],
        2: globalColors.neutral.navyGray[100],
        3: globalColors.neutral.navyGray[200],
        4: globalColors.neutral.navyGray[300],
        5: globalColors.neutral.navyGray[400],
      },
    },
    body: {},
  },
  fonts: {},
  spacing: {},
};

export default neoTheme;
