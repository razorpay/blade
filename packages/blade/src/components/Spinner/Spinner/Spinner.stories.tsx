import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import type { SpinnerProps } from './Spinner';
import { Spinner as SpinnerComponent } from './Spinner';
import BaseBox from '~components/Box/BaseBox';
import type { TextProps } from '~components/Typography';
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

const ColorSwatch = ({
  title,
  description,
  backgroundColor,
  textColor,
  children,
}: {
  title: string;
  description: string;
  backgroundColor: string;
  textColor?: TextProps<{ variant: 'body' }>['color'];
  children: ReactElement;
}): ReactElement => {
  return (
    <BaseBox
      marginBottom="spacing.4"
      paddingTop="spacing.5"
      paddingBottom="spacing.5"
      paddingLeft="spacing.5"
      paddingRight="spacing.5"
      borderRadius="medium"
      backgroundColor={backgroundColor}
    >
      <Text color={textColor} weight="medium">
        {title}
      </Text>
      <Text color={textColor} size="small">
        {description}
      </Text>
      <BaseBox marginBottom="spacing.4" />
      {children}
    </BaseBox>
  );
};

const SpinnerColorTemplate: StoryFn<typeof SpinnerComponent> = ({ ...args }) => {
  const { theme } = useTheme();

  return (
    <BaseBox>
      <ColorSwatch
        title="neutral"
        description="The default. Tracks the page surface, so it stays readable in both color schemes."
        backgroundColor={theme.colors.surface.background.gray.subtle}
      >
        <SpinnerComponent {...args} color="neutral" />
      </ColorSwatch>
      <ColorSwatch
        title="primary"
        description="For a spinner that should carry the brand color."
        backgroundColor={theme.colors.surface.background.gray.subtle}
      >
        <SpinnerComponent {...args} color="primary" />
      </ColorSwatch>
      <ColorSwatch
        title="white"
        description="Static white. Use it on a surface that is dark in both color schemes."
        backgroundColor={theme.colors.interactive.background.staticBlack.default}
        textColor="surface.text.staticWhite.normal"
      >
        <SpinnerComponent {...args} color="white" />
      </ColorSwatch>
      <ColorSwatch
        title="onNeutral"
        description="For a filled neutral surface. It inverts with the theme — switch the toolbar between light and dark to see the surface and the spinner flip together."
        backgroundColor={theme.colors.interactive.background.neutral.default}
        textColor="interactive.text.onNeutral.normal"
      >
        <SpinnerComponent {...args} color="onNeutral" />
      </ColorSwatch>
    </BaseBox>
  );
};

export const SpinnerContrasts = SpinnerColorTemplate.bind({});
SpinnerContrasts.storyName = 'Colors';
