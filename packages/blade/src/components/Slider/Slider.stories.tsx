import type { Meta, StoryFn } from '@storybook/react-vite';
import React from 'react';
import { SliderDocs } from './SliderDocs';
import { Slider } from './Slider';
import { SliderInteractiveLab } from './SliderInteractiveLab';
import { SliderVariantMatrix } from './SliderVariantMatrix';
import type { SliderProps, SliderValue } from './types';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Heading } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: 'Transaction limit',
    min: 0,
    max: 100,
    step: 1,
    variant: 'single',
    defaultValue: 50,
    size: 'medium',
    color: 'information',
    labelPosition: 'top',
    showValue: true,
    showThumbValue: false,
    showMarks: false,
    showMinMax: false,
    isDisabled: false,
    isRequired: false,
    necessityIndicator: 'required',
    validationState: 'none',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['single', 'range'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    labelPosition: { control: 'inline-radio', options: ['top', 'left'] },
    color: {
      control: 'select',
      options: ['information', 'positive', 'negative', 'notice', 'neutral'],
    },
    validationState: { control: 'inline-radio', options: ['none', 'error', 'success'] },
    necessityIndicator: { control: 'select', options: ['required', 'optional', 'none'] },
    value: { control: false },
    valueFormatter: { control: false },
    marks: { control: 'object' },
    ...getStyledPropsArgTypes(),
  },
  parameters: { docs: { page: SliderDocs } },
  tags: ['autodocs'],
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof Slider> = (args) => {
  const min = args.min ?? 0;
  const max = args.max ?? 100;
  const scalarDefault = typeof args.defaultValue === 'number' ? args.defaultValue : 50;
  let defaultValue: SliderValue = scalarDefault;
  if (args.variant === 'range') {
    defaultValue = Array.isArray(args.defaultValue)
      ? args.defaultValue
      : [Math.max(min, scalarDefault - 20), Math.min(max, scalarDefault + 20)];
  } else if (Array.isArray(args.defaultValue)) {
    defaultValue = args.defaultValue[1];
  }
  const normalizedArgs = { ...args, defaultValue } as SliderProps;
  const storyKey = `${args.variant}-${JSON.stringify(defaultValue)}-${min}-${max}-${args.step}`;

  return <Slider key={storyKey} {...normalizedArgs} />;
};

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
    <Slider
      label="Success"
      defaultValue={70}
      validationState="success"
      successText="Value looks good"
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

export const ComponentLab: StoryFn<typeof Slider> = () => <SliderInteractiveLab />;

export const VariantMatrix: StoryFn<typeof Slider> = () => <SliderVariantMatrix />;

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
