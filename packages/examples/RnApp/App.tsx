import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BladeProvider, Text, Button, Box, Heading } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100%"
          padding="spacing.8"
          backgroundColor="surface.background.gray.subtle"
        >
          <Heading size="xlarge" marginBottom="spacing.4">
            Hello, Blade!
          </Heading>
          <Text color="surface.text.gray.muted" marginBottom="spacing.6">
            React Native app using @razorpay/blade
          </Text>
          <Button variant="primary" size="large">
            Get Started
          </Button>
        </Box>
      </BladeProvider>
    </SafeAreaProvider>
  );
}

export default App;
