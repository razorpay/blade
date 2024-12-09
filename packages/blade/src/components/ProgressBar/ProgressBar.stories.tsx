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
import { Heading } from '~components/Typography';

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

          function App() {
            return (
              <ProgressBar 
                label="Label" 
                value={30} 
                type="progress" 
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

export const CircularProgress = ProgressBarTemplate.bind({});
CircularProgress.storyName = 'Circular Progress';
CircularProgress.args = {
  label: 'Label',
  value: 25,
  variant: 'circular',
  size: 'large',
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

  return (
    <BaseBox display="flex" flexDirection="column" marginTop="spacing.3" marginBottom="spacing.5">
      {args.size !== 'large' ? (
        <BaseBox marginBottom="spacing.5">
          <Heading size="medium" marginBottom="spacing.3">
            Linear
          </Heading>
          <ProgressBarComponent {...args} value={value} />
        </BaseBox>
      ) : null}
      <Heading size="medium" marginBottom="spacing.3">
        Circular
      </Heading>
      <ProgressBarComponent {...args} value={value} variant="circular" />
    </BaseBox>
  );
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
  const colors = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      marginTop="spacing.3"
      marginBottom="spacing.5"
      width="100%"
    >
      <Heading size="medium" marginBottom="spacing.3">
        Linear
      </Heading>
      {colors.map((color) => (
        <BaseBox key={color} paddingTop="spacing.4">
          <ProgressBarComponent
            label={color}
            {...args}
            color={color}
            value={value}
            variant="linear"
          />
        </BaseBox>
      ))}
      <Heading size="medium" marginBottom="spacing.3" marginTop="spacing.5">
        Circular
      </Heading>
      <BaseBox
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        alignItems="center"
        gap="spacing.6"
      >
        {colors.map((color) => (
          <BaseBox key={color} paddingTop="spacing.4">
            <ProgressBarComponent
              label={color}
              {...args}
              color={color}
              value={value}
              variant="circular"
            />
          </BaseBox>
        ))}
      </BaseBox>
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

export const ProgressBarLargeSize = ProgressBarWithUpdatingValuesTemplate.bind({});
ProgressBarLargeSize.storyName = 'Large Size';
ProgressBarLargeSize.args = {
  label: 'Label',
  size: 'large',
  variant: 'circular',
};

export const ProgressBarWithColor = ProgressBarWithColorsTemplate.bind({});
ProgressBarWithColor.storyName = 'Colors';
ProgressBarWithColor.args = {
  size: 'medium',
};

export const ProgressBarMeterVariant = ProgressBarTemplate.bind({});
ProgressBarMeterVariant.storyName = 'Meter Type';
ProgressBarMeterVariant.args = {
  type: 'meter',
  variant: 'linear',
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
