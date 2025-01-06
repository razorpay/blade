import type { StoryFn, Meta } from '@storybook/react';
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
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71123-52743&t=DaKuYvkYnno4qVsq-1&scaling=min-zoom&page-id=3%3A0&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Heading } from '@razorpay/blade/components';

          function App() {
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

const HeadingStoryMeta: Meta<HeadingProps> = {
  title: 'Components/Typography/Heading',
  component: HeadingComponent,
  args: {
    children: 'Get Started With Payment Gateway',
    weight: 'semibold',
    as: undefined,
  },
  tags: ['autodocs'],
  argTypes: getHeadingArgTypes(),
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const HeadingTemplate: StoryFn<typeof HeadingComponent> = (args) => {
  return <HeadingComponent {...args}>{args.children}</HeadingComponent>;
};

export default HeadingStoryMeta;
export const Heading = HeadingTemplate.bind({});
export const WithColor = HeadingTemplate.bind({});
WithColor.args = {
  color: 'surface.text.primary.normal',
};

const Sup = isReactNative() ? HeadingComponent : 'sup';
const WithMixedColorsTemplate: StoryFn<typeof HeadingComponent> = () => {
  return (
    <Box>
      <HeadingComponent>
        Supercharge your business with the all‑powerful{' '}
        <HeadingComponent as="span" color="surface.text.primary.normal">
          Payment Gateway
        </HeadingComponent>
      </HeadingComponent>
      <HeadingComponent marginTop="spacing.5">
        Start accepting{' '}
        <HeadingComponent as="span" color="feedback.text.information.intense">
          payments
        </HeadingComponent>{' '}
        at just 2% <Sup>*</Sup>
      </HeadingComponent>
    </Box>
  );
};

export const WithMixedColors = WithMixedColorsTemplate.bind({});

const AsPropTemplate: StoryFn<typeof HeadingComponent> = (args) => {
  return (
    <Box>
      <Text>
        By default{' '}
        <Text as="span" weight="semibold">
          Heading
        </Text>{' '}
        component automatically renders the respective <Code size="medium">h*</Code> tag based on
        the{' '}
        <Text as="span" weight="semibold">
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
