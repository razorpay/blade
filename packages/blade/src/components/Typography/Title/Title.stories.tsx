import type { ComponentStory, Meta } from '@storybook/react';
import { Title as StorybookTitle } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Text } from '../Text';
import { Code } from '../Code';
import type { TitleProps } from './';
import { Title as TitleComponent } from './';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { List, ListItem } from '~components/List';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Title Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Title as marketing content on landing pages or to capture attention during onboarding."
      componentName="Title"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147139',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10344%3A190050',
      }}
    >
      <StorybookTitle>Usage</StorybookTitle>
      <Sandbox>
        {`
          import { Title } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <Title size="large">Blade by Razorpay</Title>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const TitleStoryMeta: Meta<TitleProps> = {
  title: 'Components/Typography/Title',
  component: TitleComponent,
  args: {
    size: 'xlarge',
    type: 'normal',
    children: 'Power your finance, grow your business',
    contrast: 'low',
    as: undefined,
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
  argTypes: getStyledPropsArgTypes(),
};

const TitleTemplate: ComponentStory<typeof TitleComponent> = (args) => {
  return <TitleComponent {...args}>{args.children}</TitleComponent>;
};

export default TitleStoryMeta;
export const Title = TitleTemplate.bind({});
export const WithColor = TitleTemplate.bind({});
WithColor.args = {
  color: 'feedback.positive.action.text.primary.default.lowContrast',
};

const WithMixedColorsTemplate: ComponentStory<typeof TitleComponent> = () => {
  return (
    <Box>
      <Title>
        Supercharge your business with the all‑powerful{' '}
        <Title as="span" color="badge.text.blue.lowContrast">
          Payment Gateway
        </Title>
      </Title>
      <Title marginTop="spacing.5">
        Start accepting{' '}
        <Title as="span" color="badge.text.blue.lowContrast">
          payments
        </Title>{' '}
        at just 2% <sup>*</sup>
      </Title>
    </Box>
  );
};

export const WithMixedColors = WithMixedColorsTemplate.bind({});

const AsPropTemplate: ComponentStory<typeof TitleComponent> = (args) => {
  return (
    <Box>
      <Text>
        By default{' '}
        <Text as="span" weight="bold">
          Title
        </Text>{' '}
        component automatically renders the respective <Code size="medium">h*</Code> tag based on
        the{' '}
        <Text as="span" weight="bold">
          size prop
        </Text>{' '}
        passed
      </Text>
      <List>
        <ListItem>small: h3</ListItem>
        <ListItem>medium: h2</ListItem>
        <ListItem>large: h1</ListItem>
        <ListItem>xlarge: h1</ListItem>
      </List>
      <Text marginBottom="spacing.5">
        But you can also pass a custom <Code>as</Code> prop to override the rendered HTML:
      </Text>
      <TitleComponent {...args}>Tweak the storybook controls to see the dom change</TitleComponent>
    </Box>
  );
};

export const AsProp = AsPropTemplate.bind({});
AsProp.args = {
  size: 'small',
  as: 'h1',
};
