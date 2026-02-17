import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { CountryCodeType } from '@razorpay/i18nify-js';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import { Title } from '@storybook/addon-docs';
import type { PhoneNumberInputProps } from './types';
import { PhoneNumberInput } from './PhoneNumberInput';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import { InfoIcon, PhoneIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
import { Button } from '~components/Button';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { Link } from '~components/Link';

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

export const PhoneNumberInputWithLabelSuffixTrailing = PhoneNumberInputTemplate.bind({});
PhoneNumberInputWithLabelSuffixTrailing.storyName = 'PhoneNumberInput with Label Suffix & Trailing';
PhoneNumberInputWithLabelSuffixTrailing.args = {
  label: 'Enter phone number',
  placeholder: 'Enter phone number',
  labelSuffix: (
    <Tooltip content="Enter your phone number" placement="right">
      <TooltipInteractiveWrapper display="flex">
        <InfoIcon size="small" color="surface.icon.gray.muted" />
      </TooltipInteractiveWrapper>
    </Tooltip>
  ),
  labelTrailing: <Link size="small">Learn more</Link>,
};

export const PhoneNumberInputShowcase: StoryFn<typeof PhoneNumberInput> = () => {
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
          <PhoneNumberInput label="Default" name="default" />
          <PhoneNumberInput label="With Value" defaultValue="9876543210" name="withValue" />
          <PhoneNumberInput
            label="With Help Text"
            helpText="Phone number is needed for sending you invoice"
            name="withHelpText"
          />
          <PhoneNumberInput label="Disabled" isDisabled name="disabled" />
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
          <PhoneNumberInput
            label="Error State"
            defaultValue="12345"
            validationState="error"
            errorText="This phone number is invalid"
            name="error"
          />
          <PhoneNumberInput
            label="Success State"
            defaultValue="9876543210"
            validationState="success"
            successText="This phone number is valid"
            name="success"
          />
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
          <PhoneNumberInput label="Medium Size" size="medium" name="sizeMedium" />
          <PhoneNumberInput label="Large Size" size="large" name="sizeLarge" />
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
          <PhoneNumberInput label="Label Top" labelPosition="top" name="labelTop" />
          <PhoneNumberInput label="Label Left" labelPosition="left" name="labelLeft" />
        </Box>
      </Box>

      {/* Necessity Indicators */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Necessity Indicators
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <PhoneNumberInput label="Required Field" necessityIndicator="required" name="required" />
          <PhoneNumberInput label="Optional Field" necessityIndicator="optional" name="optional" />
        </Box>
      </Box>

      {/* With Icons */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Icons
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <PhoneNumberInput
            label="Leading Icon"
            leadingIcon={PhoneIcon}
            showCountrySelector={false}
            name="leadingIcon"
          />
          <PhoneNumberInput label="Trailing Icon" trailingIcon={InfoIcon} name="trailingIcon" />
          <PhoneNumberInput
            label="Both Icons"
            leadingIcon={PhoneIcon}
            trailingIcon={InfoIcon}
            showCountrySelector={false}
            name="bothIcons"
          />
        </Box>
      </Box>

      {/* Country Selector Variations */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Country Selector Variations
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <PhoneNumberInput
            label="With Country Selector"
            showCountrySelector
            name="withCountrySelector"
          />
          <PhoneNumberInput
            label="Without Country Selector"
            showCountrySelector={false}
            name="withoutCountrySelector"
          />
          <PhoneNumberInput
            label="Default Country (Malaysia)"
            defaultCountry="MY"
            name="defaultCountryMY"
          />
          <PhoneNumberInput
            label="Allowed Countries Only"
            allowedCountries={['IN', 'US', 'MY']}
            name="allowedCountries"
          />
        </Box>
      </Box>

      {/* Dial Code Variations */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Dial Code Variations
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <PhoneNumberInput label="With Dial Code" showDialCode name="withDialCode" />
          <PhoneNumberInput label="Without Dial Code" showDialCode={false} name="withoutDialCode" />
        </Box>
      </Box>

      {/* Text Alignment */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Text Alignment
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <PhoneNumberInput
            label="Left Aligned"
            defaultValue="9876543210"
            textAlign="left"
            name="textAlignLeft"
          />
          <PhoneNumberInput
            label="Center Aligned"
            defaultValue="9876543210"
            textAlign="center"
            name="textAlignCenter"
          />
          <PhoneNumberInput
            label="Right Aligned"
            defaultValue="9876543210"
            textAlign="right"
            name="textAlignRight"
          />
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
        <PhoneNumberInput
          label="Phone Number"
          labelSuffix={
            <Tooltip content="Your phone number is used for verification" placement="right">
              <TooltipInteractiveWrapper display="flex">
                <InfoIcon size="small" color="surface.icon.gray.muted" />
              </TooltipInteractiveWrapper>
            </Tooltip>
          }
          labelTrailing={<Link size="small">Learn more</Link>}
          name="labelSuffixTrailing"
        />
      </Box>
    </Box>
  );
};

PhoneNumberInputShowcase.storyName = 'Showcase - All Variants';
PhoneNumberInputShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all PhoneNumberInput variants including basic states, validation states, sizes, label positions, icons, country selector variations, dial code variations, and more.',
    },
  },
};

export default meta;
