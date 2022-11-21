import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { SpinnerProps } from './Spinner';
import { Spinner as SpinnerComponent } from './Spinner';
import Box from '~components/Box';
import { Text } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A spinner is an element with a looping animation that indicates loading is in process."
      componentName="Spinner"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11506%3A284715',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { useEffect, useState } from 'react';
          import { Spinner, Text } from '@razorpay/blade/components';

          function App(): JSX.Element {
            const [isLoading, setIsLoading] = useState(true);

            useEffect(() => {
              setTimeout(() => {
                setIsLoading(false)
              }, 5000)
            }, [])

            return (
              isLoading ? <Spinner /> : <Text>Tadaa 🥳 Reload sandbox to see spinner again</Text>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SpinnerProps>;

const SpinnerTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return <SpinnerComponent {...args} />;
};

export const Spinner = SpinnerTemplate.bind({});
Spinner.storyName = 'Default';

const SpinnerSizesTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Box marginBottom="spacing.3">
        <Text>Small</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="small" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Medium</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="medium" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Large</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="large" />
      </Box>
    </Box>
  );
};

export const SpinnerSizes = SpinnerSizesTemplate.bind({});
SpinnerSizes.storyName = 'Sizes';

const SpinnerContrastTemplate: ComponentStory<typeof SpinnerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Box marginBottom="spacing.3">
        <Text>Low Contrast</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} contrast="low" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>High Contrast</Text>
        <Box marginBottom="spacing.2" />
        <SpinnerComponent {...args} contrast="high" />
      </Box>
    </Box>
  );
};

export const SpinnerContrasts = SpinnerContrastTemplate.bind({});
SpinnerContrasts.storyName = 'Contrasts';
