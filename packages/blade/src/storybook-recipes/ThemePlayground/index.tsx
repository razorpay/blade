import React, { useState } from 'react';
import { Checkout } from './CheckoutHome';
import { PhantomUI } from './PhantomUI';
import { ThemeSelector } from './ThemeSelector';
import { BrandedComponentKitchenSink } from './BrandedComponentKitchenSink';
import { BladeProvider } from '~components/BladeProvider';
import { bankingTheme, createTheme, paymentTheme } from '~tokens/theme';
import type { ColorSchemeNames, ThemeTokens } from '~tokens/theme';
import { Box } from '~components/Box';
import { Title } from '~components/Typography';
import { Card, CardBody } from '~components/Card';

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
      <Box maxWidth={{ l: '50vw', m: '50vw', s: '100%' }}>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ThemeSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            selectedPreBuiltTheme={selectedPreBuiltTheme}
            setSelectedPreBuiltTheme={setSelectedPreBuiltTheme}
          />
          <Card surfaceLevel={3}>
            <CardBody>
              <Box>
                <Box flex={1}>
                  <Title size="medium" marginBottom="spacing.4">
                    Checkout UI
                  </Title>
                  <Checkout />
                </Box>
                <Box flex={1} marginTop="spacing.8">
                  <Title size="medium" marginBottom="spacing.4">
                    Phantom UI
                  </Title>
                  <PhantomUI />
                </Box>
                <Box marginTop="spacing.8">
                  <Title size="medium" marginBottom="spacing.4">
                    Component Showcase
                  </Title>
                  <BrandedComponentKitchenSink />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </BladeProvider>
  );
};

export { ThemePlayground };
