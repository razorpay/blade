import React, { useState } from 'react';
import { Playground } from './Playground';
import { ThemeSelector } from './ThemeSelector';
import { BladeProvider } from '~components/BladeProvider';
import { bankingTheme, createTheme, paymentTheme } from '~tokens/theme';
import type { ColorSchemeNamesInput, ThemeTokens } from '~tokens/theme';
import { Box } from '~components/Box';

const ThemePlayground = (): React.ReactElement => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [colorScheme, setColorScheme] = useState<ColorSchemeNamesInput>('light');
  const getTheme = (): ThemeTokens => {
    if (selectedColor) {
      return createTheme({ brandColor: selectedColor });
    }
    if (colorScheme === 'light') return paymentTheme;
    return bankingTheme;
  };
  return (
    <BladeProvider themeTokens={getTheme()} colorScheme={colorScheme} key={`${colorScheme}`}>
      <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
        <Box flex={1}>
          <ThemeSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
          />
        </Box>
        <Box flex={1}>
          <Playground />
        </Box>
      </Box>
    </BladeProvider>
  );
};

export { ThemePlayground };
