/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-shadow */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import { Checkbox as CheckboxComponent } from './Checkbox';
import { CheckboxGroup as CheckboxGroupComponent } from './CheckboxGroup';
import type { CheckboxGroupProps } from './CheckboxGroup';

export default {
  title: 'Components/Checkbox/CheckboxGroup',
  component: CheckboxGroupComponent,
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
} as Meta<CheckboxGroupProps>;

const CheckboxGroupTemplate: ComponentStory<typeof CheckboxGroupComponent> = ({
  children,
  ...args
}) => {
  return (
    <CheckboxGroupComponent {...args}>
      <CheckboxComponent value="apple">Apple</CheckboxComponent>
      <CheckboxComponent value="mango">Mango</CheckboxComponent>
      <CheckboxComponent value="orange">Orange</CheckboxComponent>
    </CheckboxGroupComponent>
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

const IndeterminateExample = () => {
  const fields = ['apple', 'mango', 'orange'];
  const [selected, setSelected] = React.useState(['apple', 'mango']);
  const allChecked = selected.length === 3;
  const isIndeterminate = selected.length > 0 && !allChecked;
  const noneSelected = selected.length < 1;
  return (
    <>
      <CheckboxComponent
        isChecked={allChecked}
        onChange={({ isChecked }) => {
          if (isChecked) {
            setSelected(fields);
            return;
          }
          setSelected([]);
        }}
        validationState={noneSelected ? 'error' : 'none'}
        isIndeterminate={isIndeterminate}
      >
        Select all
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        helpText="Select your favourite fruits"
        errorText="Select atleast one"
        label="Select fruits"
        value={selected}
        validationState={noneSelected ? 'error' : 'none'}
        onChange={({ values }) => setSelected(values)}
      >
        {fields.map((field) => {
          return (
            <CheckboxComponent key={field} value={field}>
              {field}
            </CheckboxComponent>
          );
        })}
      </CheckboxGroupComponent>
    </>
  );
};

const IndeterminateTemplate: ComponentStory<typeof CheckboxComponent> = () => {
  return <IndeterminateExample />;
};
export const Indeterminate = IndeterminateTemplate.bind({});

export const KitchenSink = (): React.ReactElement => {
  const [selected, setSelected] = React.useState(['mango', 'apple']);

  return (
    <>
      <CheckboxGroupComponent
        helpText="Select atleast one"
        label="Uncontrolled"
        defaultValue={['apple', 'orange']}
        onChange={(e) => console.log(e)}
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        errorText="Selected atleast one item"
        helpText={`You selected ${selected.join(', ')}`}
        label="Controlled"
        value={selected}
        onChange={({ values }) => setSelected(values)}
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        neccessityIndicator="required"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        validationState="error"
        neccessityIndicator="optional"
        errorText="Atleast one has to be selected"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        labelPosition="left"
        neccessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent value="apple">Apple</CheckboxComponent>
        <CheckboxComponent value="mango">Mango</CheckboxComponent>
        <CheckboxComponent value="orange">Orange</CheckboxComponent>
      </CheckboxGroupComponent>
    </>
  );
};
