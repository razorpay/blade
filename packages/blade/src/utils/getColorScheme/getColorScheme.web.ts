import { ColorScheme } from '../../components/ThemeProvider/ThemeProvider';

const getColorScheme = (colorScheme: ColorScheme): Exclude<ColorScheme, 'system'> => {
  // @TODO: create a useMediaQuery hook with an event listener which will subscribe to changes and move all this logic there
  const colorSchemeMediaQueryMap = {
    light: '(prefers-color-scheme: light)',
    dark: '(prefers-color-scheme: dark)',
    system: 'default',
  };
  const supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  if (
    colorScheme === 'system' &&
    supportsMatchMedia &&
    window.matchMedia(colorSchemeMediaQueryMap.dark).matches
  ) {
    return 'dark';
  }

  return 'light';
};

export default getColorScheme;
