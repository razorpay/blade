import { Appearance } from 'react-native';
import { ColorSchemeNames, ColorSchemeNamesInput } from '../../tokens/theme';

const getColorScheme = (colorScheme: ColorSchemeNamesInput): ColorSchemeNames => {
  // @TODO: convert this to hook as Appearance API also adds an eventListener which subsribes to the colorscheme changes on the device
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  if (colorScheme === 'system') {
    return Appearance.getColorScheme() ?? 'light';
  }

  return 'light';
};

export default getColorScheme;
