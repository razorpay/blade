/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-shadow */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import type { CheckboxProps } from './Checkbox';
import { Checkbox as CheckboxComponent } from './Checkbox';
import { CheckboxGroup as CheckboxGroupComponent } from './CheckboxGroup';

export default {
  title: 'Components/Checkbox/Checkbox',
  component: CheckboxComponent,
  args: {
    defaultChecked: undefined,
    validationState: undefined,
    isChecked: undefined,
    isDisabled: undefined,
    isIndeterminate: undefined,
    isRequired: undefined,
    name: undefined,
    onChange: undefined,
    value: undefined,
    helpText: undefined,
    errorText: undefined,
    labelPosition: 'top',
    children: 'Toggle checkbox',
  },
  argTypes: {},
} as Meta<CheckboxProps>;

const CheckboxTemplate: ComponentStory<typeof CheckboxComponent> = ({ children, ...args }) => {
  return <CheckboxComponent {...args}>{children}</CheckboxComponent>;
};

export const Default = CheckboxTemplate.bind({});
Default.storyName = 'Default';

export const Checked = CheckboxTemplate.bind({});
Checked.storyName = 'Checked';
Checked.args = {
  isChecked: true,
};

export const DefaultChecked = CheckboxTemplate.bind({});
DefaultChecked.storyName = 'DefaultChecked';
DefaultChecked.args = {
  defaultChecked: true,
};

export const HelpText = CheckboxTemplate.bind({});
HelpText.storyName = 'HelpText';
HelpText.args = {
  helpText: 'Checkbox help text',
};

export const ErrorText = CheckboxTemplate.bind({});
ErrorText.storyName = 'ErrorText';
ErrorText.args = {
  validationState: 'error',
  errorText: 'Checkbox error text',
};

export const Indeterminate = CheckboxTemplate.bind({});
Indeterminate.storyName = 'Indeterminate';
Indeterminate.args = {
  isIndeterminate: true,
};

// const DefaultExample = () => {
//   return (
//     <>
//       <CheckboxComponent>Remember Login</CheckboxComponent>
//       <Text>&nbsp;</Text>
//       <CheckboxComponent isDisabled>Remember Login</CheckboxComponent>
//       <Text>&nbsp;</Text>
//       <CheckboxComponent isDisabled defaultChecked>
//         Remember Login
//       </CheckboxComponent>
//       <Text>&nbsp;</Text>
//       <CheckboxComponent validationState="error" errorText="Can you really remember?">
//         Remember Login
//       </CheckboxComponent>
//       <Text>&nbsp;</Text>
//       <CheckboxComponent validationState="error" defaultChecked>
//         Remember Login
//       </CheckboxComponent>
//       <Text>&nbsp;</Text>
//       <CheckboxComponent helpText="Please check this box">Remember Login</CheckboxComponent>
//     </>
//   );
// };

// const CheckboxTemplate: ComponentStory<typeof CheckboxComponent> = () => {
//   return <DefaultExample />;
// };
// export const Default = CheckboxTemplate.bind({});

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <CheckboxComponent defaultChecked onChange={(e) => console.log(e)}>
        Uncontrolled
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent isChecked={checked} onChange={(e) => setChecked(e)}>
        Controlled
      </CheckboxComponent>
      <Text>Checked: {checked ? 'True' : 'False'}</Text>
    </>
  );
};
const _ControlledAndUncontrolled: ComponentStory<typeof CheckboxComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});

const GroupExample = () => {
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
        validationState={selected.length < 1 ? 'error' : undefined}
        errorText="Selected atleast one item"
        helpText={`You selected ${selected.join(', ')}`}
        label="Controlled"
        value={selected}
        onChange={(values) => setSelected(values)}
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

const CheckboxGroupTemplate: ComponentStory<typeof CheckboxComponent> = () => {
  return <GroupExample />;
};
export const CheckboxGroup = CheckboxGroupTemplate.bind({});

const IndeterminateExample = () => {
  const fields = ['mango', 'apple', 'orange'];
  const [selected, setSelected] = React.useState(['mango', 'apple']);
  const allChecked = selected.length === 3;
  const isIndeterminate = selected.length > 0 && !allChecked;

  return (
    <>
      <CheckboxComponent
        isChecked={allChecked}
        onChange={(value) => {
          if (value) {
            setSelected(fields);
            return;
          }
          setSelected([]);
        }}
        isIndeterminate={isIndeterminate}
      >
        Select all
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        helpText="Select atleast one"
        label="Select fruits"
        value={selected}
        onChange={(e) => setSelected(e)}
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
export const IndeterminateCheckbox = IndeterminateTemplate.bind({});
// Default.storyName = 'Default';
