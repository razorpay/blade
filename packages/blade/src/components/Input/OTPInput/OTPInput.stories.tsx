import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { OTPInputProps } from './OTPInput';
import { OTPInput as OTPInputComponent } from './OTPInput';

const propsCategory = {
  BASE_PROPS: 'OTPInput Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Input/OTPInput',
  component: OTPInputComponent,
  args: {
    id: 'otp-input',
    placeholder: '••••••',
    name: 'otp',
    isDisabled: false,
    value: undefined,
    autoFocus: false,
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
    },
    onOTPFilled: ({ name, value }): void => {
      console.log(`otp field ${name} filled with ${value}`);
    },
    label: 'Enter OTP',
    labelPosition: 'top',
    validationState: 'none',
    otpLength: 4,
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
  },
  argTypes: {
    id: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    placeholder: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    otpLength: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    name: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    isDisabled: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    value: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    autoFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onOTPFilled: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelPosition: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    keyboardReturnKeyType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    keyboardType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    validationState: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    helpText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    errorText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    successText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            The OTPInput component lets you enter long form text which spans over multiple lines.
          </Subtitle>
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { OTPInput } from '@razorpay/blade/components' \nimport type { OTPInputProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<OTPInputProps>;

const OTPInputTemplate: ComponentStory<typeof OTPInputComponent> = ({ ...args }) => {
  return <OTPInputComponent {...args} />;
};

export const OTPInput = OTPInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
OTPInput.storyName = 'OTPInput';

export const OTPInputHelpText = OTPInputTemplate.bind({});
OTPInputHelpText.storyName = 'OTPInput with Help Text';
OTPInputHelpText.args = {
  helpText: 'Add a message here',
};

export const OTPInputError = OTPInputTemplate.bind({});
OTPInputError.storyName = 'OTPInput with error';
OTPInputError.args = {
  validationState: 'error',
  errorText: 'Invalid message',
};

export const OTPInputSuccess = OTPInputTemplate.bind({});
OTPInputSuccess.storyName = 'OTPInput with success';
OTPInputSuccess.args = {
  validationState: 'success',
  successText: 'Validated',
};

const OTPInputUncontrolledTemplate: ComponentStory<typeof OTPInputComponent> = () => {
  return (
    <OTPInput
      id="otp"
      label="Enter OTP"
      name="otp"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const OTPInputUncontrolled = OTPInputUncontrolledTemplate.bind({});

const OTPInputControlledTemplate: ComponentStory<typeof OTPInputComponent> = () => {
  return <OTPInput id="otp" label="Enter OTP" value="1234" name="otp" />;
};
export const OTPInputControlled = OTPInputControlledTemplate.bind({});
