import { Title } from '@storybook/addon-docs/blocks';
import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { SliderProps } from './';
import { Slider as SliderComponent } from './';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Slider"
      componentDescription="A Slider allows users to select a value from a continuous or discrete range by dragging a thumb along a track."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85736&scaling=min-zoom&page-id=30100%3A565839&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Slider } from '@razorpay/blade/components';

        function App() {
          return (
            <Slider
              label="Volume"
              defaultValue={50}
              min={0}
              max={100}
              step={1}
              onChange={({ value }) => console.log('Value:', value)}
            />
          );
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
  args: {
    label: 'Label',
    defaultValue: undefined,
    value: undefined,
    min: 0,
    max: 100,
    step: 1,
    isDisabled: false,
    size: 'medium',
    showValue: true,
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    validationState: 'none',
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof SliderComponent> = ({ ...args }) => {
  return <SliderComponent {...args} />;
};

export const Default = SliderTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  label: 'Volume',
  defaultValue: 50,
};

export const WithHelpText = SliderTemplate.bind({});
WithHelpText.storyName = 'With Help Text';
WithHelpText.args = {
  label: 'Price Range',
  defaultValue: 30,
  helpText: 'Drag the slider to set the maximum price.',
};

export const WithError = SliderTemplate.bind({});
WithError.storyName = 'With Error';
WithError.args = {
  label: 'Quantity',
  defaultValue: 0,
  validationState: 'error',
  errorText: 'Please select at least 1 item.',
};

export const WithSuccess = SliderTemplate.bind({});
WithSuccess.storyName = 'With Success';
WithSuccess.args = {
  label: 'Discount',
  defaultValue: 25,
  validationState: 'success',
  successText: 'Discount applied successfully.',
};

export const Small = SliderTemplate.bind({});
Small.storyName = 'Small Size';
Small.args = {
  label: 'Volume',
  defaultValue: 40,
  size: 'small',
};

export const Large = SliderTemplate.bind({});
Large.storyName = 'Large Size';
Large.args = {
  label: 'Volume',
  defaultValue: 60,
  size: 'large',
};

export const Disabled = SliderTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  label: 'Volume',
  defaultValue: 50,
  isDisabled: true,
};

export const WithSteps = SliderTemplate.bind({});
WithSteps.storyName = 'With Steps';
WithSteps.args = {
  label: 'Rating',
  defaultValue: 3,
  min: 1,
  max: 5,
  step: 1,
  helpText: 'Select a rating from 1 to 5.',
};

export const WithoutLabel = SliderTemplate.bind({});
WithoutLabel.storyName = 'Without Label';
WithoutLabel.args = {
  accessibilityLabel: 'Volume control',
  defaultValue: 50,
};

const ControlledTemplate: StoryFn<typeof SliderComponent> = () => {
  const [value, setValue] = React.useState(25);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <SliderComponent
        label="Controlled Slider"
        value={value}
        onChange={({ value: v }) => setValue(v)}
      />
      <Box display="flex" gap="spacing.3">
        <Button size="small" onClick={() => setValue(0)}>
          Reset
        </Button>
        <Button size="small" onClick={() => setValue(50)}>
          Set 50
        </Button>
        <Button size="small" onClick={() => setValue(100)}>
          Max
        </Button>
      </Box>
      <Text>Current value: {value}</Text>
    </Box>
  );
};

export const Controlled = ControlledTemplate.bind({});
Controlled.storyName = 'Controlled';

const AllSizesTemplate: StoryFn<typeof SliderComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <SliderComponent label="Small" size="small" defaultValue={40} />
      <SliderComponent label="Medium" size="medium" defaultValue={55} />
      <SliderComponent label="Large" size="large" defaultValue={70} />
    </Box>
  );
};

export const AllSizes = AllSizesTemplate.bind({});
AllSizes.storyName = 'All Sizes';
