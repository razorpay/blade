## Component Name

PhoneNumberInput

## Description

PhoneNumberInput is a specialized input component for collecting and validating international phone numbers. It features a country selector with flags, dial code display, and proper formatting based on the selected country. This component is ideal for forms requiring phone number validation across different regions, offering both controlled and uncontrolled usage patterns.

## TypeScript Types

The following types define the props that the PhoneNumberInput component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
import type { CountryCodeType } from '@razorpay/i18nify-js';

type PhoneNumberInputProps = {
  /**
   * Default value of the input, Used to set the default value of input field when it's uncontrolled
   */
  defaultValue?: string;
  /**
   * Value of the input, Used to turn the input field to controlled so user can control the value
   */
  value?: string;
  /**
   * The default country code to be used in the input.
   * Uncontrolled state of the country code.
   *
   * @default "IN" or autodetect based on the user's locale
   */
  defaultCountry?: CountryCodeType;
  /**
   * Controlled state of the country code to be used in the input.
   */
  country?: CountryCodeType;
  /**
   * Callback that is called when the country is selected from the country selector.
   */
  onCountryChange?: ({ country }: { country: CountryCodeType }) => void;
  /**
   * List of countries to be shown in the country selector.
   */
  allowedCountries?: CountryCodeType[];
  /**
   * Callback that is called when the value of the input changes.
   */
  onChange?: (event: {
    /**
     * formatted phone number with dial code
     *
     * @example: "+91 123456789"
     */
    phoneNumber: string;
    /**
     * dial code of the country
     *
     * @example: 91 for India
     */
    dialCode: string;
    /**
     * country code of the country
     *
     * @example: "IN" for India
     */
    country: CountryCodeType;
    /**
     * raw value of the input
     */
    value: string;
    /**
     * name of the input
     */
    name: string;
  }) => void;
  /**
   * If true, the dial code text will be shown in the leading text.
   *
   * @default true
   */
  showDialCode?: boolean;
  /**
   * If true, the country selector will be shown.
   *
   * @default true
   */
  showCountrySelector?: boolean;
  /**
   * Callback that is called when the clear button is clicked.
   */
  onClearButtonClick?: () => void;

  /* Common input props */
  size?: 'medium' | 'large';
  label?: string;
  accessibilityLabel?: string;
  labelPosition?: 'top' | 'left';
  helpText?: string;
  placeholder?: string;
  name?: string;
  validationState?: 'none' | 'error' | 'success';
  errorText?: string;
  successText?: string;
  necessityIndicator?: 'optional' | 'required';
  isRequired?: boolean;
  isDisabled?: boolean;
  autoFocus?: boolean;
  keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'search' | 'send';
  leadingIcon?: React.ComponentType<any>;
  trailingIcon?: React.ComponentType<any>;
  testID?: string;
  autoCompleteSuggestionType?: 'none' | 'telephone' | 'oneTimeCode';
} & DataAnalyticsAttribute &
  StyledPropsBlade;
```

## Example

### Basic Phone Number Input

This example demonstrates a simple phone number input with validation and country selection.

```tsx
import { useState } from 'react';
import { PhoneNumberInput, Box } from '@razorpay/blade/components';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import type { CountryCodeType } from '@razorpay/i18nify-js';

function PhoneNumberInputExample() {
  const [phoneData, setPhoneData] = useState({
    value: '',
    country: 'IN' as CountryCodeType,
    isValid: true
  });

  const handleChange = ({ value, country, phoneNumber }) => {
    const isValid = value ? isValidPhoneNumber(value, country) : true;

    setPhoneData({
      value,
      country,
      isValid
    });

    console.log('Formatted phone number:', phoneNumber);
  };

  return (
    <Box width="100%" maxWidth="400px">
      <PhoneNumberInput
        label="Phone Number"
        name="phoneNumber"
        defaultCountry="IN"
        value={phoneData.value}
        onChange={handleChange}
        onCountryChange={({ country }) => {
          setPhoneData(prev => ({
            ...prev,
            country,
            isValid: prev.value ? isValidPhoneNumber(prev.value, country) : true
          }));
        }}
        validationState={phoneData.isValid ? 'none' : 'error'}
        errorText="Please enter a valid phone number"
        helpText="We'll use this to send you important updates"
        necessityIndicator="required"
        size="medium"
        data-analytics-field="phone-number"
        marginBottom="spacing.4"
      />
    </Box>
  );
}
```

### Advanced Configuration Options

This example shows a more complex usage with restricted countries, custom styling, and different display options.

```tsx
import { useState } from 'react';
import {
  PhoneNumberInput,
  Box,
  Text,
  PhoneIcon,
  Button
} from '@razorpay/blade/components';
import type { CountryCodeType } from '@razorpay/i18nify-js';

