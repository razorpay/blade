/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { CheckboxProps } from './';
import { Checkbox as CheckboxComponent } from './';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Checkbox"
      componentDescription="Checkbox can be used in forms when a user needs to select multiple values from several options."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75857-44078&t=ASvqFmFRXILEzPFG-1&scaling=min-zoom&page-id=13227%3A162974&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Checkbox } from '@razorpay/blade/components'
        
        function App() {
          return (
            // Check console
            <Checkbox onChange={(e) => console.log(e.isChecked)}>
              Toggle Checkbox
            </Checkbox>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

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
    size: 'medium',
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<CheckboxProps>;

const CheckboxTemplate: StoryFn<typeof CheckboxComponent> = ({ children, ...args }) => {
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

export const Small = CheckboxTemplate.bind({});
Small.storyName = 'Small';
Small.args = {
  size: 'small',
};

export const Large = CheckboxTemplate.bind({});
Large.storyName = 'Large';
Large.args = {
  size: 'large',
  helpText: 'Checkbox help text',
};

export const Indeterminate = CheckboxTemplate.bind({});
Indeterminate.storyName = 'Indeterminate';
Indeterminate.args = {
  isIndeterminate: true,
};

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <CheckboxComponent defaultChecked onChange={(e) => console.log(e)}>
        Uncontrolled
      </CheckboxComponent>
      <Text>&nbsp;</Text>
      <CheckboxComponent isChecked={checked} onChange={(e) => setChecked(e.isChecked)}>
        Controlled
      </CheckboxComponent>
      <Text>Checked: {checked ? 'True' : 'False'}</Text>
    </>
  );
};
const _ControlledAndUncontrolled: StoryFn<typeof CheckboxComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});

export const checkboxRef: StoryFn<typeof CheckboxComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="center">
      <CheckboxComponent ref={checkboxRef}>Checkbox</CheckboxComponent>
      <Button onClick={() => checkboxRef?.current?.focus()}>Click to focus the checkbox</Button>
    </BaseBox>
  );
};

checkboxRef.storyName = 'Checkbox Ref';
checkboxRef.parameters = {
  docs: {
    description: {
      story:
        'Checkbox component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};
