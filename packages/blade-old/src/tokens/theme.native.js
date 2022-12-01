import { fonts } from '../tokens';
import { lightTheme as baseLightTheme, darkTheme as baseDarkTheme, THEME_KEY } from './theme.web';

const nativeFonts = {
  ...fonts,
  letterSpacing: Object.keys(fonts.letterSpacing).reduce(
    (acc, value) => ({
      ...acc,
      [value]: `${fonts.letterSpacing[value]}px`,
    }),
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
export { lightTheme, darkTheme, THEME_KEY };
