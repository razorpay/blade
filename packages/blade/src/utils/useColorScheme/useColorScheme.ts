import { useState, useCallback } from 'react';
import { ColorSchemeNames, ColorSchemeNamesInput, colorSchemeNamesInput } from '../../tokens/theme';
import getColorScheme from '../getColorScheme';

export type UseColorScheme = {
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
};

const useColorScheme = (initialColorScheme: ColorSchemeNamesInput = 'light'): UseColorScheme => {
  // if colorScheme defined use that else fallback to 'light'
  const [colorSchemeState, setColorSchemeState] = useState<ColorSchemeNames>(() =>
    getColorScheme(initialColorScheme),
  );

  const setColorScheme = useCallback(function setThemeMode(colorScheme: ColorSchemeNamesInput) {
    if (!colorSchemeNamesInput.includes(colorScheme)) {
      throw new Error(
        `[useColorScheme]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${colorScheme}`,
      );
    }
    setColorSchemeState(getColorScheme(colorScheme));
  }, []);

  return {
    colorScheme: colorSchemeState,
    setColorScheme,
  };
};

export default useColorScheme;
