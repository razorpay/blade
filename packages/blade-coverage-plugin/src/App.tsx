/* eslint-disable no-undef */
import { useState } from 'react';
import { BladeProvider, Button, Heading, Box, Text } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';
import { useMediaQuery } from './useMediaQuery';

const App = () => {
  const [coverage, setCoverage] = useState(0);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log('Is dark mode in app', isDarkMode);
  const getBladeCoverage = () => {
    // @ts-ignore
    chrome.runtime.sendMessage({ action: 'executeScript'});
  };
  // @ts-ignore
  chrome.runtime.onMessage.addListener((message: { action: string; coverage: any; }, sender: any, response: any) => {
    console.log('message and sender in popup js', message, sender);
    if(message.action === 'blade-coverage') {
      setCoverage(message.coverage);
    }
  });
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme={isDarkMode ? 'dark' : 'light'}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding="spacing.4"
        minWidth="320px"
        backgroundColor="surface.background.level1.lowContrast"
      >
        <Heading marginBottom="spacing.8">Blade coverage extension</Heading>
        <Button onClick={getBladeCoverage}>Get Coverage</Button>
        {
          coverage ? (
            <Text>Blade coverage for this page is {coverage}</Text>
          ) : null
        }
      </Box>
    </BladeProvider>
  );
}

export default App;
