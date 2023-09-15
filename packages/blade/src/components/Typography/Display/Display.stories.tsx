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
import { isReactNative } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Display component adds a strong visual touch. Utilize it to create eye-catching sections on your landing pages."
      componentName="Display"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=13708%3A180902&mode=design&t=1sYKFDyXDXlugu2m-1',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=10344%3A189840&mode=design&t=Np5DsiaBhYmDNpTw-1',
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
    size: 'small',
    type: 'normal',
    children: 'Power your finance, grow your business',
    contrast: 'low',
    as: undefined,
  },
  argTypes: {
    size: {
      options: ['small', 'medium', 'large', 'xlarge'],
      control: {
        type: 'radio',
      },
      table: {
        type: {
          summary: '"small" | "medium" | "large" | "xlarge"',
        },
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
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
const WithMixedColorsTemplate: ComponentStory<typeof DisplayComponent> = (args) => {
  return (
    <Box>
      <DisplayComponent {...args}>
        Supercharge your business with the all‑powerful{' '}
        <DisplayComponent {...args} as="span" color="brand.primary.500">
          Payment Gateway
        </DisplayComponent>
      </DisplayComponent>
      <DisplayComponent marginTop="spacing.5" {...args}>
        Start accepting{' '}
        <DisplayComponent {...args} as="span" color="feedback.text.information.lowContrast">
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
        component automatically renders the <Code size="medium">h1</Code> tag.
      </Text>
      <Text marginBottom="spacing.5">
        But you can also pass a custom <Code>as</Code> prop to override the rendered HTML:
      </Text>
      <DisplayComponent {...args}>
        Tweak the storybook controls to see the DOM change
      </DisplayComponent>
    </Box>
  );
};

export const AsProp = AsPropTemplate.bind({});
AsProp.args = {
  size: 'small',
  as: 'h1',
};
