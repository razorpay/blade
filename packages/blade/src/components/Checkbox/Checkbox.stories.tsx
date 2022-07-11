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

// const CheckboxTemplate: ComponentStory<typeof CheckboxComponent> = ({ children, ...args }) => {
//   return (
//     <>
//       <CheckboxComponent {...args}>{children}</CheckboxComponent>

//       <CheckboxComponent {...args} isDisabled>
//         {children}
//       </CheckboxComponent>

//       <CheckboxComponent {...args} isDisabled defaultChecked>
//         {children}
//       </CheckboxComponent>

//       <CheckboxComponent {...args} hasError>
//         {children}
//       </CheckboxComponent>

//       <CheckboxComponent {...args} hasError defaultChecked>
//         {children}
//       </CheckboxComponent>

//       <CheckboxComponent {...args} helpText="Please check this box">
//         {children}
//       </CheckboxComponent>
//     </>
//   );
// };
// export const Default = CheckboxTemplate.bind({});

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

const Comp = () => {
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
  return <Comp />;
};
export const Default = CheckboxTemplate.bind({});

const GroupExample = () => {
  return (
    <>
      <CheckboxGroupComponent helpText="Select atleast one" label="Select your fruit">
        <CheckboxComponent>Apple</CheckboxComponent>
        <CheckboxComponent>Mango</CheckboxComponent>
        <CheckboxComponent>Orange</CheckboxComponent>
      </CheckboxGroupComponent>
      <Text>&nbsp;</Text>
      <CheckboxGroupComponent
        isOptional
        hasError
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Select your fruit"
      >
        <CheckboxComponent>Apple</CheckboxComponent>
        <CheckboxComponent>Mango</CheckboxComponent>
        <CheckboxComponent>Orange</CheckboxComponent>
      </CheckboxGroupComponent>
    </>
  );
};

const CheckboxGroupTemplate: ComponentStory<typeof CheckboxComponent> = () => {
  return <GroupExample />;
};
export const CheckboxGroup = CheckboxGroupTemplate.bind({});
Default.storyName = 'Default';
