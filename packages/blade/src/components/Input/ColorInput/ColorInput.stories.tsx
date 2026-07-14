import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { ColorInput } from './index';
import type { ColorInputProps } from './types';
import { Box } from '~components/Box';

export default {
  title: 'Components/Input/ColorInput',
  component: ColorInput,
  args: {
    label: 'Color',
    defaultValue: { hex: '#FFFFFF', opacity: 100 },
    size: 'medium',
    showOpacity: true,
    isDisabled: false,
    labelPosition: 'top',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'error', 'success'],
    },
  },
} as Meta<ColorInputProps>;

const ColorInputTemplate: StoryFn<typeof ColorInput> = (args) => {
  return <ColorInput {...args} />;
};

export const Default = ColorInputTemplate.bind({});
Default.storyName = 'Default';

export const WithOpacity = ColorInputTemplate.bind({});
WithOpacity.storyName = 'With Opacity';
WithOpacity.args = {
  label: 'Background Color',
  defaultValue: { hex: '#FF5733', opacity: 80 },
  showOpacity: true,
};

export const WithoutOpacity = ColorInputTemplate.bind({});
WithoutOpacity.storyName = 'Without Opacity';
WithoutOpacity.args = {
  label: 'Text Color',
  defaultValue: { hex: '#000000', opacity: 100 },
  showOpacity: false,
};

export const Sizes: StoryFn<typeof ColorInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ColorInput label="Small" size="small" defaultValue={{ hex: '#FF5733', opacity: 100 }} />
      <ColorInput label="Medium" size="medium" defaultValue={{ hex: '#33FF57', opacity: 75 }} />
      <ColorInput label="Large" size="large" defaultValue={{ hex: '#3357FF', opacity: 50 }} />
    </Box>
  );
};

export const LabelPositionLeft: StoryFn<typeof ColorInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ColorInput
        label="Label"
        labelPosition="left"
        defaultValue={{ hex: '#FFFFFF', opacity: 100 }}
      />
      <ColorInput
        label="Label"
        labelPosition="left"
        defaultValue={{ hex: '#FFFFFF', opacity: 100 }}
        showOpacity={false}
      />
    </Box>
  );
};

export const ValidationStates: StoryFn<typeof ColorInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <ColorInput
        label="Help Text"
        defaultValue={{ hex: '#FFFFFF', opacity: 100 }}
        helpText="Enter a 6-digit hex code"
      />
      <ColorInput
        label="Error State"
        defaultValue={{ hex: '#ZZZ', opacity: 100 }}
        validationState="error"
        errorText="Invalid hex color"
      />
      <ColorInput
        label="Success State"
        defaultValue={{ hex: '#00FF00', opacity: 100 }}
        validationState="success"
        successText="Color saved successfully"
      />
    </Box>
  );
};

export const Disabled = ColorInputTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  label: 'Disabled Color',
  defaultValue: { hex: '#CCCCCC', opacity: 50 },
  isDisabled: true,
};
