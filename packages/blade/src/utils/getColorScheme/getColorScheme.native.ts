import { Appearance } from 'react-native';
import type { ColorSchemeNames, ColorSchemeNamesInput } from '~tokens/theme';

export const getColorScheme = (colorScheme: ColorSchemeNamesInput = 'light'): ColorSchemeNames => {
  // @TODO: convert this to hook as Appearance API also adds an eventListener which subscribes to the colorscheme changes on the device
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  if (colorScheme === 'system') {
    return Appearance.getColorScheme() ?? 'light';
  }

  return 'light';
};