function AdvancedPhoneNumberExample() {
  const [phoneData, setPhoneData] = useState({
    phoneNumber: '',
    dialCode: '',
    country: 'US' as CountryCodeType
  });

  // List of allowed countries
  const allowedCountries: CountryCodeType[] = ['US', 'CA', 'GB', 'AU', 'IN'];

  const handlePhoneChange = ({ phoneNumber, dialCode, country, value }) => {
    setPhoneData({
      phoneNumber,
      dialCode,
      country
    });
    console.log('Raw input value:', value);
  };

  const handleSubmit = () => {
    alert(`Submitting phone: ${phoneData.phoneNumber}`);
  };

  return (
    <Box
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
      width="100%"
      maxWidth="450px"
    >
      <Text size="large" weight="semibold" marginBottom="spacing.4">
        Contact Information
      </Text>

      <Box marginBottom="spacing.5">
        <PhoneNumberInput
          label="Mobile Number"
          name="mobileNumber"
          leadingIcon={PhoneIcon}
          country={phoneData.country}
          onChange={handlePhoneChange}
          onCountryChange={({ country }) => {
            setPhoneData(prev => ({
              ...prev,
              country
            }));
          }}
          allowedCountries={allowedCountries}
          size="large"
          showDialCode={true}
          accessibilityLabel="Enter your mobile number"
          data-analytics-section="contact-form"
          data-analytics-field="mobile-number"
        />
      </Box>

      <Box marginBottom="spacing.4">
        <Text size="small">
          Selected country: {phoneData.country}, Dial code: {phoneData.dialCode}
        </Text>
      </Box>

      <Button onClick={handleSubmit} isDisabled={!phoneData.phoneNumber}>
        Continue
      </Button>
    </Box>
  );
}
```

### Without Country Selector or Dial Code

This example demonstrates how to use PhoneNumberInput with simplified configuration, hiding the country selector and dial code for specific use cases.

```tsx
import { useState } from 'react';
import { PhoneNumberInput, Box, Text } from '@razorpay/blade/components';

function SimplifiedPhoneNumberExample() {
  const [value, setValue] = useState('');

  return (
    <Box width="100%" maxWidth="400px">
      <Text size="medium" marginBottom="spacing.3">
        National Phone Number Input
      </Text>

      <PhoneNumberInput
        label="Phone Number (India)"
        defaultCountry="IN"
        onChange={({ value }) => setValue(value)}
        showCountrySelector={false}
        showDialCode={false}
        placeholder="Enter 10-digit number"
        helpText="For Indian numbers only (e.g., 9876543210)"
        size="medium"
        data-analytics-field="local-phone"
      />
    </Box>
  );
}
```

### Form Integration with Validation

This example shows how to integrate PhoneNumberInput into a form with proper validation and error handling.

```tsx
import { useState } from 'react';
import {
  PhoneNumberInput,
  TextInput,
  Box,
  Button
} from '@razorpay/blade/components';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import type { CountryCodeType } from '@razorpay/i18nify-js';

function ContactFormExample() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'IN' as CountryCodeType
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName ? 'First name is required' : '',
      lastName: !formData.lastName ? 'Last name is required' : '',
      phoneNumber: !formData.phoneNumber
        ? 'Phone number is required'
        : !isValidPhoneNumber(formData.phoneNumber, formData.country)
          ? 'Invalid phone number for selected country'
          : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      width="100%"
      maxWidth="500px"
      padding="spacing.5"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
    >
      <Box display="flex" gap="spacing.4">
        <TextInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={({ value }) => {
            setFormData(prev => ({ ...prev, firstName: value || '' }));
            if (value) setErrors(prev => ({ ...prev, firstName: '' }));
          }}
          validationState={errors.firstName ? 'error' : 'none'}
          errorText={errors.firstName}
          isRequired={true}
          data-analytics-field="first-name"
        />

        <TextInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={({ value }) => {
            setFormData(prev => ({ ...prev, lastName: value || '' }));
            if (value) setErrors(prev => ({ ...prev, lastName: '' }));
          }}
          validationState={errors.lastName ? 'error' : 'none'}
          errorText={errors.lastName}
          isRequired={true}
          data-analytics-field="last-name"
        />
      </Box>

      <PhoneNumberInput
        label="Phone Number"
        name="phoneNumber"
        country={formData.country}
        value={formData.phoneNumber}
        onChange={({ value, country }) => {
          setFormData(prev => ({
            ...prev,
            phoneNumber: value || '',
            country
          }));

          if (value && isValidPhoneNumber(value, country)) {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
          }
        }}
        onCountryChange={({ country }) => {
          setFormData(prev => ({ ...prev, country }));

          if (formData.phoneNumber && isValidPhoneNumber(formData.phoneNumber, country)) {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
          } else if (formData.phoneNumber) {
            setErrors(prev => ({ ...prev, phoneNumber: 'Invalid phone number for selected country' }));
          }
        }}
        validationState={errors.phoneNumber ? 'error' : 'none'}
        errorText={errors.phoneNumber}
        isRequired={true}
        size="medium"
        necessityIndicator="required"
        data-analytics-field="phone-number"
      />

      <Box marginTop="spacing.2">
        <Button onClick={handleSubmit} variant="primary" size="medium">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
```
