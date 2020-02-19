import { fonts } from '../tokens';
import { lightTheme as baseLightTheme, darkTheme as baseDarkTheme } from './theme.web';

// For  styled components in React Native: converts unitless numbers to "px" strings
const getPxValue = (value) => `${value}px`;

const nativeFonts = {
  ...fonts,
  lineHeight: Object.keys(fonts.lineHeight).reduce(
    (acc, value) => ({ ...acc, [value]: getPxValue(fonts.lineHeight[value]) }),
    {},
  ),
  letterSpacing: Object.keys(fonts.letterSpacing).reduce(
    (acc, value) => ({ ...acc, [value]: getPxValue(fonts.letterSpacing[value]) }),
    {},
  ),
};

const lightTheme = {
  ...baseLightTheme,
  fonts: nativeFonts,
};

const darkTheme = {
  ...baseDarkTheme,
  fonts: nativeFonts,
};

export default lightTheme;
export { lightTheme, darkTheme };
