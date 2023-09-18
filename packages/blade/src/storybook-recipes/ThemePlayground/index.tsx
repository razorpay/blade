import React, { useState } from 'react';
import { Playground } from './Playground';
import { ThemeSelector } from './ThemeSelector';
import { BladeProvider } from '~components/BladeProvider';
import { bankingTheme, createTheme, paymentTheme } from '~tokens/theme';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';
import { Box } from '~components/Box';

const ThemePlayground = (): React.ReactElement => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [colorScheme, setColorScheme] = useState<ColorSchemeNames>('light');
  const [selectedPreBuiltTheme, setSelectedPreBuiltTheme] = useState<string | undefined>(
    'paymentTheme',
  );
  const getTheme = (): ThemeTokens => {
    if (selectedColor) {
      return createTheme({ brandColor: selectedColor });
    }
    if (selectedPreBuiltTheme === 'paymentTheme') {
      return paymentTheme;
    }

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
            selectedPreBuiltTheme={selectedPreBuiltTheme}
            setSelectedPreBuiltTheme={setSelectedPreBuiltTheme}
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
