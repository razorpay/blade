import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { CountryCodeType } from '@razorpay/i18nify-js';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import { Title } from '@storybook/addon-docs';
import type { PhoneNumberInputProps } from './types';
import { PhoneNumberInput } from './PhoneNumberInput';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { PhoneIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
import { Button } from '~components/Button';

const propsCategory = {
  BASE_PROPS: 'Text Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  VISUAL_PROPS: 'Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

const meta: Meta<PhoneNumberInputProps> = {
  title: 'Components/Input/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
  args: {
    country: undefined,
    defaultCountry: 'IN',
    size: 'medium',
    showDialCode: true,
    showCountrySelector: true,
    allowedCountries: undefined,
    defaultValue: undefined,
    trailingIcon: undefined,
    leadingIcon: undefined,
    accessibilityLabel: undefined,
  },
  argTypes: {
    country: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    defaultCountry: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    allowedCountries: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    showDialCode: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    showCountrySelector: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    defaultValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    testID: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    size: {
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
    textAlign: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    autoFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onSubmit: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onClick: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onCountryChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onFocus: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
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
    necessityIndicator: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    isRequired: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
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
    leadingIcon: {
      name: 'leadingIcon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.VISUAL_PROPS,
      },
    },
    trailingIcon: {
      name: 'trailingIcon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.VISUAL_PROPS,
      },
    },
    onClearButtonClick: {
      table: {
        category: propsCategory.VISUAL_PROPS,
      },
    },
    keyboardReturnKeyType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    autoCompleteSuggestionType: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="A phone number input is an input field that allow users to input phone numbers with a keyboard. It supports entering phone numbers from different geographic locations."
          componentName="PhoneNumberInput"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/PhoneNumberInput/_decisions/_decisions.md"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=83906-15584&scaling=scale-down-width&page-id=82637%3A73097&mode=design&t=A1SUVWxe1R52aq58-1"
        >
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { PhoneNumberInput } from '@razorpay/blade/components';

              function App() {
                return (
                  <PhoneNumberInput 
                    label="Enter phone number" 
                    onChange={(e) => console.log(e)} 
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
};

const PhoneNumberInputTemplate: StoryFn<typeof PhoneNumberInput> = ({ ...args }) => {
  return <PhoneNumberInput {...args} />;
};

export const Default = PhoneNumberInputTemplate.bind({});

const CountriesToShowTemplate: StoryFn<typeof PhoneNumberInput> = ({ ...args }) => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        By setting the <Code size="medium">{`allowedCountries={['IN', 'MY']}`}</Code> prop, We can
        only show two countries in the Country Selector
      </Text>
      <PhoneNumberInput {...args} />
    </Box>
  );
};
export const CountriesToShow = CountriesToShowTemplate.bind({});
CountriesToShow.args = {
  allowedCountries: ['IN', 'MY'],
};

export const SizeLarge = PhoneNumberInputTemplate.bind({});
SizeLarge.storyName = 'Size: Large';
SizeLarge.args = {
  size: 'large',
};

export const WithoutCountrySelector = PhoneNumberInputTemplate.bind({});
WithoutCountrySelector.args = {
  showCountrySelector: false,
};

export const WithoutDialCode = PhoneNumberInputTemplate.bind({});
WithoutDialCode.args = {
  showDialCode: false,
};

export const DefaultCountry = PhoneNumberInputTemplate.bind({});
DefaultCountry.args = {
  defaultCountry: 'MY',
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

export const WithLeadingIcon = PhoneNumberInputTemplate.bind({});
WithLeadingIcon.args = {
  showCountrySelector: false,
  leadingIcon: PhoneIcon,
};

const ControlledCountrySelectorTemplate: StoryFn<typeof PhoneNumberInput> = () => {
  const [selectedCountry, setSelectedCountry] = React.useState<CountryCodeType>('IN');

  return (
    <Box>
      <Button
        size="small"
        variant="tertiary"
        marginBottom="spacing.4"
        onClick={() => setSelectedCountry('US')}
      >
        Change Country
      </Button>
      <Text marginBottom="spacing.4">Selected country: {selectedCountry}</Text>

      <PhoneNumberInput
        label="Enter phone number"
        name="phonenumber"
        country={selectedCountry}
        onCountryChange={({ country }): void => {
          console.log(country);
          setSelectedCountry(country);
        }}
      />
    </Box>
  );
};
export const ControlledCountrySelector = ControlledCountrySelectorTemplate.bind({});

const ControlledTemplate: StoryFn<typeof PhoneNumberInput> = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [data, setData] = React.useState<{
    phoneNumber: string;
    dialCode: string;
    country: string;
    value: string;
    name: string;
  } | null>(null);

  return (
    <Box>
      <PhoneNumberInput
        label="Enter phone number"
        value={inputValue}
        name="phonenumber"
        onChange={({ name, value, country, dialCode, phoneNumber }): void => {
          console.log(`sending ${name}:${value} to analytics service`);
          setInputValue(value ?? '');
          setData({
            name,
            value,
            country,
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
              country:
            </Text>{' '}
            {data.country}
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
        onChange={({ value, country }): void => {
          setInputValue(value ?? '');
          setIsValid(isValidPhoneNumber(value, country));
        }}
      />
    </Box>
  );
};
export const Validation = ValidationTemplate.bind({});

export default meta;
