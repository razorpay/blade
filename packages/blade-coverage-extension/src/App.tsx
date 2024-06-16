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
  Checkbox,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import styled from 'styled-components';
import '@razorpay/blade/fonts.css';
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
  const [shouldHighlightNodes, setShouldHighlightNodes] = useState(false);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const getBladeCoverage = (): void => {
    // @ts-expect-error
    chrome.runtime.sendMessage({ action: 'executeScript', shouldHighlightNodes });
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
    <BladeProvider themeTokens={bladeTheme} colorScheme={isDarkMode ? 'dark' : 'light'}>
      <Box height="312px" width="500px">
        <Card
          elevation="lowRaised"
          padding="spacing.7"
          backgroundColor="surface.background.gray.moderate"
        >
          <CardBody>
            <Box
              width="450px"
              height="251px"
              marginBottom="spacing.5"
              backgroundColor="surface.background.gray.intense"
              position="relative"
              alignItems="center"
              justifyContent="center"
              display="flex"
              flexDirection="column"
              padding="spacing.4"
            >
              {coverage ? (
                <>
                  <Heading marginBottom="spacing.5">
                    Blade Coverage: {coverage.bladeCoverage}%
                  </Heading>
                  <Heading size="small" marginBottom="spacing.5" weight="regular">
                    Total DOM Nodes: {coverage.totalNodes}
                  </Heading>
                  <Heading size="small" weight="regular">
                    Total Blade Nodes: {coverage.bladeNodes}
                  </Heading>
                </>
              ) : (
                <Text>Open a page which uses Blade then click the calculate Button below</Text>
              )}
              <StyledImg src={BarChartImg} alt="bar-chart" />
            </Box>
            <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.3">
              <Button icon={ActivityIcon} iconPosition="left" onClick={getBladeCoverage}>
                Calculate Blade Coverage
              </Button>
              <Checkbox
                onChange={(e) => {
                  setShouldHighlightNodes(e.isChecked);
                }}
              >
                Highlight Non Blade Nodes
              </Checkbox>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </BladeProvider>
  );
};

export default App;
