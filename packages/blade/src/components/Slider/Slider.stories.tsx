import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import { useState } from 'react';
import type { SliderProps } from './types';
import { Slider as SliderComponent } from './Slider';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Heading } from '~components/Typography';
import { Text } from '~components/Typography/Text';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A Slider allows users to select a value from a continuous or discrete range by dragging a thumb along a track."
      componentName="Slider"
      figmaURL=""
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Slider } from '@razorpay/blade/components';

          function App() {
            return (
              <Slider
                label="Volume"
                defaultValue={30}
                min={0}
                max={100}
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
  title: 'Components/Slider',
  component: SliderComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof SliderComponent> = ({ ...args }) => {
  return <SliderComponent {...args} />;
};

export const Default = SliderTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  label: 'Volume',
  defaultValue: 30,
};

export const Controlled: StoryFn<typeof SliderComponent> = () => {
  const [value, setValue] = useState(40);
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      <SliderComponent
        label="Brightness"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        min={0}
        max={100}
      />
      <Text>Current value: {value}</Text>
    </BaseBox>
  );
};
Controlled.storyName = 'Controlled';

export const Disabled = SliderTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  label: 'Volume',
  defaultValue: 50,
  isDisabled: true,
};

export const WithoutValueLabel = SliderTemplate.bind({});
WithoutValueLabel.storyName = 'Without Value Label';
WithoutValueLabel.args = {
  label: 'Price Range',
  defaultValue: 250,
  min: 0,
  max: 1000,
  showValue: false,
};

export const WithStep = SliderTemplate.bind({});
WithStep.storyName = 'With Step';
WithStep.args = {
  label: 'Rating',
  defaultValue: 3,
  min: 0,
  max: 10,
  step: 0.5,
};

export const AllSizes: StoryFn<typeof SliderComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <BaseBox>
        <Heading size="small" marginBottom="spacing.3">Small</Heading>
        <SliderComponent label="Volume" defaultValue={30} size="small" />
      </BaseBox>
      <BaseBox>
        <Heading size="small" marginBottom="spacing.3">Medium</Heading>
        <SliderComponent label="Volume" defaultValue={30} size="medium" />
      </BaseBox>
      <BaseBox>
        <Heading size="small" marginBottom="spacing.3">Large</Heading>
        <SliderComponent label="Volume" defaultValue={30} size="large" />
      </BaseBox>
    </BaseBox>
  );
};
AllSizes.storyName = 'All Sizes';
