import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { BaseInput as BaseInputComponent } from './BaseInput';
import iconMap from '~components/Icons/iconMap';

export default {
  title: 'Components/Input/BaseInput (Internal)',
  component: BaseInputComponent,
  args: {
    id: 'base-input',
    defaultValue: undefined,
    label: 'Enter Name',
    placeholder: 'Enter your first and last name',
    labelPosition: 'top',
    name: 'fullName',
    type: 'text',
    isDisabled: false,
    onChange: undefined,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    isRequired: false,
    leadingIcon: undefined,
    prefix: '',
    suffix: '',
    trailingIcon: undefined,
  },
  argTypes: {
    leadingIcon: {
      name: 'leadingIcon',
      type: 'select',
      options: Object.keys(iconMap),
    },
    trailingIcon: {
      name: 'trailingIcon',
      type: 'select',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            The BaseInput component is a component that will be used as a base to build all the
            other input fields like TextInput, PasswordInput, CardInput, OTPInput
          </Subtitle>
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { BaseText } from '@razorpay/blade/components' \nimport type { BaseTextProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseInputProps>;

const BaseInputTemplate: ComponentStory<typeof BaseInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  return (
    <BaseInputComponent
      {...args}
      leadingIcon={iconMap[(leadingIcon as unknown) as string]}
      trailingIcon={iconMap[(trailingIcon as unknown) as string]}
    />
  );
};

export const BaseInput = BaseInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseInput.storyName = 'BaseInput';

export const BaseInputHelpText = BaseInputTemplate.bind({});
BaseInputHelpText.storyName = 'BaseInput with Help Text';
BaseInputHelpText.args = {
  helpText: 'Please enter first and last name',
};

export const BaseInputError = BaseInputTemplate.bind({});
BaseInputError.storyName = 'BaseInput with error';
BaseInputError.args = {
  validationState: 'error',
  helpText: 'Name is not valid',
};

export const BaseInputSuccess = BaseInputTemplate.bind({});
BaseInputSuccess.storyName = 'BaseInput with success';
BaseInputSuccess.args = {
  defaultValue: 'John Ives',
  validationState: 'success',
  helpText: 'Name validated',
};

const UncontrolledBaseInputTemplate: ComponentStory<typeof BaseInputComponent> = () => {
  return (
    <BaseInput
      id="base-input"
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const UncontrolledBaseInput = UncontrolledBaseInputTemplate.bind({});

const ControlledBaseInputTemplate: ComponentStory<typeof BaseInputComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <BaseInput
      id="base-input"
      label="First Name"
      value={inputValue}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
    />
  );
};
export const ControlledBaseInput = ControlledBaseInputTemplate.bind({});
