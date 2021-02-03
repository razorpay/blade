import globalColors from '../global/colors';

const lightTheme = {
  colors: {
    black: globalColors.neutral.blueGray[1300],
    primary: globalColors.chromatic.azure[500],
    white: globalColors.neutral.blueGray[0],
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
          hover: globalColors.chromatic.azure.a50,
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
          default: globalColors.neutral.blueGray[0],
          hover: globalColors.neutral.blueGray[0],
          focused: globalColors.neutral.blueGray[0],
          disabled: globalColors.neutral.blueGray[0],
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
      text: {
        1: globalColors.neutral.blueGray[1200],
        2: globalColors.neutral.blueGray[1000],
        3: globalColors.neutral.blueGray[800],
        4: globalColors.neutral.blueGray[600],
        5: globalColors.neutral.blueGray[500],
      },
    },
    body: {},
  },
  fonts: {},
  spacing: {},
};

export default lightTheme;
