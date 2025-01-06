import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { CounterProps } from './Counter';
import { Counter as CounterComponent } from './Counter';
import BaseBox from '~components/Box/BaseBox';
import { Text as BladeText } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Counter"
      componentDescription="Counters are visual indicators that contains numerical values, tallies or counts in regards to some context. It can be used to show non-interactive numerical data."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74858-52172&t=LY9ssuVTANWMEksF-1&scaling=min-zoom&page-id=8222%3A70410&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Counter } from '@razorpay/blade/components';

          function App() {
            return (
              // Change values to anything less than 99 to see change
              <Counter max={99} value={140} />
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Counter',
  component: CounterComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CounterProps>;

const CounterTemplate: StoryFn<typeof CounterComponent> = ({ ...args }) => {
  return <CounterComponent {...args} />;
};

export const Counter = CounterTemplate.bind({});
Counter.args = {
  value: 20,
  color: 'neutral',
  emphasis: 'subtle',
};
Counter.storyName = 'Default';

export const Max = CounterTemplate.bind({});
Max.args = {
  value: 120,
  max: 99,
  color: 'neutral',
  emphasis: 'intense',
};
Max.storyName = 'Max';

const CountersWithColorTemplate: StoryFn<typeof CounterComponent> = ({ ...args }) => {
  const colors = ['positive', 'negative', 'notice', 'information', 'neutral', 'primary'] as const;

  return (
    <BaseBox display="flex" flexDirection="column">
      <BladeText>Subtle Emphasis</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {colors.map((color) => (
          <CounterComponent
            {...args}
            key={color}
            marginRight="spacing.3"
            marginTop="spacing.2"
            color={color}
            emphasis="subtle"
          />
        ))}
      </BaseBox>
      <BladeText>Intense Emphasis</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {colors.map((color) => (
          <CounterComponent
            {...args}
            key={color}
            marginRight="spacing.3"
            marginTop="spacing.2"
            color={color}
            emphasis="intense"
          />
        ))}
      </BaseBox>
    </BaseBox>
  );
};

export const CounterSmallSize = CountersWithColorTemplate.bind({});
CounterSmallSize.args = {
  value: 20,
  size: 'small',
};
CounterSmallSize.storyName = 'Small Size';

export const CounterMediumSize = CountersWithColorTemplate.bind({});
CounterMediumSize.args = {
  value: 20,
  size: 'medium',
};
CounterMediumSize.storyName = 'Medium Size';

export const CounterLargeSize = CountersWithColorTemplate.bind({});
CounterLargeSize.args = {
  value: 20,
  size: 'large',
};
CounterLargeSize.storyName = 'Large Size';
