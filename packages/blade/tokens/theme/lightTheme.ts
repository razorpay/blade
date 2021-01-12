import globalColors from '../global/colors';

const lightTheme = {
  colors: {
    background: {
      lightest: {
        onLightMode: {
          value: globalColors.neutral.blueGray[0],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[0],
        },
      },
      lighter: {
        onLightMode: {
          value: globalColors.neutral.blueGray[50],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[50],
        },
      },
      light: {
        onLightMode: {
          value: globalColors.neutral.blueGray[100],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[100],
        },
      },
      dark: {
        onLightMode: {
          value: globalColors.neutral.blueGray[1100],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[1100],
        },
      },
      darkest: {
        onLightMode: {
          value: globalColors.neutral.blueGray[1300],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[1300],
        },
      },
    },
    border: {
      light: {
        onLightMode: {
          value: globalColors.neutral.blueGray[400],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[400],
        },
      },
      dark: {
        onLightMode: {
          value: globalColors.neutral.blueGray[800],
        },
        onDarkMode: {
          value: globalColors.neutral.warmGray[800],
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default lightTheme;
