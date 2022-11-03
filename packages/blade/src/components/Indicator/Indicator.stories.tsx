import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight, Link } from '@storybook/design-system';

import type { IndicatorProps } from './Indicator';
import { Indicator as IndicatorComponent } from './Indicator';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import Box from '~components/Box';
import { Button } from '~components/Button';
import { getPlatformType } from '~utils';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8224%3A1',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8224%3A1',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8224%3A0',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8224%3A0',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Indicators describe the condition of an entity. They can be used to convey semantic meaning,
        such as statuses and semantical-categories.
      </Subtitle>
      <Title>Usage</Title>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <Highlight language="tsx">{`import { Indicator } from '@razorpay/blade/components' \nimport type { IndicatorProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>You can change the properties using the controls in the table below.</Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const meta: Meta<IndicatorProps> = {
  title: 'Components/Indicator',
  component: IndicatorComponent,
  args: {
    accessibilityLabel: 'Status OK',
    children: 'Success',
    intent: 'neutral',
    size: 'medium',
  },
  argTypes: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IndicatorTemplate: ComponentStory<typeof IndicatorComponent> = ({ ...args }) => {
  return <IndicatorComponent {...args} />;
};

export const Default = IndicatorTemplate.bind({});

export const WithoutLabel: ComponentStory<typeof IndicatorComponent> = ({ ...args }) => {
  return <IndicatorComponent {...args} />;
};
WithoutLabel.args = {
  children: undefined,
  accessibilityLabel: 'Success',
};
WithoutLabel.parameters = {
  docs: {
    description: {
      story:
        '`Indicator` can be used without a label by skipping `children`. **Note**: in this case you should always pass `accessibilityLabel` for screen readers a11y',
    },
  },
};

export const Composition: ComponentStory<typeof IndicatorComponent> = ({ ...args }) => {
  const isReactNative = getPlatformType() === 'react-native';
  return (
    <Box position="relative" display={isReactNative ? 'flex' : 'inline-flex'} alignSelf="center">
      <Box position="absolute" top={isReactNative ? -8 : -4} right={-8} zIndex={10}>
        <IndicatorComponent {...args} />
      </Box>
      <Button>Get started</Button>
    </Box>
  );
};
Composition.args = {
  children: undefined,
  intent: 'notice',
  accessibilityLabel: 'New offers',
};
Composition.parameters = {
  docs: {
    description: {
      story: 'You can compose `Indicator` with other components using absolute positioning',
    },
  },
};

export default meta;
