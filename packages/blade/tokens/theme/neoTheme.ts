import globalColors from '../global/colors';

const neoTheme = {
  colors: {
    background: {
      lightest: {
        onLightMode: {
          value: globalColors.neutral.navyGray[800],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[800],
        },
      },
      lighter: {
        onLightMode: {
          value: globalColors.neutral.navyGray[1200],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[1200],
        },
      },
      light: {
        onLightMode: {
          value: globalColors.neutral.navyGray[1300],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[1300],
        },
      },
      dark: {
        onLightMode: {
          value: globalColors.neutral.navyGray[700],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[700],
        },
      },
      darkest: {
        onLightMode: {
          value: globalColors.neutral.navyGray[1100],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[1100],
        },
      },
    },
    border: {
      light: {
        onLightMode: {
          value: globalColors.neutral.navyGray[600],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[600],
        },
      },
      dark: {
        onLightMode: {
          value: globalColors.neutral.navyGray[500],
        },
        onDarkMode: {
          value: globalColors.neutral.coolGray[500],
        },
      },
    },
  },
  fonts: {},
  spacing: {},
};

export default neoTheme;
