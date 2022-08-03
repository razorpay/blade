/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Button, Text } from '..';
import type { RadioProps } from './Radio';
import { Radio as RadioComponent } from './Radio';
import Box from '~components/Box';

export default {
  title: 'Components/Radio/Radio',
  component: RadioComponent,
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
} as Meta<RadioProps>;

const RadioTemplate: ComponentStory<typeof RadioComponent> = ({ children, ...args }) => {
  return <RadioComponent {...args}>{children}</RadioComponent>;
};

export const Default = RadioTemplate.bind({});
Default.storyName = 'Default';

export const Checked = RadioTemplate.bind({});
Checked.storyName = 'Checked';
Checked.args = {
  isChecked: true,
};

export const Disabled = RadioTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

export const Invalid = RadioTemplate.bind({});
Invalid.storyName = 'Invalid';
Invalid.args = {
  validationState: 'error',
};

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <RadioComponent name="fruits">Uncontrolled</RadioComponent>
      <Text>&nbsp;</Text>
      <RadioComponent
        isChecked={checked}
        onChange={({ isChecked }) => {
          setChecked(isChecked);
        }}
        name="fruits"
      >
        Controlled
      </RadioComponent>
      <Text>Checked: {checked ? 'True' : 'False'}</Text>
      <Box marginBottom="spacing.2" />
      <Button size="small" onClick={() => setChecked((prev) => !prev)}>
        Toggle checked
      </Button>
    </>
  );
};
const _ControlledAndUncontrolled: ComponentStory<typeof RadioComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});
