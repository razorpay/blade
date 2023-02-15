import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { CounterProps } from './Counter';
import { Counter as CounterComponent } from './Counter';
import BaseBox from '~components/Box/BaseBox';
import { Text as BladeText } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Counter"
      componentDescription="Counters are visual indicators that contains numerical values, tallies or counts in regards to some context. It can be used to show non-interactive numerical data."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8222%3A70827',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=8222%3A70827',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Counter } from '@razorpay/blade/components';

          function App(): JSX.Element {
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
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CounterProps>;

const CounterTemplate: ComponentStory<typeof CounterComponent> = ({ ...args }) => {
  return <CounterComponent {...args} />;
};

export const Counter = CounterTemplate.bind({});
Counter.args = {
  value: 20,
  intent: 'neutral',
  contrast: 'low',
};
Counter.storyName = 'Default';

export const Max = CounterTemplate.bind({});
Max.args = {
  value: 120,
  max: 99,
  intent: 'neutral',
  contrast: 'high',
};
Max.storyName = 'Max';

const CountersWithVariantTemplate: ComponentStory<typeof CounterComponent> = ({ ...args }) => {
  const intents = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <BaseBox display="flex" flexDirection="column">
      <BladeText>Low Contrast</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {intents.map((intent) => (
          <BaseBox key={intent} paddingRight="spacing.3" paddingTop="spacing.2">
            <CounterComponent {...args} intent={intent} contrast="low" />
          </BaseBox>
        ))}
      </BaseBox>
      <BladeText>High Contrast</BladeText>
      <BaseBox
        display="flex"
        flexDirection="row"
        paddingTop="spacing.3"
        paddingBottom="spacing.5"
        flexWrap="wrap"
      >
        {intents.map((intent) => (
          <BaseBox key={intent} paddingRight="spacing.3" paddingTop="spacing.2">
            <CounterComponent {...args} intent={intent} contrast="high" />
          </BaseBox>
        ))}
      </BaseBox>
    </BaseBox>
  );
};

export const CounterSmallSize = CountersWithVariantTemplate.bind({});
CounterSmallSize.args = {
  value: 20,
  size: 'small',
};
CounterSmallSize.storyName = 'Small Size';

export const CounterMediumSize = CountersWithVariantTemplate.bind({});
CounterMediumSize.args = {
  value: 20,
  size: 'medium',
};
CounterMediumSize.storyName = 'Medium Size';

export const CounterLargeSize = CountersWithVariantTemplate.bind({});
CounterLargeSize.args = {
  value: 20,
  size: 'large',
};
CounterLargeSize.storyName = 'Large Size';
