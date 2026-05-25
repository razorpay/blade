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
      componentDescription="ColorInput is an input field for entering color values in hex format (e.g. #FF5733). A color swatch preview is shown alongside the input to give visual feedback of the entered color."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { ColorInput } from '@razorpay/blade/components';

          function App() {
            return (
              <ColorInput
                label="Brand Color"
                placeholder="#000000"
                onChange={({ value }) => console.log(value)}
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
    validationState: { table: { category: propsCategory.VALIDATION_PROPS } },
    helpText: { table: { category: propsCategory.VALIDATION_PROPS } },
    successText: { table: { category: propsCategory.VALIDATION_PROPS } },
    errorText: { table: { category: propsCategory.VALIDATION_PROPS } },
    value: { table: { category: propsCategory.BASE_PROPS } },
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

const ColorInputTemplate: StoryFn<typeof ColorInput> = ({ ...args }) => {
  return <ColorInput {...args} />;
};

export const Default = ColorInputTemplate.bind({});

export const WithValue = ColorInputTemplate.bind({});
WithValue.args = {
  defaultValue: '#3366FF',
};
WithValue.parameters = {
  docs: {
    description: {
      story: '`defaultValue` can be used to pre-populate the color input with an initial value',
    },
  },
};

export const ErrorState = ColorInputTemplate.bind({});
ErrorState.args = {
  validationState: 'error',
  errorText: 'Please enter a valid hex color',
  defaultValue: 'notacolor',
};
ErrorState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set an `error` state and an appropriate hint can be passed with `errorText`',
    },
  },
};

export const SuccessState = ColorInputTemplate.bind({});
SuccessState.args = {
  validationState: 'success',
  successText: 'Color applied successfully',
  defaultValue: '#22C55E',
};
SuccessState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set a `success` state and an appropriate hint can be passed with `successText`',
    },
  },
};

export const Disabled = ColorInputTemplate.bind({});
Disabled.args = {
  isDisabled: true,
  defaultValue: '#6366F1',
};
Disabled.parameters = {
  docs: {
    description: {
      story: '`isDisabled` can be used to make the color input read only',
    },
  },
};

export const LabelAtLeft = ColorInputTemplate.bind({});
LabelAtLeft.args = {
  labelPosition: 'left',
};
LabelAtLeft.parameters = {
  docs: {
    description: {
      story: '`labelPosition` can be used to adjust the positioning of input label',
    },
  },
};

export const Required = ColorInputTemplate.bind({});
Required.args = {
  isRequired: true,
  necessityIndicator: 'required',
};

const ColorInputSizesTemplate: StoryFn<typeof ColorInput> = ({ ...args }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" marginBottom="spacing.2">
        Medium Size:
      </Text>
      <ColorInput {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">
        Large Size:
      </Text>
      <ColorInput {...args} size="large" />
    </Box>
  );
};
export const ColorInputSizes = ColorInputSizesTemplate.bind({});
ColorInputSizes.args = {
  defaultValue: '#3366FF',
};

export const ControlledInput = (): ReactElement => {
  const [state, setState] = useState<string | undefined>('#3366FF');
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <ColorInput
        label="Controlled ColorInput"
        helpText="See the console for output"
        value={state}
        onChange={({ value }) => {
          console.log('Controlled Input Value:', value);
          setState(value as string);
        }}
      />
      <Text>Current value: {state}</Text>
    </Box>
  );
};
ControlledInput.parameters = {
  docs: {
    description: {
      story: '`value` and `onChange` can be used to make the input field controlled',
    },
  },
};

export const inputRef: StoryFn<typeof ColorInput> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="end">
      <ColorInput ref={ref} label="Pick Color" defaultValue="#3366FF" />
      <Button
        onClick={() => {
          ref?.current?.focus();
        }}
      >
        Click to focus the input
      </Button>
    </BaseBox>
  );
};
inputRef.storyName = 'Color Input Ref';

export const ColorInputShowcase: StoryFn<typeof ColorInput> = () => {
  const colors = ['#3366FF', '#22C55E', '#EF4444', '#F97316', '#8B5CF6', '#EC4899'];

  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Basic Variants
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ColorInput label="Default" placeholder="#000000" name="default" />
          <ColorInput label="With Value" defaultValue="#3366FF" name="withValue" />
          <ColorInput
            label="With Help Text"
            placeholder="#000000"
            helpText="Enter a valid hex color (e.g. #FF5733)"
            name="withHelpText"
          />
          <ColorInput label="Disabled" defaultValue="#6366F1" isDisabled name="disabled" />
        </Box>
      </Box>

      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Validation States
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ColorInput
            label="Error State"
            defaultValue="notacolor"
            validationState="error"
            errorText="Please enter a valid hex color"
            name="error"
          />
          <ColorInput
            label="Success State"
            defaultValue="#22C55E"
            validationState="success"
            successText="Color applied successfully"
            name="success"
          />
        </Box>
      </Box>

      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Color Presets
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {colors.map((color) => (
            <ColorInput key={color} label={color} defaultValue={color} name={color} />
          ))}
        </Box>
      </Box>

      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Sizes
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <ColorInput
            label="Medium Size"
            placeholder="#000000"
            size="medium"
            defaultValue="#3366FF"
            name="sizeMedium"
          />
          <ColorInput
            label="Large Size"
            placeholder="#000000"
            size="large"
            defaultValue="#3366FF"
            name="sizeLarge"
          />
        </Box>
      </Box>
    </Box>
  );
};

ColorInputShowcase.storyName = 'Showcase - All Variants';

export default meta;
