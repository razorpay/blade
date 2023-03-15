import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { OTPInputProps } from './OTPInput';
import { OTPInput as OTPInputComponent } from './OTPInput';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

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
    placeholder: '',
    name: 'otp',
    isDisabled: false,
    value: undefined,
    autoFocus: false,
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
    },
    onBlur: ({ name, value, inputIndex }): void => {
      console.log(`input field ${name} blurred with value ${value} for inputIdex ${inputIndex}`);
    },
    onFocus: ({ name, value, inputIndex }): void => {
      console.log(`input field ${name} focused with value ${value} for inputIdex ${inputIndex}`);
    },
    onOTPFilled: ({ name, value }): void => {
      console.log(`otp field ${name} filled with ${value}`);
    },
    label: 'Enter OTP',
    labelPosition: 'top',
    validationState: 'none',
    otpLength: 6,
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
  },
  argTypes: {
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
    autoCompleteSuggestionType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    isMasked: {
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
        <StoryPageWrapper
          componentName="OTPInput"
          componentDescription="A one-time password (OTP), also known as a one-time PIN, one-time authorization code (OTAC) or dynamic password, is a password that is valid for only one login session or a transaction. These are a group of inputs and can be either 4 or 6 characters long."
          figmaURL={{
            paymentTheme:
              'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A191059',
            bankingTheme:
              'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9941%3A193027',
          }}
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { OTPInput } from '@razorpay/blade/components';

              function App(): JSX.Element {
                return (
                  // Fill OTP and check console
                  <OTPInput 
                    label="Enter OTP" 
                    onOTPFilled={(e) => console.log(e)} 
                  />
                )
              }

              export default App;
            `}
          </Sandbox>
        </StoryPageWrapper>
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

export const OTPInput4Fields = OTPInputTemplate.bind({});
OTPInput4Fields.storyName = 'OTPInput with 4 Fields';
OTPInput4Fields.args = {
  otpLength: 4,
};

export const OTPInputHelpText = OTPInputTemplate.bind({});
OTPInputHelpText.storyName = 'OTPInput with Help Text';
OTPInputHelpText.args = {
  helpText: 'Add a message here',
};

export const OTPInputMasked = OTPInputTemplate.bind({});
OTPInputMasked.storyName = 'OTPInput with Masked input';
OTPInputMasked.args = {
  isMasked: true,
  otpLength: 4,
  label: 'Enter Pin',
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
      label="Enter OTP"
      name="otp"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const OTPInputUncontrolled = OTPInputUncontrolledTemplate.bind({});

const OTPInputControlledTemplate: ComponentStory<typeof OTPInputComponent> = () => {
  return <OTPInput label="Enter OTP" value="123456" name="otp" />;
};
export const OTPInputControlled = OTPInputControlledTemplate.bind({});
