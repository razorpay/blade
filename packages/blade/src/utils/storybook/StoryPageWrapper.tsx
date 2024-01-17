import React from 'react';
import { ArgsTable, Primary, PRIMARY_STORY, Stories } from '@storybook/addon-docs';
import styled from 'styled-components';
import FigmaEmbed from './FigmaEmbed';
import { SandboxHighlighter } from './Sandbox/SandpackEditor';
import { componentData } from './componentStatusData';
import BaseBox from '~components/Box/BaseBox';
import { Alert } from '~components/Alert';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import type { HeadingProps } from '~components/Typography';
import { Display, Text, Heading } from '~components/Typography';
import { Badge } from '~components/Badge';
import { AnnouncementIcon } from '~components/Icons';

const Subtitle = (props: HeadingProps): React.ReactElement => {
  return (
    <Heading color="surface.text.gray.subtle" size="large" weight="regular" as="span" {...props} />
  );
};

type StoryPageWrapperTypes = {
  figmaURL?: string;
  argTableComponent?: unknown;
  componentDescription: string;
  propsDescription?: string;
  componentName: string;
  children?: React.ReactNode;
  note?: React.ReactChild;
  showStorybookControls?: boolean;
  showDefaultExample?: boolean;
  showArgsTable?: boolean;
  /**
   * Use this to override default API decision link generated from componentName
   */
  apiDecisionLink?: string | null;
  /**
   * Use this to override default imports
   */
  imports?: string;
  /**
   * Use this to override default API decision component name
   */
  apiDecisionComponentName?: string;
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

  const { showStorybookControls = true, showArgsTable = true, showDefaultExample = true } = props;

  return (
    <BladeProvider themeTokens={bladeTheme}>
      <WithGlobalStyles>
        <Display size="small" marginBottom="spacing.3">
          {props.componentName}
        </Display>
        <Box marginBottom="spacing.4" paddingLeft="spacing.1">
          <Subtitle>{props.componentDescription}</Subtitle>
        </Box>
        {componentMetaInfo?.releasedIn ? (
          <Box paddingBottom="spacing.6" paddingLeft="spacing.1">
            <a
              href={`https://github.com/razorpay/blade/releases/tag/%40razorpay%2Fblade%40${componentMetaInfo.releasedIn}`}
              target="_blank"
              rel="noreferrer"
            >
              <Badge color="primary" size="large" icon={AnnouncementIcon}>
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
            color="notice"
            marginBottom="spacing.5"
          />
        ) : null}
        {props.figmaURL && props.figmaURL !== '#' ? (
          <FigmaEmbed src={props.figmaURL} title={`${props.componentName} Figma Designs`} />
        ) : null}
        {props.children}
        {props.imports === '' ? null : (
          <>
            <Heading size="xlarge">Imports</Heading>
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
            {showDefaultExample ? (
              <>
                <Heading size="xlarge">Example</Heading>
                <Subtitle size="medium" marginY="spacing.4">
                  {`This is the default ${props.componentName}. You can change the properties using the controls below.`}
                </Subtitle>
                <Primary />
              </>
            ) : null}
            {showArgsTable ? (
              <>
                <BaseBox id="properties-ref">
                  <Heading size="xlarge">Properties</Heading>
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
                        API Decisions for {props.apiDecisionComponentName ?? props.componentName}
                      </Link>
                    </Text>
                  )}
                  {props.propsDescription ? (
                    // adding box with surface background so that when theme of storybook is changed, the alert doesn't become invisible
                    <Box backgroundColor="surface.background.gray.subtle">
                      <Alert
                        isFullWidth
                        marginTop="spacing.5"
                        isDismissible={false}
                        description={props.propsDescription}
                      />
                    </Box>
                  ) : null}
                </BaseBox>
                <ArgsTable
                  story={props.argTableComponent ? undefined : PRIMARY_STORY}
                  of={props.argTableComponent}
                />
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
