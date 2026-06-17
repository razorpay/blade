import React, { useState } from 'react';
import {
  BladeProvider,
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme={colorScheme}>
      <Box
        minHeight="100vh"
        backgroundColor="surface.background.gray.subtle"
        padding="spacing.8"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Header */}
        <Box
          width="100%"
          maxWidth="600px"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="spacing.8"
        >
          <Heading size="xlarge">Blade × RN Web</Heading>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
          >
            {colorScheme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Button>
        </Box>

        {/* Cards */}
        <Box width="100%" maxWidth="600px" display="flex" flexDirection="column" gap="spacing.5">
          <Card>
            <CardBody>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="spacing.3"
                marginBottom="spacing.4"
              >
                <Heading size="medium">Counter</Heading>
                <Badge color="primary">{String(count)}</Badge>
              </Box>
              <Text color="surface.text.gray.muted" marginBottom="spacing.5">
                A simple counter to verify Blade components render correctly in the browser via
                react-native-web.
              </Text>
              <Box display="flex" flexDirection="row" gap="spacing.3">
                <Button variant="secondary" onClick={() => setCount((c) => c - 1)}>
                  Decrement
                </Button>
                <Button variant="primary" onClick={() => setCount((c) => c + 1)}>
                  Increment
                </Button>
                <Button variant="tertiary" onClick={() => setCount(0)}>
                  Reset
                </Button>
              </Box>
            </CardBody>
          </Card>

          {/* TextInput temporarily removed - AnimatedBaseInputWrapper style issue */}
        </Box>
      </Box>
    </BladeProvider>
  );
}

export default App;
