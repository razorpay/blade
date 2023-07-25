import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Text } from '../Text';
import { Code } from '../Code';
import type { HeadingProps } from './';
import { Heading as HeadingComponent } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { List, ListItem } from '~components/List';
import { isReactNative } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Heading Component is usually used for headings of each major section of a page."
      componentName="Heading"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147140',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A189907',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Heading } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <Heading size="large">Blade by Razorpay</Heading>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const getHeadingArgTypes = (): Meta['argTypes'] => {
  return {
    size: {
      description: 'Decides the size of the heading',
    },
    ...getStyledPropsArgTypes(),
  };
};

const HeadingStoryMeta: Meta<HeadingProps<{ variant: 'regular' | 'subheading' }>> = {
  title: 'Components/Typography/Heading',
  component: HeadingComponent,
  args: {
    variant: 'regular',
    type: 'normal',
    children: 'Get Started With Payment Gateway',
    weight: 'bold',
    contrast: 'low',
    as: undefined,
  },
  argTypes: getHeadingArgTypes(),
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const HeadingTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default HeadingStoryMeta;
export const Heading = HeadingTemplate.bind({});
export const WithColor = HeadingTemplate.bind({});
WithColor.args = {
  color: 'feedback.notice.action.text.primary.default.lowContrast',
};

const Sup = isReactNative() ? HeadingComponent : 'sup';
const WithMixedColorsTemplate: ComponentStory<typeof HeadingComponent> = () => {
  return (
    <Box>
      <HeadingComponent>
        Supercharge your business with the all‑powerful{' '}
        <HeadingComponent as="span" color="brand.primary.600">
          Payment Gateway
        </HeadingComponent>
      </HeadingComponent>
      <HeadingComponent marginTop="spacing.5">
        Start accepting{' '}
        <HeadingComponent as="span" color="feedback.text.information.lowContrast">
          payments
        </HeadingComponent>{' '}
        at just 2% <Sup>*</Sup>
      </HeadingComponent>
    </Box>
  );
};

export const WithMixedColors = WithMixedColorsTemplate.bind({});

const AsPropTemplate: ComponentStory<typeof HeadingComponent> = (args) => {
  return (
    <Box>
      <Text>
        By default{' '}
        <Text as="span" weight="bold">
          Heading
        </Text>{' '}
        component automatically renders the respective <Code size="medium">h*</Code> tag based on
        the{' '}
        <Text as="span" weight="bold">
          size prop
        </Text>{' '}
        passed
      </Text>
      <List>
        <ListItem>small: h6</ListItem>
        <ListItem>medium: h5</ListItem>
        <ListItem>large: h4</ListItem>
        <ListItem>subheading variant: p</ListItem>
      </List>
      <Text marginBottom="spacing.5">
        But you can also pass a custom <Code size="medium">as</Code> prop to override the rendered
        HTML:
      </Text>
      <HeadingComponent {...args}>
        Tweak the storybook controls to see the dom change
      </HeadingComponent>
    </Box>
  );
};

export const AsProp = AsPropTemplate.bind({});
AsProp.args = {
  as: 'h1',
};
