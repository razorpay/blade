import { colors, fonts, spacings } from '../tokens';

const lightTheme = {
  fonts,
  spacings,
  colors: {
    background: {
      200: colors.white[900],
      400: colors.grey[300],
      600: colors.grey[400],
      800: colors.grey[500],
    },
    shade: {
      100: colors.slate[100],
      200: colors.slate[200],
      300: colors.slate[300],
      400: colors.slate[400],
      500: colors.slate[500],
      600: colors.slate[600],
      700: colors.slate[700],
      800: colors.slate[800],
      900: colors.slate[900],
    },
    tone: {
      200: colors.cloud[200],
      300: colors.cloud[300],
      400: colors.cloud[400],
      500: colors.cloud[500],
      600: colors.cloud[600],
      900: colors.cloud[900],
    },
    primary: {
      100: colors.sapphire[100],
      200: colors.sapphire[200],
      300: colors.sapphire[300],
      500: colors.sapphire[500],
      600: colors.sapphire[600],
      800: colors.sapphire[800],
      900: colors.sapphire[900],
    },
    secondary: {
      600: colors.purple[600],
      900: colors.purple[900],
    },
    negative: {
      300: colors.red[300],
      600: colors.red[600],
      900: colors.red[900],
    },
    positive: {
      300: colors.emerald[300],
      600: colors.emerald[600],
      900: colors.emerald[900],
    },
    neutral: {
      300: colors.mustard[300],
      600: colors.mustard[600],
      900: colors.mustard[900],
    },
    ...colors,
  },
};

const darkTheme = {
  fonts,
  spacings,
  colors: {
    background: {
      100: colors.darkBlue[200],
      200: colors.darkBlue[400],
      400: colors.darkBlue[500],
      600: colors.darkBlue[600],
      800: colors.darkBlue[700],
    },
    shade: {
      200: colors.cloud[200],
      300: colors.cloud[300],
      400: colors.cloud[400],
      500: colors.cloud[500],
      600: colors.cloud[600],
      700: colors.cloud[700],
      800: colors.cloud[800],
    },
    tone: {
      300: colors.slate[300],
      400: colors.slate[400],
      500: colors.slate[500],
      600: colors.slate[600],
      900: colors.slate[900],
    },
    primary: {
      100: colors.azzure[100],
      200: colors.azzure[200],
      300: colors.azzure[300],
      500: colors.azzure[500],
      600: colors.azzure[600],
      800: colors.azzure[800],
      900: colors.azzure[900],
    },
    secondary: {
      600: colors.lilac[600],
      900: colors.lilac[900],
    },
    negative: {
      300: colors.rose[300],
      600: colors.rose[600],
      900: colors.rose[900],
    },
    positive: {
      300: colors.green[300],
      600: colors.green[600],
      900: colors.green[900],
    },
    neutral: {
      300: colors.honey[300],
      600: colors.honey[600],
      900: colors.honey[900],
    },
    ...colors,
  },
};

export default lightTheme;
export { lightTheme, darkTheme };
