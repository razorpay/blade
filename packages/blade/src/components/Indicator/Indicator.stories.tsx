import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { IndicatorProps } from './Indicator';
import { Indicator as IndicatorComponent } from './Indicator';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { getPlatformType } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Indicator"
      componentDescription="Indicators describe the condition of an entity. They can be used to convey semantic meaning,
    such as statuses and semantical-categories."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85092&t=jdHbgJTpBgkzHNa7-1&scaling=min-zoom&page-id=8224%3A0&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Indicator, Box } from '@razorpay/blade/components';

        function App() {
          return (
            <Box>
              <Indicator accessibilityLabel="Success" color="positive" />
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
    color: 'neutral',
    size: 'medium',
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IndicatorTemplate: StoryFn<typeof IndicatorComponent> = ({ ...args }) => {
  return <IndicatorComponent {...args} />;
};

export const Default = IndicatorTemplate.bind({});

export const WithoutLabel: StoryFn<typeof IndicatorComponent> = ({ ...args }) => {
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

export const WithIntenseEmphasis: StoryFn<typeof IndicatorComponent> = ({ ...args }) => {
  return <IndicatorComponent {...args} />;
};
WithIntenseEmphasis.args = {
  children: 'Success',
  emphasis: 'intense',
};

export const Composition: StoryFn<typeof IndicatorComponent> = ({ ...args }) => {
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
        right="-4px"
        zIndex={10}
      />
      <Button>Get started</Button>
    </BaseBox>
  );
};
Composition.args = {
  children: undefined,
  color: 'notice',
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
