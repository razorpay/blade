/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs/blocks';
import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { SliderProps } from './';
import { Slider as SliderComponent } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Slider"
      componentDescription="A slider allows users to select a value from a continuous or discrete range by dragging a thumb along a track."
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
              showValue
              min={0}
              max={100}
              defaultValue={50}
              accessibilityLabel="Volume"
              onChange={({ value }) => console.log(value)}
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
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    isDisabled: false,
    showValue: false,
    accessibilityLabel: 'Slider',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof SliderComponent> = (args) => (
  <SliderComponent {...args} />
);

export const Default = SliderTemplate.bind({});
Default.storyName = 'Default';

export const WithLabel = SliderTemplate.bind({});
WithLabel.storyName = 'With Label';
WithLabel.args = {
  label: 'Volume',
  showValue: true,
  defaultValue: 50,
};

export const Disabled = SliderTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  label: 'Volume',
  showValue: true,
  defaultValue: 30,
  isDisabled: true,
};

export const CustomRange = SliderTemplate.bind({});
CustomRange.storyName = 'Custom Range';
CustomRange.args = {
  label: 'Price',
  showValue: true,
  min: 100,
  max: 10000,
  step: 100,
  defaultValue: 5000,
};

export const Controlled = (): React.ReactElement => {
  const [value, setValue] = React.useState(25);
  return (
    <SliderComponent
      label="Controlled Slider"
      showValue
      min={0}
      max={100}
      value={value}
      onChange={({ value: v }) => setValue(v)}
      accessibilityLabel="Controlled Slider"
    />
  );
};
Controlled.storyName = 'Controlled';
