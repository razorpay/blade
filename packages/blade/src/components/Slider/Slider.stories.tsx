import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
import type { SliderProps } from './types';
import { Slider } from './index';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';

export default {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: 'Corner Radius',
    min: 0,
    max: 24,
    step: 2,
    defaultValue: 12,
    size: 'medium',
    isDisabled: false,
    showTooltip: true,
    showSteps: false,
    labelPosition: 'top',
  },
  argTypes: {
    showTooltip: {
      control: { type: 'boolean' },
    },
    showSteps: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['medium', 'large'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
  },
} as Meta<SliderProps>;

const SliderTemplate: StoryFn<typeof Slider> = (args) => {
  return <Slider {...args} />;
};

export const Default = SliderTemplate.bind({});

export const Controlled: StoryFn<typeof Slider> = () => {
  const [value, setValue] = useState(12);
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Slider
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

export const WithSteps: StoryFn<typeof Slider> = () => {
  const [opacity, setOpacity] = useState(80);
  return (
    <Slider
      label="Opacity"
      value={opacity}
      onChange={({ value: v }) => setOpacity(v)}
      min={0}
      max={100}
      step={10}
      showSteps
    />
  );
};

export const Continuous: StoryFn<typeof Slider> = () => {
  const [blur, setBlur] = useState(4);
  return (
    <Slider
      label="Shadow Blur"
      value={blur}
      onChange={({ value: v }) => setBlur(v)}
      min={0}
      max={20}
      step={1}
    />
  );
};

export const WithUnitSuffix: StoryFn<typeof Slider> = () => {
  const [fontSize, setFontSize] = useState(16);
  return (
    <Slider
      label="Font Size"
      value={fontSize}
      onChange={({ value: v }) => setFontSize(v)}
      min={8}
      max={32}
      step={1}
      suffix="px"
    />
  );
};

export const Disabled: StoryFn<typeof Slider> = () => {
  return (
    <Slider
      label="Line Height"
      value={20}
      onChange={() => undefined}
      min={12}
      max={40}
      isDisabled
    />
  );
};

export const Configurator: StoryFn<typeof Slider> = () => {
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
        <Slider
          label="Corner Radius"
          value={config.cornerRadius}
          onChange={update('cornerRadius')}
          min={0}
          max={24}
          step={2}
          suffix="px"
        />
        <Slider
          label="Spacing"
          value={config.spacing}
          onChange={update('spacing')}
          min={0}
          max={48}
          step={4}
          suffix="px"
        />
        <Slider
          label="Opacity"
          value={config.opacity}
          onChange={update('opacity')}
          min={0}
          max={100}
          step={10}
          suffix="%"
        />
        <Slider
          label="Shadow Blur"
          value={config.shadowBlur}
          onChange={update('shadowBlur')}
          min={0}
          max={20}
          step={1}
          suffix="px"
        />
      </Box>
    </Box>
  );
};
