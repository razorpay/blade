/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  ActivityIcon,
  BladeProvider,
  Button,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
} from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import styled from 'styled-components';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';
import BarChartImg from './bar-chart.png';
import { useMediaQuery } from './useMediaQuery';

const StyledImg = styled.img`
  position: absolute;
  left: 12px;
  bottom: 12px;
  opacity: 0.2;
`;

type BladeCoverage = {
  bladeCoverage: number;
  totalNodes: number;
  bladeNodes: number;
};

const App = (): ReactElement => {
  const [coverage, setCoverage] = useState<BladeCoverage | undefined>(undefined);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log('Is dark mode in app', isDarkMode);
  const getBladeCoverage = (): void => {
    // @ts-expect-error
    chrome.runtime.sendMessage({ action: 'executeScript' });
  };
  // @ts-expect-error
  chrome.runtime.onMessage.addListener(
    (message: { action: string; coverage: BladeCoverage }, sender: unknown) => {
      console.log('message and sender in popup js', message, sender);
      if (message.action === 'blade-coverage') {
        setCoverage(message.coverage);
      }
    },
  );
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme={isDarkMode ? 'dark' : 'light'}>
      <Box height="312px" width="500px">
        <Card elevation="lowRaised" padding="spacing.7" surfaceLevel={2}>
          <CardBody>
            <Box
              width="450px"
              height="251px"
              marginBottom="spacing.5"
              backgroundColor="surface.background.level3.lowContrast"
              position="relative"
              alignItems="center"
              justifyContent="center"
              display="flex"
              flexDirection="column"
            >
              {coverage ? (
                <>
                  <Heading marginBottom="spacing.5">
                    Blade Coverage: {coverage.bladeCoverage}%
                  </Heading>
                  <Heading
                    size="small"
                    type="subdued"
                    contrast="low"
                    marginBottom="spacing.5"
                    weight="regular"
                  >
                    Total DOM Nodes: {coverage.totalNodes}
                  </Heading>
                  <Heading size="small" type="subdued" contrast="low" weight="regular">
                    Total Blade Nodes: {coverage.bladeNodes}
                  </Heading>
                </>
              ) : (
                <Text>Open a page which uses Blade then click the calculate Button below</Text>
              )}
              <StyledImg src={BarChartImg} alt="bar-chart" />
            </Box>
            <Box display="flex" justifyContent="center">
              <Button icon={ActivityIcon} iconPosition="left" onClick={getBladeCoverage}>
                Calculate Blade Coverage
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </BladeProvider>
  );
};

export default App;
