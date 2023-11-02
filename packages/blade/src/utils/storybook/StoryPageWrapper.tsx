import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories } from '@storybook/addon-docs';
import styled from 'styled-components';
import useMakeFigmaURL from './useMakeFigmaURL';
import FigmaEmbed from './FigmaEmbed';
import { SandboxHighlighter } from './Sandbox';
import { componentData } from './componentStatusData';
import BaseBox from '~components/Box/BaseBox';
import { Alert } from '~components/Alert';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import type { HeadingProps } from '~components/Typography';
import { Title, Text, Heading } from '~components/Typography';
import { Badge } from '~components/Badge';
import { AnnouncementIcon } from '~components/Icons';
import { SandpackTypescript } from './Sandbox/SandpackTS';
import dedent from 'dedent';

const Subtitle = (props: HeadingProps<{ variant: 'regular' }>): React.ReactElement => {
  return <Heading type="subtle" size="large" weight="regular" as="span" {...props} />;
};

type StoryPageWrapperTypes = {
  figmaURL?: {
    paymentTheme: string;
    bankingTheme: string;
  };
  componentDescription: string;
  propsDescription?: string;
  componentName: string;
  children?: React.ReactNode;
  note?: React.ReactChild;
  showStorybookControls?: boolean;
  showArgsTable?: boolean;
  /**
   * Use this to override default API decision link generated from componentName
   */
  apiDecisionLink?: string | null;
  /**
   * Use this to override default imports
   */
  imports?: string;
};

// Global Styles are not applied by default on `.mdx` pages of storybook. So just overriding few global styles here which are applied to both, stories and guide pages
const WithGlobalStyles = styled(BaseBox)`
  hr {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    clear: both;
    margin-bottom: 1.25rem;
  }

  table.props-table {
    border-collapse: collapse;
  }
  table.props-table tr:nth-of-type(2n) {
    background-color: #f8f8f8;
  }
  table.props-table td {
    vertical-align: top;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: rgb(19, 38, 68);
    margin: 0;
    padding: 6px 13px;
  }
`;

const StoryPageWrapper = (props: StoryPageWrapperTypes): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL: props.figmaURL?.paymentTheme,
      darkModeURL: props.figmaURL?.paymentTheme,
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL: props.figmaURL?.bankingTheme,
      darkModeURL: props.figmaURL?.bankingTheme,
    },
  ]);

  React.useEffect(() => {
    // Storybook renders inside iframe so by default it doesn't support scrolling to the sections.
    // So we manually read location.hash of parent window and scroll to that section on load
    if (window.top?.location.hash) {
      document.querySelector(window.top.location.hash)?.scrollIntoView();
    }
  }, []);

  const componentMetaInfo = componentData.find(
    (componentInfo) => componentInfo.name === props.componentName,
  );

  const { showStorybookControls = true, showArgsTable = true } = props;

  return (
    <BladeProvider themeTokens={paymentTheme}>
      <WithGlobalStyles>
        <Title size="xlarge" marginBottom="spacing.3">
          {props.componentName}
        </Title>
        <Box marginBottom="spacing.4" paddingLeft="spacing.1">
          <Heading type="subtle" size="large" weight="regular" as="span">
            {props.componentDescription}
          </Heading>
        </Box>
        {componentMetaInfo?.releasedIn ? (
          <Box paddingBottom="spacing.6" paddingLeft="spacing.1">
            <a
              href={`https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%40${componentMetaInfo.releasedIn}`}
              target="_blank"
              rel="noreferrer"
            >
              <Badge color="default" fontWeight="bold" size="large" icon={AnnouncementIcon}>
                Release: v{componentMetaInfo.releasedIn}
              </Badge>
            </a>
          </Box>
        ) : null}
        {props.note ? (
          <Alert
            description={props.note}
            isFullWidth
            isDismissible={false}
            intent="notice"
            marginBottom="spacing.5"
          />
        ) : null}
        {figmaURL !== '#' ? (
          <FigmaEmbed src={figmaURL} title={`${props.componentName} Figma Designs`} />
        ) : null}
        {props.children}
        <SandpackTypescript
          template="react-ts"
          customSetup={{
            dependencies: {
              '@chakra-ui/react': 'latest',
              '@emotion/react': 'latest',
              '@emotion/styled': 'latest',
              'framer-motion': 'latest',
            },
            devDependencies: {
              '@types/react': 'latest',
              '@types/react-dom': 'latest',
            },
          }}
          files={{
            '/tsconfig.json': dedent`{
              "include": [
                "./**/*"
              ],
              "compilerOptions": {
                "strict": true,
                "esModuleInterop": true,
                "lib": [ "dom", "es2020" ],
                "jsx": "react-jsx"
              }
            }`,
            '/App.tsx': {
              code: dedent`
              import React from "react"
              import { Flex } from '@chakra-ui/react'

              export default function App(): JSX.Element {
                return (
                  <Flex 
                    w="100vw" 
                    h="100vh" 
                    justifyContent="center" 
                    alignItems
                  >
                    <h2>Hello world!</h2>
                  </Flex>
                )
              }
            `,
            },
          }}
        />
        {props.imports === '' ? null : (
          <>
            <Title size="large">Imports</Title>
            <SandboxHighlighter showLineNumbers={false} showTabs={false}>
              {props.imports
                ? props.imports
                : `import { ${props.componentName} } from '@razorpay/blade/components';\nimport type { ${props.componentName}Props } from '@razorpay/blade/components';`}
            </SandboxHighlighter>
            <br />
            <br />
          </>
        )}
        {showStorybookControls ? (
          <>
            <Title size="large">Example</Title>
            <Subtitle size="medium" marginY="spacing.4">
              {`This is the default ${props.componentName}. You can change the properties using the controls below.`}
            </Subtitle>
            <Primary />
            {showArgsTable ? (
              <>
                <BaseBox id="properties-ref">
                  <Title size="large">Properties</Title>
                  {props.apiDecisionLink === '' || props.apiDecisionLink === null ? null : (
                    <Text marginY="spacing.5">
                      Check out{' '}
                      <Link
                        target="_blank"
                        href={
                          props.apiDecisionLink ??
                          `https://github.com/razorpay/blade/blob/master/packages/blade/src/components/${props.componentName}/_decisions/decisions.md`
                        }
                      >
                        API Decisions for {props.componentName}
                      </Link>
                    </Text>
                  )}
                  {props.propsDescription ? (
                    // adding box with surface background so that when theme of storybook is changed, the alert doesn't become invisible
                    <Box backgroundColor="surface.background.level3.lowContrast">
                      <Alert
                        isFullWidth
                        marginTop="spacing.5"
                        isDismissible={false}
                        description={props.propsDescription}
                      />
                    </Box>
                  ) : null}
                </BaseBox>
                <ArgsTable story={PRIMARY_STORY} />
              </>
            ) : null}

            <Stories />
          </>
        ) : null}
      </WithGlobalStyles>
    </BladeProvider>
  );
};

export default StoryPageWrapper;
