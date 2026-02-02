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
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Tooltip,
  InfoIcon,
  TooltipInteractiveWrapper,
  Link,
  Switch,
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

type A11yCoverage = {
  a11yScore: number;
  a11yFocusScore: number;
  a11yStaticScore: number;
};

const App = (): ReactElement => {
  const [coverage, setCoverage] = useState<BladeCoverage | undefined>(undefined);
  const [a11yCoverage, setA11yCoverage] = useState<A11yCoverage | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<string>('blade');
  const [includeNavbars, setIncludeNavbars] = useState<boolean>(true);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const getBladeCoverage = (shouldHighlightNodes: boolean): void => {
    // @ts-expect-error
    chrome?.runtime?.sendMessage?.({
      action: 'executeScript',
      shouldHighlightNodes,
      includeNavbars,
    });
  };

  const getA11yCoverage = (shouldHighlightNodes: boolean): void => {
    // @ts-expect-error
    chrome?.runtime?.sendMessage?.({ action: 'executeAccessibilityScript', shouldHighlightNodes });
  };

  const handleTabChange = (value: string): void => {
    // Clear highlighted nodes from the previous tab
    if (currentTab === 'blade' && coverage) {
      getBladeCoverage(false);
    } else if (currentTab === 'a11y' && a11yCoverage) {
      getA11yCoverage(false);
    }
    setCurrentTab(value);
  };

  // @ts-expect-error
  chrome?.runtime?.onMessage?.addListener(
    (message: { action: string; coverage: BladeCoverage | A11yCoverage }, sender: unknown) => {
      console.log('message and sender in popup js', message, sender);
      if (message.action === 'blade-coverage') {
        setCoverage(message.coverage as BladeCoverage);
      }
      if (message.action === 'accessibility-coverage') {
        setA11yCoverage(message.coverage as A11yCoverage);
      }
    },
  );

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme={isDarkMode ? 'dark' : 'light'}>
      <Box id="blade-coverage-extension" height="312px" width="500px">
        <Card
          elevation="lowRaised"
          padding="spacing.7"
          backgroundColor="surface.background.gray.moderate"
        >
          <CardBody>
            <Tabs defaultValue="blade" onChange={handleTabChange}>
              <TabList>
                <TabItem value="blade">Blade Coverage</TabItem>
                <TabItem value="a11y">Accessibility Score</TabItem>
              </TabList>
              <TabPanel value="blade">
                <Box
                  width="100%"
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
                      <Text size="medium" marginBottom="spacing.5" weight="regular">
                        Total DOM Nodes: {coverage.totalNodes}
                      </Text>
                      <Text size="medium" weight="regular">
                        Total Blade Nodes: {coverage.bladeNodes}
                      </Text>
                    </>
                  ) : (
                    <Text textAlign="center">
                      Open a page which uses Blade then click the calculate Button
                    </Text>
                  )}
                  <StyledImg src={BarChartImg} alt="bar-chart" />
                </Box>
                <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.3">
                  <Text as="label" marginBottom="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Switch
                        accessibilityLabel="Include navbars in coverage calculation"
                        isChecked={includeNavbars}
                        onChange={({ isChecked }) => setIncludeNavbars(isChecked)}
                      />
                      Include Navbars
                    </Box>
                  </Text>
                  <Button
                    icon={ActivityIcon}
                    iconPosition="left"
                    onClick={() => {
                      if (a11yCoverage) {
                        getA11yCoverage(false);
                      }
                      getBladeCoverage(true);
                    }}
                  >
                    Calculate Blade Coverage
                  </Button>
                  <Link
                    variant="button"
                    marginTop="spacing.3"
                    onClick={() => {
                      if (coverage) {
                        getBladeCoverage(false);
                      }
                    }}
                  >
                    Clear Highlighted Nodes
                  </Link>
                </Box>
              </TabPanel>
              <TabPanel value="a11y">
                <Box
                  width="100%"
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
                  {a11yCoverage ? (
                    <>
                      <Heading marginBottom="spacing.5">
                        Accessibility Score: {a11yCoverage.a11yScore}%
                      </Heading>
                      <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="spacing.5"
                        gap="spacing.2"
                      >
                        <Text size="medium" weight="regular">
                          Focus Coverage Score: {a11yCoverage.a11yFocusScore}%
                        </Text>
                        <Tooltip content="How many of the elements should be focusable vs are focusable">
                          <TooltipInteractiveWrapper>
                            <InfoIcon color="surface.icon.gray.muted" size="medium" />
                          </TooltipInteractiveWrapper>
                        </Tooltip>
                      </Box>
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <Text size="medium" weight="regular">
                          Static Coverage Score: {a11yCoverage.a11yStaticScore}%
                        </Text>
                        <Tooltip content="How many elements fail static accessibility checks such as Image with alt, Button with no text, etc.">
                          <TooltipInteractiveWrapper>
                            <InfoIcon color="surface.icon.gray.muted" size="medium" />
                          </TooltipInteractiveWrapper>
                        </Tooltip>
                      </Box>
                      <Box marginTop="spacing.5" textAlign="center">
                        <Text>Check browser console to see the accessibility violations</Text>
                      </Box>
                    </>
                  ) : (
                    <Text>Click the button below to check accessibility</Text>
                  )}
                  <StyledImg src={BarChartImg} alt="bar-chart" />
                </Box>
                <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.3">
                  <Button
                    icon={ActivityIcon}
                    iconPosition="left"
                    onClick={() => {
                      if (coverage) {
                        getBladeCoverage(false);
                      }
                      getA11yCoverage(true);
                    }}
                  >
                    Check Accessibility
                  </Button>
                  <Link
                    variant="button"
                    marginTop="spacing.3"
                    onClick={() => {
                      if (a11yCoverage) {
                        getA11yCoverage(false);
                      }
                    }}
                  >
                    Clear Highlighted Nodes
                  </Link>
                </Box>
              </TabPanel>
            </Tabs>
          </CardBody>
        </Card>
      </Box>
    </BladeProvider>
  );
};

export default App;
