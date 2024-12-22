import { SandpackCodeEditor, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import type { BaseBoxProps } from './BaseBox';
import BaseBox from './BaseBox';
import { Box } from '.';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Heading, Text } from '~components/Typography';
import {
  Sandbox,
  SandboxProvider,
  SandboxHighlighter,
} from '~utils/storybook/Sandbox/SandpackEditor';
import { List, ListItem, ListItemCode, ListItemLink } from '~components/List';
import { Link } from '~components/Link';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

if (window.top) {
  document.getElementById(window.top.location.hash)?.scrollIntoView();
}

// Storybook's docs page is under iframe so just href="#target" doesn't work (it tries to scroll on parent of iframe)
// This function uses scrollIntoView instead to scroll then
const _ScrollIntoViewLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}): React.ReactElement => (
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
const ScrollIntoViewLink = assignWithoutSideEffects(_ScrollIntoViewLink, {
  componentId: MetaConstants.ListItemLink,
});

const Section = ({
  ...props
}: Omit<
  BaseBoxProps,
  'onTouchEnd' | 'onTouchStart' | 'onPointerDown' | 'onPointerEnter' | 'pointerEvents'
>): React.ReactElement => {
  return <BaseBox paddingY="spacing.6" {...props} />;
};

function LayoutPrimitivesDocs(): React.ReactElement {
  return (
    <StoryPageWrapper
      componentName="Layout Primitives"
      componentDescription="Layout Primitives from Blade. Use this for adding spacings, grids, and any of your layout needs"
      imports=""
      showStorybookControls={false}
    >
      <hr />
      <Heading size="large">Table of Content</Heading>
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
          <ScrollIntoViewLink href="#styled-props">
            Styled Props for Blade Components
          </ScrollIntoViewLink>
        </ListItem>

        <ListItem>
          <ScrollIntoViewLink href="#questions-you-might-have">
            Questions You Might Have
          </ScrollIntoViewLink>
          <List>
            <ListItem>
              <ScrollIntoViewLink href="#why-is-xyz-prop-not-support">
                Why is xyz prop not supported?
              </ScrollIntoViewLink>
            </ListItem>
            <ListItem>
              <ScrollIntoViewLink href="#what-to-do-if-prop-is-not-supported">
                What to do if prop is not supported?
              </ScrollIntoViewLink>
            </ListItem>
          </List>
        </ListItem>

        <ListItem>
          <ListItemLink href="/?path=/docs/components-layout-primitives-box-box--default&globals=measureEnabled:false#properties-ref">
            Props Reference
          </ListItemLink>
        </ListItem>
      </List>
      <hr />
      <Section id="playground">
        <Heading size="large">Playground</Heading>
        <Sandbox padding="spacing.0">
          {`
            import { Box, Text } from '@razorpay/blade/components'

            function App() {
              return (
                <Box 
                  as="section" // renders as <section> tag instead of <div>
                  display="flex"
                  flexDirection={{ base: 'column', m: 'row' }}
                  padding={{ base: ['spacing.1', '9px'], m: 'spacing.3' }}
                >
                  <Box 
                    backgroundColor="surface.background.cloud.intense" 
                    flex="1" 
                  >
                    <Text margin="spacing.4" color="surface.text.onCloud.onIntense">Box1</Text>
                  </Box>
                  <Box 
                    backgroundColor="surface.background.sea.intense" 
                    flex="1" 
                  >
                    <Text margin="spacing.4" color="surface.text.onSea.onIntense">Box2</Text>
                  </Box>
                </Box>
              )
            }

            export default App;
            `}
        </Sandbox>
        <Text marginTop="spacing.4">
          Check out our{' '}
          <Link href="/?path=/story/recipes-simple-dashboard--simple-dashboard&globals=measureEnabled:false">
            Simple Dashboard Recipe
          </Link>{' '}
          for a real-world example on Box usage.
        </Text>
      </Section>
      <Section id="box-usage">
        <Heading size="large" marginBottom="spacing.3">
          📦 Box Usage
        </Heading>
        <Text>
          Box is a primitive Layout component which can be used for creating different responsive
          layouts in UI. You might have used <Code>Box</Code> in other component libraries as well
          such as{' '}
          <Link target="_blank" href="https://chakra-ui.com/docs/components/box">
            Chakra
          </Link>
          . Our Box is similar, except it&apos;s primarily focused on layout properties and works on
          all platforms.
        </Text>
        <Text marginY="spacing.4">The simplest Box usage would look something like this-</Text>
        <SandboxHighlighter>
          {`
              <Box>Hello</Box>
              // This will translate to:
              // On Web          -> <div>Hello</div> 
              // On React Native -> <View>Hello</View>
            `}
        </SandboxHighlighter>
        <Section id="adding-margin-and-padding">
          <Heading size="large" marginBottom="spacing.3">
            ↔️ Adding Margin and Padding
          </Heading>
          <Text>Uncomment the commented code below to see things in action ✨</Text>
          <Sandbox padding={['spacing.5', 'spacing.0', 'spacing.5']} editorHeight={500}>
            {`
              import { Box, Text } from '@razorpay/blade/components'

              function App() {
                return (
                  <>
                    <Box 
                      // Uncomment next lines to see padding and margin in action
                      // padding="spacing.4"
                      // marginTop="32px"
                      backgroundColor="surface.background.gray.intense"
                    >
                      <Text>Some Text</Text>
                    </Box>
                    {/*
                      <Box
                        // Uncomment this block to see padding shorthands in action
                        padding={["spacing.3", "35px"]} // We also support padding and margin shorthands similar to CSS
                        marginX="spacing.5" // adds horizontal margin
                        backgroundColor='surface.background.gray.moderate'
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
            <Code>paddingBottom</Code>, <Code>paddingLeft</Code> and similar props with{' '}
            <Code>margin</Code>
          </Text>
          <Text>
            These props can have values such as <Code>spacing.3</Code> (Our tokens),{' '}
            <Code>132px</Code> (absolute values), <Code>auto</Code>
          </Text>
        </Section>

        <Section id="responsive-props">
          <Heading size="large" marginBottom="spacing.3">
            Responsive Props 📱 🖥
          </Heading>
          <Text marginBottom="spacing.4">
            Our responsive props allow you do define responsive layouts with ease. Check out how the
            code renders differently on screens when <Code>{`{base: 'column', m: 'row'}`}</Code> is
            used.
          </Text>
          <SandboxProvider
            code={`
             import { Box, Text } from '@razorpay/blade/components';

             function App() {
               return (
                <>
                  <Box display={{ base: 'none', m: 'block' }}><Text>🖥 Desktop View</Text></Box>
                  <Box display={{ base: 'block', m: 'none' }}><Text>📱 Mobile View</Text></Box>
                  <Box 
                    padding="spacing.4"
                    marginTop="32px"
                    display="flex"
                    // Magic line of code 👇🏼
                    flexDirection={{ base: 'column', m: 'row' }}
                  >
                    <Box
                      flex="1"
                      backgroundColor="surface.background.cloud.intense"
                      padding="spacing.4" 
                    >
                      <Text color="surface.text.onCloud.onIntense">Box1</Text>
                    </Box>
                    <Box 
                      flex="1" 
                      backgroundColor="surface.background.sea.intense" 
                      padding="spacing.4" 
                    >
                      <Text color="surface.text.onSea.onIntense">Box2</Text>
                    </Box>
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
              <Box display={castWebType({ base: 'none', m: 'block' })} width="100%">
                <SandpackPreview style={{ width: '100%' }} />
              </Box>
            </SandpackLayout>
          </SandboxProvider>
          <Text marginTop="spacing.4">
            All the props of Box component support responsive objects 🕺🏻. For which breakpoint to
            use, you can check out{' '}
            <Link href="/?path=/docs/tokens-breakpoints">Breakpoints documentation</Link>
          </Text>
        </Section>
      </Section>

      <Section id="styled-props" paddingBottom="spacing.0">
        <Heading size="large" marginBottom="spacing.3">
          💅🏼 Styled Props for Blade Components
        </Heading>
        <Text>
          Want to add spacing between 2 elements? add layout props directly on the Blade components
          ✨
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

                function App() {
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
          Here&apos;s another example where we position Alert component to the bottom of the screen
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
                    bottom="spacing.10"
                    left="spacing.0"
                  />
                )
              }

              export default App;
              `}
        </Sandbox>
      </Section>

      <Section id="questions-you-might-have" paddingTop="spacing.0">
        <Heading size="large" marginBottom="spacing.3" marginTop="spacing.6">
          🧐 Questions you might have
        </Heading>
        <Text>
          This is a summary and some questions you might have regarding API. You can check out
          complete API decisions at{' '}
          <Link href="https://github.com/razorpay/blade/blob/master/rfcs/2023-01-06-layout.md">
            Layout Primitives and Components RFC
          </Link>
        </Text>
        <BaseBox id="why-is-xyz-prop-not-support" paddingY="spacing.4">
          <Heading marginTop="spacing.4" marginBottom="spacing.2" size="large">
            Why is `xyz` prop not supported in Box?
          </Heading>
          <Text marginY="spacing.3">
            To start the <Code>Box</Code> implementation, we primarily focused on supporting props
            that help you change layouts like - margins, paddings, flex, grids, etc. This is roughly
            the rule of thumb we have followed so far-
          </Text>
          <List>
            <ListItem>
              Is it layout prop that does not change look and feel?
              <List>
                <ListItem>E.g. - flex, grid, margins, etc</ListItem>
                <ListItem>{'→'} Available in Box 🥳</ListItem>
              </List>
            </ListItem>

            <ListItem>
              Is it very commonly used in your codebase and cannot be implemented using alternate
              components from blade?
              <List>
                <ListItem>E.g. - backgroundColor</ListItem>
                <ListItem>{'→'} Available in Box 🥳</ListItem>
              </List>
            </ListItem>

            <ListItem>
              Is there any alternate Blade component that can be used instead?
              <List>
                <ListItem>
                  E.g. - We do not support borderRadius, boxShadow because in most cases (with few
                  exceptions) you might be looking for <ListItemCode>Card</ListItemCode> component
                  instead
                </ListItem>
                <ListItem>{'→'} Not Available in Box 😠</ListItem>
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
                  mentioning your use-cases and how frequently is it needed
                </ListItem>
              </List>
            </ListItem>

            <ListItem>
              Not convinced with the reasonings we had in Layouts RFC?
              <List>
                <ListItem>
                  <ListItemLink href="https://github.com/razorpay/blade/issues/new" target="_blank">
                    Create an issue in razorpay/blade repo
                  </ListItemLink>{' '}
                  and we can discuss
                </ListItem>
              </List>
            </ListItem>
          </List>
          <Text>
            We are open for suggestions on this. You can create an issue on blade repo to discuss
            any of the API decisions. Extra points if you can mention any razorpay-specific issues
            you are facing with Box or styled-props API.
          </Text>
        </BaseBox>

        <BaseBox id="what-to-do-if-prop-is-not-supported" paddingTop="spacing.4">
          <Heading marginBottom="spacing.2" size="large">
            What to do if Box doesn&apos;t support the prop you want to use?
          </Heading>
          <Text marginY="spacing.3">
            You can go ahead and create a custom <Code>styled.div</Code> component with your prop to
            unblock yourself. If it is very specific and rare usecase, creating custom styled
            component might just be ideal.
          </Text>
          <Text marginY="spacing.3">
            However, if it is for a prop that you see yourself adding multiple times (Lets say 30%
            of times of all Box occurences), then it might be better to create an issue in our repo
            and we can look into adding that prop to Box itself.
          </Text>
        </BaseBox>

        <BaseBox id="how-is-it-different-from-card" paddingTop="spacing.4">
          <Heading marginBottom="spacing.2" size="large">
            How is it different from Card Component?
          </Heading>
          <Text marginY="spacing.3">
            Layout Primitives are empty components meant for creating responsive layouts and
            don&apos;t follow any visual structure. They also don&apos;t exist on figma.
          </Text>
          <Text marginY="spacing.3">
            Card has a certain visual structure. It follows a standard padding, borderRadius,
            boxShadow, etc. It is meant for creating cards where you want to add shadows, headers,
            footers, etc.
          </Text>
        </BaseBox>
      </Section>
      <Section id="references">
        <Heading size="large">References</Heading>
        <List marginTop="spacing.4">
          <ListItem>
            <ListItemLink href="/?path=/docs/components-layout-primitives-box-box--default&globals=measureEnabled:false">
              Box Story
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/components-layout-primitives-box-box--default&globals=measureEnabled:false#properties-ref">
              Box Properties Reference
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/story/recipes-simple-dashboard--simple-dashboard&globals=measureEnabled:false">
              Simple Dashboard Recipe Using Box
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/components-layout-primitives-box-styled-props--styled-props">
              Styled Props Story
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/components-layout-primitives-box-styled-props--styled-props#properties-ref">
              Styled Props Properties Reference
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/tokens-breakpoints--docs">
              Breakpoint Tokens Reference
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="https://github.com/razorpay/blade/blob/master/rfcs/2023-01-06-layout.md">
              Layout Primitives and Components RFC
            </ListItemLink>
          </ListItem>
        </List>
      </Section>
    </StoryPageWrapper>
  );
}

export { LayoutPrimitivesDocs };
