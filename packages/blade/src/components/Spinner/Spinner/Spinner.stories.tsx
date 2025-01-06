import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { SpinnerProps } from './Spinner';
import { Spinner as SpinnerComponent } from './Spinner';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { useTheme } from '~components/BladeProvider';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A spinner is an element with a looping animation that indicates loading is in process."
      componentName="Spinner"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85575&t=493DSapGGbdA42Lb-1&scaling=min-zoom&page-id=14825%3A203537&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { useEffect, useState } from 'react';
          import { Spinner, Text } from '@razorpay/blade/components';

          function App() {
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
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
} as Meta<SpinnerProps>;

const SpinnerTemplate: StoryFn<typeof SpinnerComponent> = ({ ...args }) => {
  return <SpinnerComponent {...args} />;
};

export const Spinner = SpinnerTemplate.bind({});
Spinner.storyName = 'Default';

const SpinnerSizesTemplate: StoryFn<typeof SpinnerComponent> = ({ ...args }) => {
  return (
    <BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Medium</Text>
        <BaseBox marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="medium" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="large" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <SpinnerComponent {...args} size="xlarge" />
      </BaseBox>
    </BaseBox>
  );
};

export const SpinnerSizes = SpinnerSizesTemplate.bind({});
SpinnerSizes.storyName = 'Sizes';

const SpinnerColorTemplate: StoryFn<typeof SpinnerComponent> = ({ ...args }) => {
  const { theme } = useTheme();

  return (
    <BaseBox>
      <BaseBox
        marginBottom="spacing.3"
        marginTop="spacing.3"
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        paddingLeft="spacing.3"
        backgroundColor={theme.colors.surface.background.gray.subtle}
      >
        <Text>Primary Color</Text>
        <BaseBox marginBottom="spacing.2" />
        <SpinnerComponent {...args} color="primary" />
      </BaseBox>
      <BaseBox
        marginBottom="spacing.3"
        marginTop="spacing.3"
        paddingTop="spacing.3"
        paddingBottom="spacing.3"
        paddingLeft="spacing.3"
        backgroundColor={theme.colors.surface.background.gray.subtle}
      >
        <Text contrast="high">White Color</Text>
        <BaseBox marginBottom="spacing.2" />
        <SpinnerComponent {...args} color="white" />
      </BaseBox>
    </BaseBox>
  );
};

export const SpinnerContrasts = SpinnerColorTemplate.bind({});
SpinnerContrasts.storyName = 'Colors';
