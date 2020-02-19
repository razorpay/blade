import { colors, fonts, spacings } from '../tokens';

const lightTheme = {
  fonts,
  spacings,
  colors: {
    ...colors,
    background: {
      100: colors.white[900],
      200: colors.white[900],
      400: colors.grey[300],
      600: colors.grey[400],
      800: colors.grey[500],
    },
    shade: {
      900: colors.slate[900],
      910: colors.slate[910],
      920: colors.slate[920],
      930: colors.slate[930],
      940: colors.slate[940],
      950: colors.slate[950],
      960: colors.slate[960],
      970: colors.slate[970],
      980: colors.slate[980],
    },
    tone: {
      900: colors.cloud[900],
      920: colors.cloud[920],
      930: colors.cloud[930],
      940: colors.cloud[940],
      950: colors.cloud[950],
      960: colors.cloud[960],
    },
    primary: {
      100: colors.sapphire[100],
      200: colors.sapphire[200],
      300: colors.sapphire[300],
      500: colors.sapphire[500],
      600: colors.sapphire[600],
      700: colors.sapphire[700],
      800: colors.sapphire[800],
      900: colors.sapphire[900],
      920: colors.sapphire[920],
      930: colors.sapphire[930],
      950: colors.sapphire[950],
      970: colors.sapphire[970],
    },
    negative: {
      900: colors.red[900],
      930: colors.red[930],
      960: colors.red[960],
    },
    positive: {
      900: colors.emerald[900],
      930: colors.emerald[930],
      960: colors.emerald[960],
    },
    neutral: {
      900: colors.mustard[900],
      930: colors.mustard[930],
      960: colors.mustard[960],
    },
    light: {
      100: colors.white[900],
      120: colors.white[920],
      130: colors.white[930],
      140: colors.white[940],
      150: colors.white[950],
      160: colors.white[960],
      170: colors.white[970],
      180: colors.white[980],
    },
    dark: {
      730: colors.slate[930],
      740: colors.slate[940],
    },
    highlight: {
      700: colors.darkBlue[200],
    },
  },
};

const darkTheme = {
  fonts,
  spacings,
  colors: {
    ...colors,
    background: {
      200: colors.darkBlue[400],
      400: colors.darkBlue[500],
      600: colors.darkBlue[600],
      800: colors.darkBlue[700],
    },
    shade: {
      900: colors.cloud[900],
      910: colors.cloud[910],
      920: colors.cloud[920],
      930: colors.cloud[930],
      940: colors.cloud[940],
      950: colors.cloud[950],
      960: colors.cloud[960],
      970: colors.cloud[970],
      980: colors.cloud[980],
    },
    tone: {
      900: colors.slate[900],
      920: colors.slate[920],
      930: colors.slate[930],
      940: colors.slate[940],
      950: colors.slate[950],
      960: colors.slate[960],
    },
    primary: {
      100: colors.azzure[100],
      200: colors.azzure[200],
      300: colors.azzure[300],
      500: colors.azzure[500],
      600: colors.azzure[600],
      700: colors.azzure[700],
      800: colors.azzure[800],
      900: colors.azzure[900],
      920: colors.azzure[920],
      930: colors.azzure[930],
      950: colors.azzure[950],
      970: colors.azzure[970],
    },
    negative: {
      900: colors.rose[900],
      930: colors.rose[930],
      960: colors.rose[960],
    },
    positive: {
      900: colors.green[900],
      930: colors.green[930],
      960: colors.green[960],
    },
    neutral: {
      900: colors.honey[900],
      930: colors.honey[930],
      960: colors.honey[960],
    },
    light: {
      100: colors.white[900],
      120: colors.white[920],
      130: colors.white[930],
      140: colors.white[940],
      150: colors.white[950],
      160: colors.white[960],
      170: colors.white[970],
      180: colors.white[980],
    },
    dark: {
      730: colors.slate[930],
      740: colors.slate[940],
    },
    highlight: {
      700: colors.darkBlue[200],
    },
  },
};

export default lightTheme;
export { lightTheme, darkTheme };
