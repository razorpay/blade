import type { Meta, StoryFn } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import React from 'react';
import { Slider } from './Slider';
import type { SliderProps } from './types';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Heading } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const FIGMA_URL =
  'https://www.figma.com/design/k1V23Ml1EWUokVyqN4TTod/Slider-Research---Snowflake-Component-Exploration?node-id=120-797';

const Page = (): ReactElement => (
  <StoryPageWrapper
    componentDescription="Slider lets people select one value or a bounded range by dragging, tapping the track, or using the keyboard."
    componentName="Slider"
    figmaURL={FIGMA_URL}
  >
    <Title>Usage</Title>
    <Sandbox>
      {`
        import { Slider } from '@razorpay/blade/components';

        function App() {
          const [value, setValue] = React.useState(50);

          return (
            <Slider
              label="Transaction limit"
              value={value}
              onChange={({ value }) => setValue(value)}
              min={0}
              max={100}
              showMinMax
            />
          );
        }
      `}
    </Sandbox>
    <Title>Compose With TextInput</Title>
    <Sandbox>
      {`
        import { Box, Slider, TextInput } from '@razorpay/blade/components';

        <Box display="flex" alignItems="flex-end" gap="spacing.4">
          <Slider
            accessibilityLabel="Opacity"
            value={opacity}
            onChange={({ value }) => setOpacity(value)}
          />
          <TextInput
            label="Opacity"
            type="number"
            value={String(opacity)}
            onChange={({ value }) => setOpacity(Number(value))}
            suffix="%"
          />
        </Box>
      `}
    </Sandbox>
  </StoryPageWrapper>
);

export default {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: 'Transaction limit',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    size: 'medium',
    color: 'information',
    showValue: true,
    showThumbValue: false,
    showMarks: false,
    showMinMax: false,
    isDisabled: false,
    validationState: 'none',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['single', 'range'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    color: {
      control: 'select',
      options: ['information', 'positive', 'negative', 'notice', 'neutral'],
    },
    validationState: { control: 'inline-radio', options: ['none', 'error'] },
    valueFormatter: { control: false },
    marks: { control: 'object' },
    ...getStyledPropsArgTypes(),
  },
  parameters: { docs: { page: Page } },
  tags: ['autodocs'],
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof Slider> = (args) => <Slider {...args} />;

export const Default = SliderTemplate.bind({});
Default.storyName = 'Default';

export const Range = SliderTemplate.bind({});
Range.args = {
  label: 'Settlement window',
  variant: 'range',
  defaultValue: [20, 80],
  showMinMax: true,
  valueFormatter: (value) => `${value} days`,
};

export const Sizes: StoryFn<typeof Slider> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="480px">
    {(['small', 'medium', 'large'] as const).map((size) => (
      <Slider key={size} label={size} size={size} defaultValue={50} />
    ))}
  </Box>
);

export const Colors: StoryFn<typeof Slider> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.5" maxWidth="480px">
    {(['information', 'positive', 'negative', 'notice', 'neutral'] as const).map((color) => (
      <Slider key={color} label={color} color={color} defaultValue={50} />
    ))}
  </Box>
);

export const ValuesAndLabels: StoryFn<typeof Slider> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="520px">
    <Slider
      label="Discount"
      defaultValue={35}
      showThumbValue
      showMinMax
      valueFormatter={(value) => `${value}%`}
    />
    <Slider label="Custom header value" defaultValue={65} valueText="Recommended" showThumbValue />
    <Slider accessibilityLabel="Volume" defaultValue={70} showValue={false} />
  </Box>
);

export const Marks: StoryFn<typeof Slider> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.7" maxWidth="560px">
    <Slider
      label="Risk threshold"
      defaultValue={2}
      min={0}
      max={4}
      step={1}
      showMarks
      marks={[
        { value: 0, label: 'Low' },
        { value: 2, label: 'Balanced' },
        { value: 4, label: 'High' },
      ]}
    />
    <Slider
      label="Stepped range"
      variant="range"
      defaultValue={[20, 70]}
      step={10}
      showMarks
      showMinMax
    />
  </Box>
);

export const States: StoryFn<typeof Slider> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="480px">
    <Slider label="Default" defaultValue={50} helpText="Use arrow keys for precise changes" />
    <Slider
      label="Error"
      defaultValue={20}
      validationState="error"
      errorText="Choose a value of at least 30"
    />
    <Slider label="Disabled" defaultValue={50} isDisabled />
  </Box>
);

export const ComposedWithTextInput: StoryFn<typeof Slider> = () => {
  const [value, setValue] = React.useState(48);
  return (
    <Box display="flex" alignItems="flex-end" gap="spacing.4" maxWidth="560px">
      <Slider
        accessibilityLabel="Opacity"
        value={value}
        onChange={({ value }) => setValue(value)}
        showValue={false}
        flexGrow={1}
      />
      <Box width="120px">
        <TextInput
          label="Opacity"
          type="number"
          value={String(value)}
          onChange={({ value }) => setValue(Math.min(Math.max(Number(value), 0), 100))}
          suffix="%"
        />
      </Box>
    </Box>
  );
};

export const Playground: StoryFn<typeof Slider> = () => {
  const [amount, setAmount] = React.useState<readonly [number, number]>([2500, 7500]);
  return (
    <Box maxWidth="560px">
      <Heading size="small" marginBottom="spacing.5">
        Payment amount filter
      </Heading>
      <Slider
        label="Amount range"
        variant="range"
        value={amount}
        onChange={({ value }) => setAmount(value)}
        min={0}
        max={10000}
        step={500}
        showThumbValue
        showMinMax
        showMarks
        valueFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
        helpText="Includes payments within both endpoints"
      />
    </Box>
  );
};
