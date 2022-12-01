import { colors, fonts, spacings } from '../tokens';

/**
 * Styled components merges passed themes when multiple theme providers are nested.
 * Having a theme key ensures the theme tokens aren't replaced unknowingly when used alongside multiple theme providers.
 */
const THEME_KEY = 'bladeOld';

const lightTheme = {
  [THEME_KEY]: {
    fonts,
    spacings,
    colors: {
      ...colors,
      background: {
        100: colors.white[900],
        200: colors.white[900],
        300: colors.white[900],
        400: colors.grey[300],
        600: colors.grey[400],
        800: colors.grey[500],
      },
      shade: {
        500: colors.slate[500],
        600: colors.slate[600],
        700: colors.slate[700],
        800: colors.slate[800],
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
        800: colors.cloud[800],
        900: colors.cloud[900],
        920: colors.cloud[920],
        930: colors.cloud[930],
        940: colors.cloud[940],
        950: colors.cloud[950],
        960: colors.cloud[960],
        980: colors.cloud[980],
      },
      primary: {
        100: colors.sapphire[100],
        200: colors.sapphire[200],
        300: colors.sapphire[300],
        400: colors.sapphire[400],
        500: colors.sapphire[500],
        600: colors.sapphire[600],
        700: colors.sapphire[700],
        800: colors.sapphire[800],
        900: colors.sapphire[900],
        910: colors.sapphire[910],
        920: colors.sapphire[920],
        930: colors.sapphire[930],
        940: colors.sapphire[940],
        950: colors.sapphire[950],
        970: colors.sapphire[970],
      },
      tertiary: {
        900: colors.cyan[900],
        930: colors.cyan[930],
        960: colors.cyan[960],
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
        800: colors.white[800],
        900: colors.white[900],
        920: colors.white[920],
        930: colors.white[930],
        940: colors.white[940],
        950: colors.white[950],
        960: colors.white[960],
        970: colors.white[970],
        980: colors.white[980],
      },
      dark: {
        730: colors.slate[930],
        740: colors.slate[940],
      },
      highlight: {
        700: colors.darkBlue[200],
      },
      overlay: {
        50: colors.slate[920],
        100: colors.slate[950],
        200: colors.slate[960],
      },
    },
  },
};

const darkTheme = {
  [THEME_KEY]: {
    fonts,
    spacings,
    colors: {
      ...colors,
      background: {
        100: colors.xDarkBlue[300],
        200: colors.xDarkBlue[400],
        300: colors.xDarkBlue[600],
        400: colors.xDarkBlue[500],
        600: colors.xDarkBlue[600],
        800: colors.xDarkBlue[800],
      },
      shade: {
        500: colors.xCloud[500],
        600: colors.xCloud[600],
        700: colors.xCloud[700],
        800: colors.xCloud[800],
        900: colors.xCloud[900],
        910: colors.xCloud[910],
        920: colors.xCloud[920],
        930: colors.xCloud[930],
        940: colors.xCloud[940],
        950: colors.xCloud[950],
        960: colors.xCloud[960],
        970: colors.xCloud[970],
        980: colors.xCloud[980],
      },
      tone: {
        800: colors.xSlate[800],
        900: colors.xSlate[900],
        920: colors.xSlate[920],
        930: colors.xSlate[930],
        940: colors.xSlate[940],
        950: colors.xSlate[950],
        960: colors.xSlate[960],
        980: colors.xSlate[980],
      },
      primary: {
        100: colors.xAzzure[100],
        200: colors.xAzzure[200],
        300: colors.xAzzure[300],
        400: colors.xAzzure[400],
        500: colors.xAzzure[500],
        600: colors.xAzzure[600],
        700: colors.xAzzure[700],
        800: colors.xAzzure[800],
        900: colors.xAzzure[900],
        910: colors.xAzzure[910],
        920: colors.xAzzure[920],
        930: colors.xAzzure[930],
        940: colors.xAzzure[940],
        950: colors.xAzzure[950],
        970: colors.xAzzure[970],
      },
      tertiary: {
        900: colors.xCyan[900],
        930: colors.xCyan[930],
        960: colors.xCyan[960],
      },
      negative: {
        900: colors.xRose[900],
        930: colors.xRose[930],
        960: colors.xRose[960],
      },
      positive: {
        900: colors.xGreen[900],
        930: colors.xGreen[930],
        960: colors.xGreen[960],
      },
      neutral: {
        900: colors.xHoney[900],
        930: colors.xHoney[930],
        960: colors.xHoney[960],
      },
      light: {
        800: colors.white[800],
        900: colors.white[900],
        920: colors.white[920],
        930: colors.white[930],
        940: colors.white[940],
        950: colors.white[950],
        960: colors.white[960],
        970: colors.white[970],
        980: colors.white[980],
      },
      dark: {
        730: colors.slate[930],
        740: colors.slate[940],
      },
      highlight: {
        700: colors.xDarkBlue[200],
      },
      overlay: {
        50: colors.xSlate[940],
        100: colors.xSlate[950],
        200: colors.xSlate[960],
      },
    },
  },
};

export default lightTheme;
export { lightTheme, darkTheme, THEME_KEY };
