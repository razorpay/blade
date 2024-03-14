import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import type { PhoneNumberInputProps } from './types';
import { PhoneNumberInput } from './PhoneNumberInput';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';

const meta: Meta<PhoneNumberInputProps> = {
  title: 'Components/Input/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
};

const PhoneNumberInputTemplate: StoryFn<typeof PhoneNumberInput> = ({ ...args }) => {
  return <PhoneNumberInput {...args} />;
};

export const Default = PhoneNumberInputTemplate.bind({});

export const WithoutCountrySelector = PhoneNumberInputTemplate.bind({});
WithoutCountrySelector.args = {
  showCountrySelector: false,
};

export const WithoutDialCode = PhoneNumberInputTemplate.bind({});
WithoutDialCode.args = {
  showDialCode: false,
};

export const DefaultCountryCode = PhoneNumberInputTemplate.bind({});
DefaultCountryCode.args = {
  defaultCountryCode: 'MY',
};

export const WithHelpText = PhoneNumberInputTemplate.bind({});
WithHelpText.args = {
  helpText: 'Phone number is needed for sending you invoice',
};

export const WithErrorText = PhoneNumberInputTemplate.bind({});
WithErrorText.args = {
  validationState: 'error',
  errorText: 'Phone number is invalid',
};

export const WithSuccessText = PhoneNumberInputTemplate.bind({});
WithSuccessText.args = {
  validationState: 'success',
  successText: 'Phone number is valid',
};

export const WithoutLabel = PhoneNumberInputTemplate.bind({});
WithoutLabel.args = {
  label: undefined,
  accessibilityLabel: 'Enter your phone number',
};

const ControlledTemplate: StoryFn<typeof PhoneNumberInput> = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [data, setData] = React.useState<{
    phoneNumber: string;
    dialCode: string;
    countryCode: string;
    value: string;
    name: string;
  } | null>(null);

  return (
    <Box>
      <PhoneNumberInput
        label="Enter phone number"
        value={inputValue}
        name="phonenumber"
        onChange={({ name, value, countryCode, dialCode, phoneNumber }): void => {
          console.log(`sending ${name}:${value} to analytics service`);
          setInputValue(value ?? '');
          setData({
            name,
            value,
            countryCode,
            dialCode,
            phoneNumber,
          });
        }}
      />

      {data ? (
        <Box marginTop="spacing.4">
          <Text>
            <Text as="span" weight="semibold">
              value:
            </Text>{' '}
            {data.value}
          </Text>
          <Text>
            <Text as="span" weight="semibold">
              phoneNumber:
            </Text>{' '}
            {data.phoneNumber}
          </Text>
          <Text>
            <Text as="span" weight="semibold">
              countryCode:
            </Text>{' '}
            {data.countryCode}
          </Text>
          <Text>
            <Text as="span" weight="semibold">
              dialCode:
            </Text>{' '}
            {data.dialCode}
          </Text>
          <Text>
            <Text as="span" weight="semibold">
              name:
            </Text>{' '}
            {data.name}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};
export const Controlled = ControlledTemplate.bind({});

const ValidationTemplate: StoryFn<typeof PhoneNumberInput> = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  return (
    <Box>
      <Text marginBottom="spacing.5">
        You can choose to validate the phone number manually by using the i18nify-js library's{' '}
        <Code size="medium">isValidPhoneNumber()</Code> utility.
      </Text>
      <PhoneNumberInput
        label="Enter phone number"
        value={inputValue}
        name="phonenumber"
        errorText="Invlaid phone number"
        validationState={isValid ? 'none' : 'error'}
        onChange={({ value, countryCode }): void => {
          setInputValue(value ?? '');
          setIsValid(isValidPhoneNumber(value, countryCode));
        }}
      />
    </Box>
  );
};
export const Validation = ValidationTemplate.bind({});

export default meta;
