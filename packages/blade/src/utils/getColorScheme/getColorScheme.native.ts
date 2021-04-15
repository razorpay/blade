import { Appearance } from 'react-native';
import { ColorScheme } from '../../components/ThemeProvider/ThemeProvider';

const getColorScheme = (colorScheme: ColorScheme): Omit<ColorScheme, 'system'> => {
  // @TODO: create a useMediaQuery hook with an event listener which will subscribe to changes and move all this logic there
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  if (colorScheme === 'system') {
    return Appearance.getColorScheme() || 'light';
  }

  return 'light';
};

export default getColorScheme;
