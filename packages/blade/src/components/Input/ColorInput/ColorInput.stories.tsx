/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import React, { useState } from 'react';

import type { ColorInputProps } from './ColorInput';
import { ColorInput } from './ColorInput';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ColorInput"
      componentDescription="ColorInput is an input field for selecting or entering a hex color value. It displays a color swatch that opens the native color picker when clicked, and also accepts manual hex input."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { ColorInput } from '@razorpay/blade/components';

          function App() {
            return (
              <ColorInput
                label="Brand Color"
                defaultValue="#2563EB"
                onChange={({ value }) => console.log('Selected color:', value)}
              />
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  BASE_PROPS: 'Color Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
};

const meta: Meta<ColorInputProps> = {
  title: 'Components/Input/ColorInput',
  component: ColorInput,
  args: {
    name: 'brandColor',
    label: 'Brand Color',
    helpText: 'Enter a valid hex color (e.g. #FF5733)',
    placeholder: '#000000',
    defaultValue: '#2563EB',
    isDisabled: false,
    isRequired: false,
    size: 'medium',
    labelPosition: 'top',
    necessityIndicator: 'none',
    validationState: 'none',
  },
  tags: ['autodocs'],
  argTypes: {
    accessibilityLabel: { table: { category: propsCategory.BASE_PROPS } },
    testID: { table: { category: propsCategory.BASE_PROPS } },
    autoFocus: { table: { category: propsCategory.BASE_PROPS } },
    label: { table: { category: propsCategory.LABEL_PROPS } },
    labelPosition: { table: { category: propsCategory.LABEL_PROPS } },
    labelSuffix: { table: { category: propsCategory.LABEL_PROPS } },
    labelTrailing: { table: { category: propsCategory.LABEL_PROPS } },
    name: { table: { category: propsCategory.BASE_PROPS } },
    placeholder: { table: { category: propsCategory.BASE_PROPS } },
    size: { table: { category: propsCategory.BASE_PROPS } },
    isDisabled: { table: { category: propsCategory.BASE_PROPS } },
    isRequired: { table: { category: propsCategory.BASE_PROPS } },
    necessityIndicator: { table: { category: propsCategory.BASE_PROPS } },
    defaultValue: { table: { category: propsCategory.BASE_PROPS } },
    value: { table: { category: propsCategory.BASE_PROPS } },
    validationState: { table: { category: propsCategory.VALIDATION_PROPS } },
    helpText: { table: { category: propsCategory.VALIDATION_PROPS } },
    successText: { table: { category: propsCategory.VALIDATION_PROPS } },
    errorText: { table: { category: propsCategory.VALIDATION_PROPS } },
    onChange: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    onFocus: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    onBlur: { control: { disable: true }, table: { category: propsCategory.BASE_PROPS } },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

export default meta;

const ColorInputTemplate: StoryFn<typeof ColorInput> = ({ ...args }) => {
  return <ColorInput {...args} />;
};

export const Default = ColorInputTemplate.bind({});
Default.storyName = 'Default';

export const WithLabel = ColorInputTemplate.bind({});
WithLabel.args = {
  label: 'Choose a color',
  defaultValue: '#10B981',
};

export const Disabled = ColorInputTemplate.bind({});
Disabled.args = {
  label: 'Disabled Color',
  defaultValue: '#6B7280',
  isDisabled: true,
};

export const WithValidation = ColorInputTemplate.bind({});
WithValidation.args = {
  label: 'Validated Color',
  defaultValue: '#EF4444',
  validationState: 'error',
  errorText: 'This color does not meet contrast requirements',
};

export const WithSuccess = ColorInputTemplate.bind({});
WithSuccess.args = {
  label: 'Accessible Color',
  defaultValue: '#1D4ED8',
  validationState: 'success',
  successText: 'Great! This color meets WCAG AA contrast requirements',
};

export const Required = ColorInputTemplate.bind({});
Required.args = {
  label: 'Required Color',
  isRequired: true,
  necessityIndicator: 'required',
};

export const SizeLarge = ColorInputTemplate.bind({});
SizeLarge.args = {
  label: 'Large Color Input',
  size: 'large',
  defaultValue: '#7C3AED',
};

export const Controlled: StoryFn<typeof ColorInput> = (): ReactElement => {
  const [color, setColor] = useState('#F59E0B');
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <ColorInput
        label="Controlled Color"
        value={color}
        onChange={({ value }) => setColor(value ?? '')}
        helpText="This is a controlled input"
      />
      <BaseBox display="flex" gap="spacing.4" alignItems="center">
        <Text>Selected: {color}</Text>
        <BaseBox
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: color,
            border: '1px solid rgba(0,0,0,0.15)',
          }}
        />
      </BaseBox>
      <Button onClick={() => setColor('#10B981')} size="small">
        Set Green
      </Button>
    </Box>
  );
};
