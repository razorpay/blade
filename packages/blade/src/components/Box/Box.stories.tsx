import type { Meta } from '@storybook/react';
import {
  SandpackCodeEditor,
  SandpackCodeViewer,
  SandpackLayout,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import type { BoxProps } from './BaseBox/types';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import BaseBox from './BaseBox';
import { Box } from '.';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox, SandboxProvider, SandboxViewer } from '~src/_helpers/storybook/Sandbox';
import { List, ListItem, ListItemLink } from '~components/List';
import { Link } from '~components/Link';

// Storybook's docs page is under iframe so just href="#target" doesn't work (it tries to scroll on parent of iframe)
// This function uses scrollIntoView instead to scroll then
const ScrollIntoViewLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}): JSX.Element => (
  <ListItemLink
    variant="button"
    onClick={() => {
      document.querySelector(href)?.scrollIntoView();
    }}
  >
    {children}
  </ListItemLink>
);

// lmao. sorry
ScrollIntoViewLink.componentId = 'ListItemLink';

const BoxStoryMeta = {
  title: 'Components/Box',
  component: Box,
  argTypes: getBoxArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="Layout primitive Box component. Use this for adding spacings, grids, and any of your layout needs"
          componentName="Box"
          imports=""
        >
          <hr />
          <Title size="small">Table of Content</Title>
          <List marginY="spacing.6" marginBottom="spacing.8">
            <ListItem>
              <ScrollIntoViewLink href="#playground">Playground</ScrollIntoViewLink>
            </ListItem>

            <ListItem>
              <ScrollIntoViewLink href="#box-usage">Box Usage</ScrollIntoViewLink>
              <List>
                <ListItem>
                  <ScrollIntoViewLink href="#adding-margin-and-padding">
                    Adding Margin & Padding
                  </ScrollIntoViewLink>
                </ListItem>
                <ListItem>
                  <ScrollIntoViewLink href="#responsive-props">Responsive Props</ScrollIntoViewLink>
                </ListItem>
              </List>
            </ListItem>

            <ListItem>
              <ScrollIntoViewLink href="#styled-props">Styled Props</ScrollIntoViewLink>
            </ListItem>

            <ListItem>
              <ScrollIntoViewLink href="#properties-ref">Props Reference</ScrollIntoViewLink>
            </ListItem>
          </List>
          <hr />
          <BaseBox id="playground">
            <Title size="small">Playground</Title>
            <Sandbox>
              {`
            import { Box } from '@razorpay/blade/components'

            function App(): JSX.Element {
              return (
                <Box 
                  display="flex"
                  flexDirection={{ base: 'column', m: 'row' }}
                  padding={{ base: ['spacing.1', '9px'], m: 'spacing.3' }}
                >
                  <Box 
                    backgroundColor="surface.background.level3.highContrast" 
                    flex="1" 
                    minHeight="spacing.10" 
                    minWidth="spacing.10" 
                  />
                  <Box 
                    backgroundColor="surface.background.level2.highContrast" 
                    flex="1" 
                    minHeight="spacing.10" 
                    minWidth="spacing.10" 
                  />
                </Box>
              )
            }

            export default App;
            `}
            </Sandbox>
          </BaseBox>
          <BaseBox id="box-usage" paddingY="spacing.6">
            <Title size="small" marginBottom="spacing.3">
              Box Usage
            </Title>
            <Text>
              Box is a primitive Layout component which can be used for creating different
              responsive layouts in UI. You might have used <Code>Box</Code> in other component
              libraries as well such as{' '}
              <Link target="_blank" href="https://chakra-ui.com/docs/components/box">
                Chakra
              </Link>
              . Our Box is similar, except it&apos;s primarily focussed towards layout properties
              and works on all platforms.
            </Text>
            <Text marginY="spacing.4">The simplest Box usage would look something like this-</Text>
            <SandboxViewer>
              {`
              <Box>Hello</Box>
              // On Web          -> &lt;div&gt;Hello&lt;/div&gt; 
              // On React Native -> &lt;View&gt;Hello&lt;/View&gt;
            `}
            </SandboxViewer>
          </BaseBox>
          <BaseBox id="adding-margin-and-padding" paddingY="spacing.6">
            <Heading size="large" marginBottom="spacing.3" marginTop="spacing.6">
              Adding Margin and Padding
            </Heading>
            <Text>Uncomment the commented code below to see things in action ✨</Text>
            <Sandbox padding={['spacing.5', 'spacing.0', 'spacing.5']} editorHeight={500}>
              {`
              import { Box, Text } from '@razorpay/blade/components'

              function App(): JSX.Element {
                return (
                  <>
                    <Box 
                      // Uncomment next lines to see padding and margin in action
                      // padding="spacing.4"
                      // marginTop="32px"
                      backgroundColor="surface.background.level2.lowContrast"
                    >
                      <Text>Some Text</Text>
                    </Box>
                    {/*
                      <Box
                        // Uncomment this block to see padding shorthands in action
                        padding={["spacing.3", "35px"]} // We also support padding and margin shorthands similar to CSS
                        marginX="spacing.5" // adds horizontal margin
                      >
                        <Text>More Text</Text>
                      </Box>
                    */}
                  </>
                )
              }
  
              export default App;
              `}
            </Sandbox>
            <Text>
              Blade supports multiple props like <Code>padding</Code>, <Code>paddingX</Code>,{' '}
              <Code>paddingY</Code>, <Code>paddingTop</Code>, <Code>paddingRight</Code>,{' '}
              <Code>paddingBottom</Code>, <Code>paddingLeft</Code> + similar props with{' '}
              <Code>margin</Code>. And these props can have values such as <Code>spacing.3</Code>{' '}
              (Our tokens), <Code>132px</Code> (absolute values), <Code>auto</Code>
            </Text>
          </BaseBox>

          <BaseBox id="responsive-props" padding={['spacing.6', 'spacing.0']}>
            <Heading size="large" marginBottom="spacing.3" marginTop="spacing.6">
              Responsive Props 📱 🖥
            </Heading>
            <Text marginBottom="spacing.4">
              Check out how the code renders differently on screens when{' '}
              <Code>{`{base: 'column', m: 'row'}`}</Code> is used.
            </Text>
            <SandboxProvider
              code={`
             import { Box, Text } from '@razorpay/blade/components'
             function App(): JSX.Element {
               return (
                <>
                  <Box display={{ base: 'none', m: 'block' }}><Text>Desktop View</Text></Box>
                  <Box display={{ base: 'block', m: 'none' }}><Text>Mobile View</Text></Box>
                  <Box 
                    padding="spacing.4"
                    marginTop="32px"
                    display="flex"
                    // Magic line of code 👇🏼
                    flexDirection={{ base: 'column', m: 'row' }}
                  >
                    <Box
                      flex="1"
                      backgroundColor="surface.background.level2.highContrast"
                      minHeight="spacing.10" 
                    />
                    <Box 
                      flex="1" 
                      backgroundColor="surface.background.level3.highContrast" 
                      minHeight="spacing.10" 
                    />
                  </Box>
                </>
               )
             }
 
             export default App;
            `}
            >
              <SandpackLayout>
                <SandpackCodeEditor />
                <SandpackPreview />
                <Box display={{ base: 'none', m: 'block' }} width="100%">
                  <SandpackPreview style={{ width: '100%' }} />
                </Box>
              </SandpackLayout>
            </SandboxProvider>
            <Text marginTop="spacing.4">
              All the props of Box component support responsive objects 🕺🏻. For which breakpoint to
              use, you can check out{' '}
              <Link href="/?path=/docs/tokens-breakpoints">Breakpoints documentation</Link>
            </Text>
          </BaseBox>

          <BaseBox id="styled-props">
            <Title size="small" marginBottom="spacing.3" marginTop="spacing.6">
              Styled Props
            </Title>
            <Text>
              Want to add spacing in-between 2 elements? add layout props directly on the Blade
              elements ✨
            </Text>
            <SandboxProvider
              code={`
              import { Text } from '@razorpay/blade/components'

              function App(): JSX.Element {
                return (
                  <>
                    {/** ❌ No need of Box wrappers */}
                    <Box>
                      <Text>Text Node 1</Text>
                    </Box>
                    <Box marginTop="spacing.4">
                      <Text>Text Node 2</Text>
                    </Box>

                    {/** ✅ Add layout props directly into your favorite components 🥳 */}
                    <Text>Text Node 1</Text>
                    <Text marginTop="spacing.4">Text Node 2</Text>
                  </>
                )
              };

              export default App;
              `}
            >
              <SandpackCodeViewer
                showLineNumbers
                showTabs={false}
                decorators={[
                  {
                    className: 'highlight',
                    line: 16,
                    startColumn: 12,
                    endColumn: 33,
                  },
                ]}
              />
            </SandboxProvider>
            <Text marginTop="spacing.3">
              Here&apos;s another example where we position Alert component to the bottom of the
              screen
            </Text>
            <Sandbox>
              {`
              import { useState } from 'react';
              import { Alert } from '@razorpay/blade/components';

              function App() {
                return (
                  <Alert 
                    description="I am bottom positioned"
                    isFullWidth
                    // styled-props 👇🏼
                    position="fixed"
                    bottom="spacing.0"
                    left="spacing.0"
                  />
                )
              }

              export default App;
              `}
            </Sandbox>
          </BaseBox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BoxProps>;

export const Default = (args: BoxProps): JSX.Element => {
  return (
    <Box {...args}>
      <Text>Change controls to see the parameters change for the container</Text>
    </Box>
  );
};

export const Responsive = (args: BoxProps): JSX.Element => {
  return (
    <Box {...args}>
      <Text>On mobile, The padding should change</Text>
      <Text>And this text should go on next line</Text>
    </Box>
  );
};

Responsive.args = {
  display: 'flex',
  padding: { base: ['spacing.2', 'spacing.3'], l: 'spacing.10' },
  flexDirection: { base: 'column', l: 'row' },
} as BoxProps;

export default BoxStoryMeta;
