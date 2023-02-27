// @TODO: test story. Remove later
import type { Meta } from '@storybook/react';
import { Highlight } from '@storybook/design-system';
import dedent from 'dedent';
import type { BaseBoxProps } from './BaseBox/types';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import BaseBox from './BaseBox';
import { Box } from '.';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import { List, ListItem, ListItemLink } from '~components/List';
import { Link } from '~components/Link';

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
              <ListItemLink href="#playground">Playground</ListItemLink>
            </ListItem>
            <ListItem>
              <ListItemLink href="#box-usage">Box Usage</ListItemLink>
            </ListItem>
            <ListItem>
              <ListItemLink href="#styled-props">Styled Props</ListItemLink>
            </ListItem>
            <ListItem>
              <ListItemLink href="#properties-ref">Props Reference</ListItemLink>
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
                  <Box flex="1" minHeight="spacing.10" minWidth="spacing.10" />
                  <Box flex="1" minHeight="spacing.10" minWidth="spacing.10" />
                </Box>
              )
            }

            export default App;
            `}
            </Sandbox>
          </BaseBox>
          <BaseBox id="box-usage" padding={['spacing.8', 'spacing.0']}>
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
            <Highlight language="tsx">
              {dedent`
                &lt;Box&gt;Hello&lt;/Box&gt; 
                // On Web          -> &lt;div&gt;Hello&lt;/div&gt; 
                // On React Native -> &lt;View&gt;Hello&lt;/View&gt;
              `}
            </Highlight>
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
                    <Text>Add some margin in Box below</Text>
                    <Box 
                      // Uncomment next lines to see padding and margin in action
                      // padding="spacing.4"
                      // marginTop="32px"
                    >
                      <Text>Some Text</Text>
                    </Box>
                    {/*
                      <Box
                        // Uncomment this block to see padding shorthands in action
                        padding={["spacing.3", "35px"]} // We also support padding and margin shorthands
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
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BaseBoxProps>;

export const Default = (args: BaseBoxProps): JSX.Element => {
  return (
    <Box {...args}>
      <Text>Change controls to see the parameters change for the container</Text>
    </Box>
  );
};

export const Responsive = (args: BaseBoxProps): JSX.Element => {
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
} as BaseBoxProps;

export default BoxStoryMeta;
