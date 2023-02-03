import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { ProgressBarProps } from './ProgressBar';
import { ProgressBar as ProgressBarComponent } from './ProgressBar';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import Box from '~components/Box/BaseBox';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A Progress bar is generally a branded element that indicates progress of process or task"
      componentName="ProgressBar"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=16430%3A256423&t=0raQL8ilgxTx5XYL-4',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11989%3A362441&t=2wnorJeMBCxn5yGG-4',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { ProgressBar } from '@razorpay/blade/components';

          function App(): JSX.Element {
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
} as Meta<ProgressBarProps>;

const ProgressBarTemplate: ComponentStory<typeof ProgressBarComponent> = ({ ...args }) => {
  return <ProgressBarComponent {...args} />;
};

export const Default = ProgressBarTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {
  label: 'Label',
  value: 20,
  contrast: 'low',
};

const ProgressBarWithUpdatingValuesTemplate: ComponentStory<typeof ProgressBarComponent> = ({
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

const ProgressBarWithIntentsTemplate: ComponentStory<typeof ProgressBarComponent> = ({
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
  const intents = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop="spacing.3"
      marginBottom="spacing.5"
      width="100%"
    >
      {intents.map((intent) => (
        <Box key={intent} paddingTop="spacing.4">
          <ProgressBarComponent {...args} intent={intent} value={value} />
        </Box>
      ))}
    </Box>
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

export const ProgressBarWithIntents = ProgressBarWithIntentsTemplate.bind({});
ProgressBarWithIntents.storyName = 'Intents';
ProgressBarWithIntents.args = {
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
  intent: 'notice',
};

export const ProgressBarIndeterminate = ProgressBarTemplate.bind({});
ProgressBarIndeterminate.storyName = 'Indeterminate Progress Bar';
ProgressBarIndeterminate.args = {
  isIndeterminate: true,
  label: 'Checking',
};
