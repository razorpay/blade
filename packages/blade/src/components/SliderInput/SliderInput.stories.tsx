import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
import type { SliderInputProps } from './types';
import { SliderInput } from './index';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';

export default {
  title: 'Components/Input/SliderInput',
  component: SliderInput,
  args: {
    label: 'Corner Radius',
    min: 0,
    max: 24,
    step: 2,
    defaultValue: 12,
    size: 'medium',
    isDisabled: false,
    validationState: 'none',
    labelPosition: 'top',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['medium', 'large'],
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'error', 'success'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
  },
} as Meta<SliderInputProps>;

const SliderInputTemplate: StoryFn<typeof SliderInput> = (args) => {
  return <SliderInput {...args} />;
};

export const Default = SliderInputTemplate.bind({});

export const Controlled: StoryFn<typeof SliderInput> = () => {
  const [value, setValue] = useState(12);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <SliderInput
        label="Corner Radius"
        value={value}
        onChange={({ value: v }) => setValue(v)}
        min={0}
        max={24}
        step={2}
      />
      <Text size="small" color="surface.text.gray.muted">
        Current value: {value}px
      </Text>
    </Box>
  );
};

export const WithSteps: StoryFn<typeof SliderInput> = () => {
  const [opacity, setOpacity] = useState(80);
  return (
    <SliderInput
      label="Opacity"
      value={opacity}
      onChange={({ value: v }) => setOpacity(v)}
      min={0}
      max={100}
      step={10}
    />
  );
};

export const Continuous: StoryFn<typeof SliderInput> = () => {
  const [blur, setBlur] = useState(4);
  return (
    <SliderInput
      label="Shadow Blur"
      value={blur}
      onChange={({ value: v }) => setBlur(v)}
      min={0}
      max={20}
      step={1}
    />
  );
};

export const ErrorState: StoryFn<typeof SliderInput> = () => {
  const [fontSize, setFontSize] = useState(10);
  return (
    <SliderInput
      label="Font Size"
      value={fontSize}
      onChange={({ value: v }) => setFontSize(v)}
      min={8}
      max={32}
      step={1}
      validationState={fontSize < 12 ? 'error' : 'none'}
      errorText="Below 12px does not meet accessibility standards"
      helpText="Minimum 12px recommended"
    />
  );
};

export const Disabled: StoryFn<typeof SliderInput> = () => {
  return (
    <SliderInput
      label="Line Height"
      value={20}
      onChange={() => undefined}
      min={12}
      max={40}
      isDisabled
    />
  );
};

export const Configurator: StoryFn<typeof SliderInput> = () => {
  const [config, setConfig] = useState({
    cornerRadius: 12,
    spacing: 16,
    opacity: 100,
    shadowBlur: 4,
  });

  const update = (key: keyof typeof config) => ({ value }: { value: number }) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="320px">
      <Heading size="small">Checkout Configurator</Heading>
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <SliderInput
          label="Corner Radius"
          value={config.cornerRadius}
          onChange={update('cornerRadius')}
          min={0}
          max={24}
          step={2}
        />
        <SliderInput
          label="Spacing"
          value={config.spacing}
          onChange={update('spacing')}
          min={0}
          max={48}
          step={4}
        />
        <SliderInput
          label="Opacity"
          value={config.opacity}
          onChange={update('opacity')}
          min={0}
          max={100}
          step={10}
        />
        <SliderInput
          label="Shadow Blur"
          value={config.shadowBlur}
          onChange={update('shadowBlur')}
          min={0}
          max={20}
          step={1}
        />
      </Box>
    </Box>
  );
};
