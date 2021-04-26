import { Appearance } from 'react-native';
import { ColorSchemeNames } from '../../tokens/theme';

const getColorScheme = (
  colorScheme: ColorSchemeNames = 'light',
): Exclude<ColorSchemeNames, 'system'> => {
  // @TODO: convert this to hook as Appearance API also adds an eventListener which subsribes to the colorscheme changes on the device
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }
  console.log('Appearance.getColorScheme()', Appearance.getColorScheme());
  if (colorScheme === 'system') {
    return Appearance.getColorScheme() || 'light';
  }

  return 'light';
};

export default getColorScheme;
