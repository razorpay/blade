import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { ProgressBarProps } from './ProgressBar';
import { ProgressBar as ProgressBarComponent } from './ProgressBar';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

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
              <ProgressBar />
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
  args: {
    children: 'Learn More',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ProgressBarProps>;

const ProgressBarTemplate: ComponentStory<typeof ProgressBarComponent> = ({ ...args }) => {
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

export const Default = ProgressBarTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {
  label: 'Label',
  value: 20,
  size: 'medium',
  contrast: 'low',
};
