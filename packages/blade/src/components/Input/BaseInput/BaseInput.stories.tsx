import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { BaseInputProps } from './baseInputHelpers';
import { BaseInput as BaseInputComponent } from './BaseInput';

export default {
  title: 'Components/Input/BaseInput (Internal)',
  component: BaseInputComponent,
  args: {
    defaultValue: 'Kamlesh Chandnani',
    label: 'Enter Name',
    placeholder: 'Enter your first and last name',
    labelPosition: 'top',
    name: 'fullName',
    type: 'text',
    isDisabled: false,
    onChange: undefined,
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

const BaseInputTemplate: ComponentStory<typeof BaseInputComponent> = (args) => {
  return <BaseInputComponent {...args} />;
};

export const BaseInput = BaseInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseInput.storyName = 'BaseInput';

const UncontrolledBaseInputTemplate: ComponentStory<typeof BaseInputComponent> = () => {
  return (
    <BaseInput
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
