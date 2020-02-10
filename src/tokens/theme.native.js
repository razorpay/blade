import { fonts, colors } from '../tokens';
import { lightTheme as baseLightTheme, darkTheme as baseDarkTheme } from './theme.web';

// For  styled components in React Native: converts unitless numbers to "px" strings
const getPxValue = (value) => `${value}px`;

const convertToPx = (property) =>
  Object.keys(property).reduce((acc, val) => ({ ...acc, [val]: getPxValue(property[val]) }), {});

const nativeFonts = {
  ...fonts,
  lineHeight: convertToPx(fonts.lineHeight),
  letterSpacing: convertToPx(fonts.letterSpacing),
};

const lightTheme = {
  ...baseLightTheme,
  fonts: nativeFonts,
};

const darkTheme = {
  ...baseDarkTheme,
  fonts: nativeFonts,
};

const theme = { ...lightTheme, ...colors };

export default theme;
export { lightTheme, darkTheme };
