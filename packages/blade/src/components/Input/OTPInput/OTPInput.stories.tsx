import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { SelectInput } from '../DropdownInputTriggers';
import type { OTPInputProps } from './OTPInput';
import { OTPInput as OTPInputComponent } from './OTPInput';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Text } from '~components/Typography';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { Link } from '~components/Link';
import { InfoIcon } from '~components/Icons';

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
  tags: ['autodocs'],
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
    onBlur: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onFocus: {
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
    labelSuffix: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelTrailing: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    size: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    testID: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    accessibilityLabel: {
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
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentName="OTPInput"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/OTPInput/_decisions/_decisions.md"
          componentDescription="A one-time password (OTP), also known as a one-time PIN, one-time authorization code (OTAC) or dynamic password, is a password that is valid for only one login session or a transaction. These are a group of inputs and can be either 4 or 6 characters long."
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-81363&t=kxYCFAmMWz6sMy04-1&scaling=min-zoom&page-id=10953%3A180623&mode=design"
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { OTPInput } from '@razorpay/blade/components';

              function App() {
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

const OTPInputTemplate: StoryFn<typeof OTPInputComponent> = ({ ...args }) => {
  const maxWidth = args.otpLength === 4 ? '376px' : '568px';
  return (
    <Box maxWidth={maxWidth}>
      <OTPInputComponent {...args} />
    </Box>
  );
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

export const OTPInputWithoutLabel = OTPInputTemplate.bind({});
OTPInputWithoutLabel.storyName = 'OTPInput without Label';
OTPInputWithoutLabel.args = {
  label: undefined,
  accessibilityLabel: 'Enter OTP',
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

const OTPInputSizesTemplate: StoryFn<typeof OTPInputComponent> = ({ ...args }) => {
  const maxWidth = args.otpLength === 4 ? '376px' : '568px';

  return (
    <Box display="flex" flexDirection="column" maxWidth={maxWidth}>
      <Text size="large" marginBottom="spacing.2">
        Medium Size:
      </Text>
      <OTPInputComponent {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">
        Large Size:
      </Text>
      <OTPInputComponent {...args} size="large" />
    </Box>
  );
};
export const OTPInputSizes = OTPInputSizesTemplate.bind({});
OTPInputSizes.args = {
  helpText: 'Help Text',
};

const OTPInputUncontrolledTemplate: StoryFn<typeof OTPInputComponent> = () => {
  return (
    <OTPInput
      label="Enter OTP"
      name="otp"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const OTPInputUncontrolled = OTPInputUncontrolledTemplate.bind({});

const OTPInputControlledTemplate: StoryFn<typeof OTPInputComponent> = () => {
  return <OTPInput label="Enter OTP" value="123456" name="otp" />;
};
export const OTPInputControlled = OTPInputControlledTemplate.bind({});

export const OTPInputRef: StoryFn<typeof OTPInputComponent> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [focusOn, setFocusOn] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement[]>([]);

  return (
    <Box gap="spacing.3" display="flex" flexDirection="column">
      <Box
        maxWidth="200px"
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
        gap="spacing.3"
      >
        <Dropdown selectionType="single">
          <SelectInput
            label="Item to focus"
            placeholder="Select Item To Focus"
            name="action"
            value={`${focusOn}`}
            onChange={({ values }) => {
              setFocusOn(Number(values[0]));
            }}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="0" value="0" />
              <ActionListItem title="1" value="1" />
              <ActionListItem title="2" value="2" />
              <ActionListItem title="3" value="3" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Box>
          <Button
            onClick={() => {
              console.log(inputRef);
              inputRef?.current[focusOn].focus();
            }}
          >
            Focus
          </Button>
        </Box>
      </Box>
      <Box maxWidth="376px">
        <OTPInputComponent
          ref={inputRef}
          label="Enter OTP"
          name="otp"
          otpLength={4}
          onChange={({ name, value }): void => console.log({ name, value })}
        />
      </Box>
    </Box>
  );
};

OTPInputRef.storyName = 'OTP Input Ref';
OTPInputRef.parameters = {
  docs: {
    description: {
      story:
        'The OTP component offers a `ref` prop for programmatically focusing on its input fields. This prop exposes an array of individual refs for each input, allowing you to focus on a particular field using `inputRef.current[index].focus()`.',
    },
  },
};

export const OTPInputWithLabelSuffixTrailing = OTPInputTemplate.bind({});
OTPInputWithLabelSuffixTrailing.storyName = 'OTPInput with Label Suffix & Trailing';
OTPInputWithLabelSuffixTrailing.args = {
  label: 'Enter OTP',
  placeholder: 'Enter OTP',
  labelSuffix: (
    <Tooltip content="Enter your OTP" placement="right">
      <TooltipInteractiveWrapper display="flex">
        <InfoIcon size="small" color="surface.icon.gray.muted" />
      </TooltipInteractiveWrapper>
    </Tooltip>
  ),
  labelTrailing: <Link size="small">Learn more</Link>,
};

export const OTPInputShowcase: StoryFn<typeof OTPInputComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Basic Variants */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Basic Variants
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="568px">
            <OTPInputComponent label="Default" name="default" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="With Value" value="123456" name="withValue" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent
              label="With Help Text"
              helpText="This is a helpful message"
              name="withHelpText"
            />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="Disabled" isDisabled name="disabled" />
          </Box>
        </Box>
      </Box>

      {/* Validation States */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Validation States
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="568px">
            <OTPInputComponent
              label="Error State"
              value="123456"
              validationState="error"
              errorText="Invalid OTP. Please try again"
              name="error"
            />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent
              label="Success State"
              value="123456"
              validationState="success"
              successText="OTP verified successfully"
              name="success"
            />
          </Box>
        </Box>
      </Box>

      {/* Sizes */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Sizes
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="568px">
            <OTPInputComponent label="Medium Size" size="medium" name="sizeMedium" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="Large Size" size="large" name="sizeLarge" />
          </Box>
        </Box>
      </Box>

      {/* Label Positions */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Label Positions
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="568px">
            <OTPInputComponent label="Label Top" labelPosition="top" name="labelTop" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="Label Left" labelPosition="left" name="labelLeft" />
          </Box>
        </Box>
      </Box>

      {/* OTP Length */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          OTP Length
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="376px">
            <OTPInputComponent label="4 Digit OTP" otpLength={4} name="otpLength4" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="6 Digit OTP" otpLength={6} name="otpLength6" />
          </Box>
        </Box>
      </Box>

      {/* Masked Input */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Masked Input
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box maxWidth="376px">
            <OTPInputComponent label="Masked 4 Digit PIN" otpLength={4} isMasked name="masked4" />
          </Box>
          <Box maxWidth="568px">
            <OTPInputComponent label="Masked 6 Digit OTP" otpLength={6} isMasked name="masked6" />
          </Box>
        </Box>
      </Box>

      {/* Auto Focus */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Auto Focus
        </Text>
        <Box maxWidth="568px">
          <OTPInputComponent label="Auto Focus Enabled" autoFocus name="autoFocus" />
        </Box>
      </Box>

      {/* With Label Suffix & Trailing */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Label Suffix & Trailing
        </Text>
        <Box maxWidth="568px">
          <OTPInputComponent
            label="Enter OTP"
            name="labelSuffixTrailing"
            labelSuffix={
              <Tooltip
                content="Your OTP is sent to your registered mobile number"
                placement="right"
              >
                <TooltipInteractiveWrapper display="flex">
                  <InfoIcon size="small" color="surface.icon.gray.muted" />
                </TooltipInteractiveWrapper>
              </Tooltip>
            }
            labelTrailing={<Link size="small">Learn more</Link>}
          />
        </Box>
      </Box>
    </Box>
  );
};

OTPInputShowcase.storyName = 'Showcase - All Variants';
OTPInputShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all OTPInput variants including basic states, validation states, sizes, label positions, OTP lengths, masked input, auto focus, and more.',
    },
  },
};
