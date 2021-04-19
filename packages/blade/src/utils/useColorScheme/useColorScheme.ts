import { useState, useCallback } from 'react';
import { ColorSchemeNames, colorSchemeNames } from '../../tokens/theme';
import getColorScheme from '../getColorScheme';

export type UseColorScheme = {
  colorScheme: Exclude<ColorSchemeNames, 'system'>;
  setColorScheme: (colorScheme: ColorSchemeNames) => void;
};

const useColorScheme = (initialColorScheme: ColorSchemeNames = 'light'): UseColorScheme => {
  // if colorScheme defined use that else fallback to 'light'
  const [colorSchemeState, setColorSchemeState] = useState<Exclude<ColorSchemeNames, 'system'>>(
    () => getColorScheme(initialColorScheme),
  );

  const setColorScheme = useCallback(function setThemeMode(colorScheme: ColorSchemeNames) {
    if (!colorSchemeNames.includes(colorScheme)) {
      throw new Error(
        `[useColorScheme]: Expected color scheme to be one of [${colorSchemeNames.toString()}] but received ${colorScheme}`,
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
