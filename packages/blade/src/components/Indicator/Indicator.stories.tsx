import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { IndicatorProps } from './Indicator';
import { Indicator as IndicatorComponent } from './Indicator';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { getPlatformType } from '~utils';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Indicator"
      componentDescription="Indicators describe the condition of an entity. They can be used to convey semantic meaning,
    such as statuses and semantical-categories."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8224%3A1',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8224%3A0',
      }}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Indicator, Box } from '@razorpay/blade/components';

        function App() {
          return (
            <Box>
              <Indicator accessibilityLabel="Success" intent="positive" />
            </Box>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
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
  argTypes: getStyledPropsArgTypes(),
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
    <BaseBox
      position="relative"
      display={isReactNative ? 'flex' : 'inline-flex'}
      alignSelf="center"
    >
      <IndicatorComponent
        {...args}
        position="absolute"
        top={isReactNative ? '-8px' : '-4px'}
        right="-8px"
        zIndex={10}
      />
      <Button>Get started</Button>
    </BaseBox>
  );
};
Composition.args = {
  children: undefined,
  intent: 'notice',
  accessibilityLabel: 'New offers',
  size: 'large',
};
Composition.parameters = {
  docs: {
    description: {
      story: 'You can compose `Indicator` with other components using absolute positioning',
    },
  },
};

export default meta;
