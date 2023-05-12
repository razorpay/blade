import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories, Subtitle, Title } from '@storybook/addon-docs';
import styled from 'styled-components';
import useMakeFigmaURL from './useMakeFigmaURL';
import FigmaEmbed from './FigmaEmbed';
import { SandboxHighlighter } from './Sandbox';
import BaseBox from '~components/Box/BaseBox';
import { Alert } from '~components/Alert';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';
import { Box } from '~components/Box';

type StoryPageWrapperTypes = {
  figmaURL?: {
    paymentTheme: string;
    bankingTheme: string;
  };
  componentDescription: string;
  propsDescription?: string;
  componentName: string;
  children?: React.ReactNode;
  note?: string;
  showStorybookControls?: boolean;
  showArgsTable?: boolean;
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

  const { showStorybookControls = true } = props;

  return (
    <WithGlobalStyles>
      <Title>{props.componentName}</Title>
      <Subtitle>{props.componentDescription}</Subtitle>
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
          {props.showArgsTable ? (
            <>
              <BaseBox id="properties-ref">
                <Title>Properties</Title>
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
