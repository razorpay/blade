import type { ComponentStory, Meta } from '@storybook/react';
import { Title as StorybookTitle } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Text } from '../Text';
import { Code } from '../Code';
import type { DisplayProps } from './';
import { Display as DisplayComponent } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { List, ListItem } from '~components/List';
import { isReactNative } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      // TODO Update this description
      componentDescription="The Display Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Display as marketing content on landing pages or to capture attention during onboarding."
      componentName="Display"
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
          import { Display } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <Display size="large">Blade by Razorpay</Display>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const DisplayStoryMeta: Meta<DisplayProps> = {
  title: 'Components/Typography/Display',
  component: DisplayComponent,
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

const DisplayTemplate: ComponentStory<typeof DisplayComponent> = (args) => {
  return <DisplayComponent {...args}>{args.children}</DisplayComponent>;
};

export default DisplayStoryMeta;
export const Display = DisplayTemplate.bind({});
export const WithColor = DisplayTemplate.bind({});
WithColor.args = {
  color: 'brand.primary.500',
};

const Sup = isReactNative() ? DisplayComponent : 'sup';
const WithMixedColorsTemplate: ComponentStory<typeof DisplayComponent> = () => {
  return (
    <Box>
      <DisplayComponent>
        Supercharge your business with the all‑powerful{' '}
        <DisplayComponent as="span" color="brand.primary.500">
          Payment Gateway
        </DisplayComponent>
      </DisplayComponent>
      <DisplayComponent marginTop="spacing.5">
        Start accepting{' '}
        <DisplayComponent as="span" color="feedback.text.information.lowContrast">
          payments
        </DisplayComponent>{' '}
        at just 2% <Sup>*</Sup>
      </DisplayComponent>
    </Box>
  );
};

export const WithMixedColors = WithMixedColorsTemplate.bind({});

const AsPropTemplate: ComponentStory<typeof DisplayComponent> = (args) => {
  return (
    <Box>
      <Text>
        By default{' '}
        <Text as="span" weight="bold">
          Display
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
      <DisplayComponent {...args}>
        Tweak the storybook controls to see the dom change
      </DisplayComponent>
    </Box>
  );
};

export const AsProp = AsPropTemplate.bind({});
AsProp.args = {
  size: 'small',
  as: 'h1',
};
