import type { Meta } from '@storybook/react';
import { SandpackCodeEditor, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import type { BoxProps } from './BaseBox/types';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import BaseBox from './BaseBox';
import { Box } from '.';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox, SandboxProvider, SandboxHighlighter } from '~src/_helpers/storybook/Sandbox';
import { List, ListItem, ListItemCode, ListItemLink } from '~components/List';
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
          propsDescription="All Box props support responsive objects. Props marked with 💅🏼 next to their names are the props that can also be used as styled-props on other blade components. Check out styled-props documentation for more details."
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
              <ScrollIntoViewLink href="#api-decisions">API Decisions</ScrollIntoViewLink>
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
              📦 Box Usage
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
            <SandboxHighlighter>
              {`
              <Box>Hello</Box>
              // On Web          -> <div>Hello</div> 
              // On React Native -> <View>Hello</View>
            `}
            </SandboxHighlighter>
          </BaseBox>
          <BaseBox id="adding-margin-and-padding" paddingY="spacing.6">
            <Heading size="large" marginBottom="spacing.3" marginTop="spacing.6">
              ↔️ Adding Margin and Padding
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
             import { Box, Text } from '@razorpay/blade/components';

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
              💅🏼 Styled Props for Blade Components
            </Title>
            <Text>
              Want to add spacing between 2 elements? add layout props directly on the Blade
              components ✨
            </Text>

            <SandboxHighlighter
              decorators={[
                {
                  className: 'highlight',
                  line: 16,
                  startColumn: 12,
                  endColumn: 33,
                },
              ]}
            >
              {`
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
            </SandboxHighlighter>
            <Text marginTop="spacing.3">
              Here&apos;s another example where we position Alert component to the bottom of the
              screen
            </Text>
            <Sandbox>
              {`
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

          <BaseBox id="api-decisions" paddingBottom="spacing.8">
            <Title size="small" marginBottom="spacing.3" marginTop="spacing.6">
              🧐 Questions you might have
            </Title>
            <Text>
              This is a summary and some questions you might have regarding API. You can check out
              complete API decisions at{' '}
              <Link href="https://github.com/razorpay/blade/blob/master/rfcs/2023-01-06-layout.md">
                Layout Primitives and Components RFC
              </Link>
            </Text>
            <BaseBox id="why-is-x-prop-not-support">
              <Heading marginTop="spacing.4" marginBottom="spacing.2" size="large">
                Why is `xyz` prop not supported in Box?
              </Heading>
              <Text marginY="spacing.3">
                To start the <Code>Box</Code> implementation, we primarily focussed on supporting
                props that help you change layouts like - margins, paddings, flex, grids, etc. This
                is roughly the rule of thumb we have followed so far-
              </Text>
              <List>
                <ListItem>
                  Is it layout prop that does not change look and feel?
                  <List>
                    <ListItem>E.g. - flex, grid, margins, etc</ListItem>
                    <ListItem>{'→'} Added to Box 🥳</ListItem>
                  </List>
                </ListItem>

                <ListItem>
                  Is it very commonly used in your codebase and cannot be implemented using
                  alternate components from blade?
                  <List>
                    <ListItem>E.g. - backgroundColor</ListItem>
                    <ListItem>{'→'} Added to Box 🥳</ListItem>
                  </List>
                </ListItem>

                <ListItem>
                  Is there any alternate Blade component that can be used instead?
                  <List>
                    <ListItem>
                      E.g. - We do not support borderRadius, boxShadow because in most cases (with
                      few exceptions) you might be looking for <ListItemCode>Card</ListItemCode>{' '}
                      component instead
                    </ListItem>
                    <ListItem>{'→'} Not Added in Box 😠</ListItem>
                  </List>
                </ListItem>

                <ListItem>
                  Do you find yourself creating wrapper around Box for this prop again and again
                  throughout your codebase?
                  <List>
                    <ListItem>
                      <ListItemLink
                        href="https://github.com/razorpay/blade/issues/new?title=Request+to+add+xyz+prop+to+Box&labels=enhancement"
                        target="_blank"
                      >
                        Create an issue in razorpay/blade repo
                      </ListItemLink>{' '}
                      to let us know
                    </ListItem>
                  </List>
                </ListItem>

                <ListItem>
                  Not convinced with the reasonings we had in Layouts RFC?
                  <List>
                    <ListItem>
                      <ListItemLink
                        href="https://github.com/razorpay/blade/issues/new"
                        target="_blank"
                      >
                        Create an issue in razorpay/blade repo
                      </ListItemLink>{' '}
                      and we can discuss
                    </ListItem>
                  </List>
                </ListItem>
              </List>
              <Text>
                We are open for suggestions on this. You can create an issue on blade repo to
                discuss any of the API decisions. Extra points if you can mention any
                razorpay-specific issues you are facing with Box or styled-props API.
              </Text>
            </BaseBox>

            <BaseBox id="what-to-do-if-prop-is-not-supported">
              <Heading marginTop="spacing.4" marginBottom="spacing.2" size="large">
                What to do if Box doesn&apos;t support the prop you want to use?
              </Heading>
              <Text marginY="spacing.3">
                You can go ahead and create a custom <Code>styled.div</Code> component with your
                prop to unblock yourself. If it is very specific and rare usecase, creating custom
                styled component might just be ideal.
              </Text>
              <Text marginY="spacing.3">
                However, if it is for a prop that you see yourself adding multiple times (Lets say
                30% of times of all Box occurences), then it might be better to create an issue in
                our repo and we can look into adding that prop to Box itself.
              </Text>
            </BaseBox>
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
      <Box
        flex="1"
        backgroundColor="surface.background.level2.highContrast"
        minHeight="spacing.10"
        padding="spacing.2"
      >
        <Text contrast="high">flexDirection property of this layout will change in mobile</Text>
      </Box>
      <Box
        flex="1"
        backgroundColor="surface.background.level3.highContrast"
        minHeight="spacing.10"
      />
    </Box>
  );
};

Responsive.args = {
  display: 'flex',
  padding: 'spacing.10',
  flexDirection: { base: 'column', l: 'row' },
} as BoxProps;

export default BoxStoryMeta;
