import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories, Subtitle, Title } from '@storybook/addon-docs';
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
import { Title as BladeTitle, Text, Heading } from '~components/Typography';
import { Badge } from '~components/Badge';
import { AnnouncementIcon } from '~components/Icons';

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
    <WithGlobalStyles>
      <BladeTitle size="xlarge" marginBottom="spacing.3">
        {props.componentName}
      </BladeTitle>
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
      <BladeProvider themeTokens={paymentTheme}>{props.children}</BladeProvider>
      {props.imports === '' ? null : (
        <>
          <Title>Imports</Title>
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
          <Title>Example</Title>
          <Subtitle>
            {`This is the default ${props.componentName}. You can change the properties using the controls below.`}
          </Subtitle>
          <Primary />
          {showArgsTable ? (
            <>
              <BaseBox id="properties-ref">
                <Title>Properties</Title>
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
  );
};

export default StoryPageWrapper;
