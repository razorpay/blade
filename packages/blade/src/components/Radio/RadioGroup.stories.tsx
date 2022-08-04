/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import type { RadioGroupProps } from './RadioGroup/RadioGroup';
import { RadioGroup as RadioGroupComponent } from './RadioGroup/RadioGroup';
import { Radio as RadioComponent } from './Radio';

export default {
  title: 'Components/Radio/RadioGroup',
  component: RadioGroupComponent,
  args: {
    label: 'Checkbox Group',
    helpText: undefined,
    isDisabled: false,
    neccessityIndicator: 'none',
    labelPosition: undefined,
    validationState: undefined,
    errorText: undefined,
    name: undefined,
    defaultValue: undefined,
    onChange: undefined,
    value: undefined,
  },
  argTypes: {
    value: {
      options: ['apple', 'mango', 'orange'],
      control: {
        type: 'select',
      },
    },
    defaultValue: {
      options: ['apple', 'mango', 'orange'],
      control: {
        type: 'select',
      },
    },
  },
} as Meta<RadioGroupProps>;

const CheckboxGroupTemplate: ComponentStory<typeof RadioGroupComponent> = ({
  children,
  ...args
}) => {
  return (
    <RadioGroupComponent {...args}>
      <RadioComponent value="apple">Apple</RadioComponent>
      <RadioComponent value="mango">Mango</RadioComponent>
      <RadioComponent value="orange">Orange</RadioComponent>
    </RadioGroupComponent>
  );
};

export const Default = CheckboxGroupTemplate.bind({});
Default.storyName = 'Default';

export const HelpText = CheckboxGroupTemplate.bind({});
HelpText.storyName = 'HelpText';
HelpText.args = {
  helpText: 'CheckboxGroup help text',
};

export const ErrorText = CheckboxGroupTemplate.bind({});
ErrorText.storyName = 'ErrorText';
ErrorText.args = {
  validationState: 'error',
  errorText: 'CheckboxGroup help text',
};

export const Disabled = CheckboxGroupTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

export const Optional = CheckboxGroupTemplate.bind({});
Optional.storyName = 'Optional';
Optional.args = {
  neccessityIndicator: 'optional',
};

export const Required = CheckboxGroupTemplate.bind({});
Required.storyName = 'Required';
Required.args = {
  neccessityIndicator: 'required',
};

export const LabelPositionLeft = CheckboxGroupTemplate.bind({});
LabelPositionLeft.storyName = 'LabelPositionLeft';
LabelPositionLeft.args = {
  labelPosition: 'left',
};

export const KitchenSink = (): React.ReactElement => {
  const [selected, setSelected] = React.useState('orange');

  return (
    <>
      <RadioGroupComponent
        helpText="Select atleast one"
        label="Uncontrolled"
        defaultValue="orange"
        onChange={(e) => console.log(e)}
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        errorText="Selected atleast one item"
        helpText={`You selected ${selected}`}
        label="Controlled"
        value={selected}
        onChange={({ value, name }) => {
          setSelected(value);
          console.log(name, value);
        }}
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        neccessityIndicator="required"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        validationState="error"
        neccessityIndicator="optional"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
      <Text>&nbsp;</Text>
      <RadioGroupComponent
        labelPosition="left"
        neccessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <RadioComponent value="apple">Apple</RadioComponent>
        <RadioComponent value="mango">Mango</RadioComponent>
        <RadioComponent value="orange">Orange</RadioComponent>
      </RadioGroupComponent>
    </>
  );
};
