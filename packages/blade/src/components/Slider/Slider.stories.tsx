import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { SliderProps } from './types';
import { Slider as SliderComponent } from './Slider';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Heading } from '~components/Typography';
import { Button } from '~components/Button';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A Slider lets users select a value from a continuous range by dragging a thumb along a track."
      componentName="Slider"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85253&t=MTEDDZK78jmAqDmQ-1&scaling=min-zoom&page-id=16430%3A256331&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Slider } from '@razorpay/blade/components';

          function App() {
            return (
              <Slider
                label="Volume"
                defaultValue={40}
                min={0}
                max={100}
                step={1}
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
  defaultValue: 40,
  min: 0,
  max: 100,
};

export const WithHelpText = SliderTemplate.bind({});
WithHelpText.storyName = 'With Help Text';
WithHelpText.args = {
  label: 'Discount',
  helpText: 'Set the discount percentage for this promotion',
  defaultValue: 20,
  min: 0,
  max: 50,
  step: 5,
};

export const WithValidationError = SliderTemplate.bind({});
WithValidationError.storyName = 'With Validation Error';
WithValidationError.args = {
  label: 'Max Transactions',
  errorText: 'Value must be between 10 and 100',
  validationState: 'error',
  defaultValue: 5,
  min: 10,
  max: 100,
};

export const WithValidationSuccess = SliderTemplate.bind({});
WithValidationSuccess.storyName = 'With Validation Success';
WithValidationSuccess.args = {
  label: 'Risk Threshold',
  successText: 'Risk threshold is within acceptable range',
  validationState: 'success',
  defaultValue: 60,
  min: 0,
  max: 100,
};

export const Disabled = SliderTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  label: 'Credit Limit',
  defaultValue: 50,
  isDisabled: true,
};

export const SmallSize = SliderTemplate.bind({});
SmallSize.storyName = 'Small Size';
SmallSize.args = {
  label: 'Opacity',
  defaultValue: 75,
  size: 'small',
};

export const WithTooltip = SliderTemplate.bind({});
WithTooltip.storyName = 'With Tooltip';
WithTooltip.args = {
  label: 'Budget',
  defaultValue: 30,
  showTooltip: true,
};

export const WithCustomStep = SliderTemplate.bind({});
WithCustomStep.storyName = 'With Custom Step';
WithCustomStep.args = {
  label: 'Tax Rate (%)',
  defaultValue: 18,
  min: 0,
  max: 30,
  step: 3,
  helpText: 'Select in increments of 3%',
};

export const Controlled: StoryFn<typeof SliderComponent> = () => {
  const [value, setValue] = useState(25);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Heading size="medium">Controlled Slider</Heading>
      <SliderComponent
        label="Transaction Limit"
        value={value}
        min={0}
        max={100}
        onChange={({ value: newValue }) => setValue(newValue)}
        helpText={`Current value: ${value}`}
      />
      <BaseBox display="flex" gap="spacing.3">
        <Button size="small" onClick={() => setValue(0)}>
          Reset to 0
        </Button>
        <Button size="small" onClick={() => setValue(50)}>
          Set to 50
        </Button>
        <Button size="small" onClick={() => setValue(100)}>
          Set to 100
        </Button>
      </BaseBox>
    </BaseBox>
  );
};
Controlled.storyName = 'Controlled';

export const WithRequiredLabel = SliderTemplate.bind({});
WithRequiredLabel.storyName = 'With Required Label';
WithRequiredLabel.args = {
  label: 'Interest Rate',
  necessityIndicator: 'required',
  defaultValue: 12,
  min: 0,
  max: 36,
  step: 1,
};

export const WithOptionalLabel = SliderTemplate.bind({});
WithOptionalLabel.storyName = 'With Optional Label';
WithOptionalLabel.args = {
  label: 'Cashback Percentage',
  necessityIndicator: 'optional',
  defaultValue: 5,
  min: 0,
  max: 20,
};
