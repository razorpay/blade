import React, { useState } from 'react';
import { BasicForm } from './BasicForm';
import { Checkout } from './Checkout';
import { ThemeSelector } from './ThemeSelector';
import { BrandedComponentKitchenSink } from './BrandedComponentKitchenSink';
import { BladeProvider } from '~components/BladeProvider';
import { bankingTheme, createTheme, paymentTheme } from '~tokens/theme';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

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
      <Box maxWidth="50vw">
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ThemeSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            selectedPreBuiltTheme={selectedPreBuiltTheme}
            setSelectedPreBuiltTheme={setSelectedPreBuiltTheme}
          />
          <Box flex={1}>
            <Heading marginBottom="spacing.2">Checkout UI</Heading>
            <Checkout />
          </Box>
          <Box flex={1}>
            <Heading marginBottom="spacing.2">Form</Heading>
            <BasicForm />
          </Box>
        </Box>
        <Box marginTop="spacing.5">
          <Heading marginBottom="spacing.2">Component Showcase</Heading>
          <BrandedComponentKitchenSink />
        </Box>
      </Box>
    </BladeProvider>
  );
};

export { ThemePlayground };
