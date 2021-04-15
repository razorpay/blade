import { useState, useCallback } from 'react';
import { ColorScheme } from '../../components/ThemeProvider/ThemeProvider';
import getColorScheme from '../getColorScheme';

export type UseColorScheme = {
  colorScheme: Omit<ColorScheme, 'system'>;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const useColorScheme = (initialColorScheme: ColorScheme = 'light'): UseColorScheme => {
  // if colorscheme defined use that else fallback to 'light'
  const [colorSchemeState, setColorSchemeState] = useState(() =>
    getColorScheme(initialColorScheme),
  );

  const setColorScheme = useCallback(function setThemeMode(colorScheme: ColorScheme) {
    if (!['light', 'dark', 'system'].includes(colorScheme)) {
      throw new Error(
        `[useColorScheme]: Expected color scheme to be one of [light, dark, system] but received ${colorScheme}`,
      );
    }
    setColorSchemeState(colorScheme);
  }, []);

  return {
    colorScheme: colorSchemeState,
    setColorScheme,
  };
};

export default useColorScheme;
