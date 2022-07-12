/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-shadow */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import type { CheckboxProps } from './Checkbox';
import { Checkbox as CheckboxComponent } from './Checkbox';
import { CheckboxGroup as CheckboxGroupComponent } from './CheckboxGroup';

export default {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  args: {
    children: 'Toggle checkbox',
  },
  argTypes: {},
} as Meta<CheckboxProps>;

const DefaultExample = () => {
  return (
    <>
      <CheckboxComponent>Remember Login</CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent isDisabled>Remember Login</CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent isDisabled defaultChecked>
        Remember Login
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent hasError>Remember Login</CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent hasError defaultChecked>
        Remember Login
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent helpText="Please check this box">Remember Login</CheckboxComponent>
    </>
  );
};

const CheckboxTemplate: ComponentStory<typeof CheckboxComponent> = () => {
  return <DefaultExample />;
};
export const Default = CheckboxTemplate.bind({});

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <CheckboxComponent defaultChecked onChange={(e) => console.log(e)}>
        Uncontrolled
      </CheckboxComponent>
      <Text>{''}</Text>
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
        hasError={selected.length < 1}
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
        hasError
        showOptionalLabel
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
        showOptionalLabel
        hasError
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
Default.storyName = 'Default';
