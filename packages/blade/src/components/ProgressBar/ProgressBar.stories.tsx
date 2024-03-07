import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { ProgressBarProps } from './ProgressBar';
import { ProgressBar as ProgressBarComponent } from './ProgressBar';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A Progress bar is generally a branded element that indicates progress of process or task"
      componentName="ProgressBar"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85253&t=MTEDDZK78jmAqDmQ-1&scaling=min-zoom&page-id=16430%3A256331&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { ProgressBar } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <ProgressBar 
                label="Label" 
                value={30} 
                variant="progress" 
                size="medium" 
              />
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ProgressBar',
  component: ProgressBarComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
} as Meta<ProgressBarProps>;

const ProgressBarTemplate: StoryFn<typeof ProgressBarComponent> = ({ ...args }) => {
  return <ProgressBarComponent {...args} />;
};

export const Default = ProgressBarTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {
  label: 'Label',
  value: 20,
};

const ProgressBarWithUpdatingValuesTemplate: StoryFn<typeof ProgressBarComponent> = ({
  ...args
}) => {
  const [value, setValue] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      if (value >= 100) {
        setValue(0);
      } else {
        setValue(value + 30);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return <ProgressBarComponent {...args} value={value} />;
};

const ProgressBarWithColorsTemplate: StoryFn<typeof ProgressBarComponent> = ({ ...args }) => {
  const [value, setValue] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      if (value >= 100) {
        setValue(0);
      } else {
        setValue(value + 30);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);
  const intents = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      marginTop="spacing.3"
      marginBottom="spacing.5"
      width="100%"
    >
      {intents.map((intent) => (
        <BaseBox key={intent} paddingTop="spacing.4">
          <ProgressBarComponent {...args} color={intent} value={value} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const ProgressBarWithoutLabelAndPercentage = ProgressBarWithUpdatingValuesTemplate.bind({});
ProgressBarWithoutLabelAndPercentage.storyName = 'Without Label & Percentage';
ProgressBarWithoutLabelAndPercentage.args = {
  showPercentage: false,
};

export const ProgressBarSmallSize = ProgressBarWithUpdatingValuesTemplate.bind({});
ProgressBarSmallSize.storyName = 'Small Size';
ProgressBarSmallSize.args = {
  label: 'Label',
  size: 'small',
};

export const ProgressBarMediumSize = ProgressBarWithUpdatingValuesTemplate.bind({});
ProgressBarMediumSize.storyName = 'Medium Size';
ProgressBarMediumSize.args = {
  label: 'Label',
  size: 'medium',
};

export const ProgressBarWithColor = ProgressBarWithColorsTemplate.bind({});
ProgressBarWithColor.storyName = 'Intents';
ProgressBarWithColor.args = {
  size: 'medium',
  label: 'Label',
};

export const ProgressBarMeterVariant = ProgressBarTemplate.bind({});
ProgressBarMeterVariant.storyName = 'Meter Variant';
ProgressBarMeterVariant.args = {
  variant: 'meter',
  size: 'medium',
  value: 10,
  label: 'Balance: ₹10,000',
  color: 'notice',
};

export const ProgressBarIndeterminate = ProgressBarTemplate.bind({});
ProgressBarIndeterminate.storyName = 'Indeterminate Progress Bar';
ProgressBarIndeterminate.args = {
  isIndeterminate: true,
  label: 'Checking',
};
