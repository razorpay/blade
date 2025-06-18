## Component Name

TextInput

## Description

TextInput is a component for collecting user input in a text field. It supports various input types (text, email, number, url, etc.), validation states, and visual elements like icons, prefix/suffix text, and character counters. It can be used for names, email addresses, search queries, and other text-based inputs with optional validation and visual feedback.

## TypeScript Types

The following types define the props that the TextInput component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type TextInputSizes = 'medium' | 'large';

type Type = 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search';

type TextInputCommonProps = {
  label?: string;
  accessibilityLabel?: string;
  labelPosition?: 'top' | 'left';
  necessityIndicator?: 'optional' | 'required';
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  onChange?: ({
    name,
    value,
    rawValue,
  }: {
    name?: string;
    value?: string;
    rawValue?: string;
  }) => void;
  onFocus?: ({ name, value }: { name?: string; value?: string }) => void;
  onBlur?: ({ name, value }: { name?: string; value?: string }) => void;
  value?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  prefix?: string;
  suffix?: string;
  maxCharacters?: number;
  autoFocus?: boolean;
  keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'search' | 'send';
  autoCompleteSuggestionType?:
    | 'none'
    | 'name'
    | 'email'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | 'telephone'
    | 'postalCode'
    | 'countryName'
    | 'creditCardNumber'
    | 'creditCardCSC'
    | 'creditCardExpiry'
    | 'creditCardExpiryMonth'
    | 'creditCardExpiryYear'
    | 'on';
  onSubmit?: ({ name, value }: { name?: string; value?: string }) => void;
  onClick?: ({ name, value }: { name?: string; value?: string }) => void;
  size?: TextInputSizes;
  leadingIcon?: React.ComponentType<any>;
  /**
   * Leading React component (e.g., Icon, Badge, Dropdown, or custom component)
   * When provided, component will be shown at the beginning of the input
   * Commonly used for currency symbols, country codes, or dropdown selectors
   *
   * @example <BankIcon /> for financial inputs
   * @example <Badge>+91</Badge> for country codes
   * @example <Dropdown>...</Dropdown> for prefix selectors
   */
  leading?: React.ReactElement | React.ComponentType<any>;
  trailingButton?: React.ReactElement;
  trailingIcon?: React.ComponentType<any>;
  /**
   * Trailing React component (e.g., Icon, Badge, Dropdown, or custom component)
   * When provided, component will be shown at the end of the input
   * Commonly used for payment card icons, status indicators, or dropdown selectors
   *
   * @example <VisaIcon /> for payment card detection
   * @example <CheckIcon /> for validation status
   * @example <Dropdown>...</Dropdown> for suffix selectors
   */
  trailing?: React.ReactElement | React.ComponentType<any>;
  textAlign?: 'left' | 'center' | 'right';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  showClearButton?: boolean;
  onClearButtonClick?: () => void;
  isLoading?: boolean;
  icon?: React.ComponentType<any>;
  type?: Type;
  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
  testID?: string;
  /**
   * Format pattern where # represents input characters and other symbols act as delimiters
   * When provided, input will be automatically formatted and onChange will include rawValue
   *
   * **Note:**
   * 1. Format pattern should only contain # symbols and special characters as delimiters.
   *    Alphanumeric characters (letters and numbers) are not allowed in the format pattern.
   * 2. When format is provided, user input is restricted to alphanumeric characters only.
   *    Special characters and symbols will be filtered out automatically from user input.
   *
   * @example "#### #### #### ####" for card numbers
   * @example "##/##" for expiry dates
   * @example "(###) ###-####" for phone numbers
   */
  format?:
    | '#### #### #### ####'
    | '##/##'
    | '##/##/####'
    | '(###) ###-####'
    | '###-##-####'
    | '##:##'
    | '##:##:##'
    | '#### #### ####'
    | '###.###.###.###'
    | '## ## ####'
    | '##-###-##'
    | (string & {});
} & DataAnalyticsAttribute &
  StyledPropsBlade;

type TextInputPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
} & TextInputCommonProps;

type TextInputPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
} & TextInputCommonProps;

type TextInputProps = TextInputPropsWithA11yLabel | TextInputPropsWithLabel;
```

## Example

### Basic Usage with Validation States

This example demonstrates basic TextInput usage with different validation states.

```jsx
import { TextInput, Box } from '@razorpay/blade/components';

function TextInputExample() {
  const handleChange = ({ name, value }) => {
    console.log(`Input ${name} changed to ${value}`);
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <TextInput
        label="Full Name"
        placeholder="Enter your full name"
        name="fullName"
        onChange={handleChange}
        necessityIndicator="required"
        data-analytics-field="full-name"
        marginBottom="spacing.2"
      />

      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        name="email"
        type="email"
        validationState="error"
        errorText="Please enter a valid email address"
        data-analytics-field="email"
        marginBottom="spacing.2"
      />

      <TextInput
        label="Username"
        placeholder="Choose a username"
        name="username"
        validationState="success"
        successText="Username is available"
        data-analytics-field="username"
        marginBottom="spacing.2"
      />

      <TextInput
        label="Phone Number"
        placeholder="Enter your phone number"
        name="phone"
        type="telephone"
        isDisabled={true}
        defaultValue="+919876543210"
        data-analytics-field="phone"
      />
    </Box>
  );
}
```

### Feature-Rich TextInput Examples

This example showcases TextInput with combined visual and functional features.

```jsx
import {
  TextInput,
  Box,
  Link,
  SearchIcon,
  CreditCardIcon,
  InfoIcon,
} from '@razorpay/blade/components';

function FeatureRichTextInputExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <TextInput
        label="Search Products"
        placeholder="Search the catalog"
        name="search"
        type="search"
        leadingIcon={SearchIcon}
        showClearButton={true}
        maxCharacters={50}
        helpText="Search by product name or SKU"
        size="medium"
        data-analytics-action="search"
        marginBottom="spacing.3"
      />

      <TextInput
        label="Transaction Amount"
        placeholder="0.00"
        name="amount"
        type="number"
        prefix="₹"
        suffix=".00"
        textAlign="right"
        labelPosition="left"
        leadingIcon={CreditCardIcon}
        necessityIndicator="required"
        data-analytics-field="transaction-amount"
        marginBottom="spacing.3"
      />

      <TextInput
        label="Discount Code"
        placeholder="Enter code"
        name="discountCode"
        trailingButton={<Link>Apply</Link>}
        necessityIndicator="optional"
        isLoading={false}
        maxCharacters={10}
        data-analytics-field="discount-code"
        position="relative"
      />
    </Box>
  );
}
```

### TextInput Without Visible Labels

This example demonstrates how to create TextInput components without visible labels but with proper accessibility support using the accessibilityLabel prop, useful for compact UI designs.

```jsx
import { TextInput, Box, SearchIcon, UserIcon } from '@razorpay/blade/components';

function AccessibleTextInputExample() {
  return (
    <Box display="flex" gap="spacing.4">
      <TextInput
        accessibilityLabel="Search"
        placeholder="Search"
        name="search"
        leadingIcon={SearchIcon}
        showClearButton={true}
        type="search"
        data-analytics-action="search"
        marginRight="spacing.2"
      />

      <TextInput
        accessibilityLabel="First Name"
        placeholder="First Name"
        name="firstName"
        leadingIcon={UserIcon}
        data-analytics-field="first-name"
      />
    </Box>
  );
}
```

### Tagged Input for Multiple Values

This example demonstrates using TextInput to collect multiple values as tags.

```jsx
import { useState } from 'react';
import { TextInput, Box, MailIcon } from '@razorpay/blade/components';

function TaggedTextInputExample() {
  const [emails, setEmails] = useState(['user@example.com']);

  const handleTagChange = ({ tags }) => {
    setEmails(tags);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <Box width="100%">
      <TextInput
        label="Recipients"
        placeholder="Type email and press Enter"
        name="recipients"
        isTaggedInput={true}
        tags={emails}
        onTagChange={handleTagChange}
        helpText="Add multiple email addresses by pressing Enter after each one"
        validationState={emails.every(isValidEmail) ? 'success' : 'error'}
        errorText="Please enter valid email addresses"
        autoCompleteSuggestionType="email"
        leadingIcon={MailIcon}
        showClearButton={true}
        data-analytics-section="email-recipients"
        data-analytics-action="add-email"
        position="relative"
        zIndex={1}
      />
    </Box>
  );
}
```

### Leading and Trailing Elements

This example demonstrates TextInput with various leading and trailing elements including icons, badges, and dropdowns.

```jsx
import { useState } from 'react';
import {
  TextInput,
  Box,
  Text,
  Badge,
  BankIcon,
  GlobeIcon,
  CreditCardIcon,
  CheckIcon,
  Dropdown,
  DropdownOverlay,
  InputDropdownButton,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';

function LeadingTrailingElementsExample() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [upiId, setUpiId] = useState('');
  const [currencyAmount, setCurrencyAmount] = useState('');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {/* Leading Icon */}
      <TextInput
        label="UPI ID"
        placeholder="Enter your UPI ID"
        name="upiId"
        value={upiId}
        onChange={({ value }) => setUpiId(value || '')}
        leading={BankIcon}
        helpText="Enter your UPI ID for payments"
        data-analytics-field="upi-id"
      />

      {/* Leading Badge */}
      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        name="phoneNumber"
        value={phoneNumber}
        onChange={({ value }) => setPhoneNumber(value || '')}
        leading={<Badge>+91</Badge>}
        helpText="Enter 10-digit mobile number"
        type="telephone"
        data-analytics-field="phone-number"
      />

      {/* Leading Dropdown */}
      <TextInput
        label="Select Currency"
        placeholder="Enter amount"
        name="currencyAmount"
        value={currencyAmount}
        onChange={({ value }) => setCurrencyAmount(value || '')}
        leading={
          <Dropdown>
            <InputDropdownButton defaultValue="inr" icon={BankIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="INR" value="inr" />
                <ActionListItem title="USD" value="usd" />
                <ActionListItem title="EUR" value="eur" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
        type="number"
        helpText="Select currency and enter amount"
        data-analytics-field="currency-amount"
      />

      {/* Trailing Icon */}
      <TextInput
        label="Payment Method"
        placeholder="Card ending in 1234"
        name="paymentMethod"
        trailing={CreditCardIcon}
        isDisabled={true}
        defaultValue="**** **** **** 1234"
        helpText="Your saved payment method"
        data-analytics-field="payment-method"
      />

      {/* Trailing Badge */}
      <TextInput
        label="UPI ID"
        placeholder="Enter UPI handle"
        name="upiHandle"
        value={upiId}
        onChange={({ value }) => setUpiId(value || '')}
        trailing={<Badge>@oksbi</Badge>}
        helpText="Enter your UPI handle"
        data-analytics-field="upi-handle"
      />

      {/* Trailing Dropdown */}
      <TextInput
        label="UPI ID with Bank Selection"
        placeholder="98000xxxxx"
        name="upiWithBank"
        trailing={
          <Dropdown>
            <InputDropdownButton defaultValue="sbi" icon={BankIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="@oksbi" value="sbi" />
                <ActionListItem title="@hdfc" value="hdfc" />
                <ActionListItem title="@razorpay-airtelbank" value="razorpay" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
        helpText="Enter mobile number and select bank"
        data-analytics-field="upi-with-bank"
      />

      {/* Both Leading and Trailing */}
      <TextInput
        label="Website URL"
        placeholder="mywebsite"
        name="website"
        value={website}
        onChange={({ value }) => setWebsite(value || '')}
        leading={
          <Dropdown>
            <InputDropdownButton defaultValue="www" icon={GlobeIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="www." value="www" />
                <ActionListItem title="blog." value="blog" />
                <ActionListItem title="shop." value="shop" />
                <ActionListItem title="api." value="api" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
        trailing={
          <Dropdown>
            <InputDropdownButton defaultValue="com" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title=".com" value="com" />
                <ActionListItem title=".in" value="in" />
                <ActionListItem title=".org" value="org" />
                <ActionListItem title=".net" value="net" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        }
        helpText="Build your complete website URL"
        data-analytics-field="website-url"
      />

      {/* Dynamic Trailing Based on Validation */}
      <TextInput
        label="Username"
        placeholder="Enter username"
        name="username"
        trailing={website.length >= 3 ? CheckIcon : undefined}
        validationState={website.length >= 3 ? 'success' : 'none'}
        successText={website.length >= 3 ? 'Username is available' : undefined}
        helpText="Username must be at least 3 characters"
        onChange={({ value }) => setWebsite(value || '')}
        data-analytics-field="username"
      />
    </Box>
  );
}
```

### Formatted Input with Dynamic Trailing Icons

This example demonstrates TextInput with formatting patterns and dynamic trailing icons for payment card detection and other formatted inputs.

```jsx
import { useState } from 'react';
import {
  TextInput,
  Box,
  Text,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  CreditCardIcon,
  CheckIcon,
  ClockIcon,
} from '@razorpay/blade/components';

function FormattedTextInputExample() {
  // Card number formatting with dynamic icon
  const [cardNumber, setCardNumber] = useState('');
  const [rawCardNumber, setRawCardNumber] = useState('');
  const [cardIcon, setCardIcon] = useState(null);
  const [cardValidationState, setCardValidationState] = useState('none');

  // Date formatting
  const [expiryDate, setExpiryDate] = useState('');
  const [rawExpiryDate, setRawExpiryDate] = useState('');

  // Phone number formatting
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rawPhoneNumber, setRawPhoneNumber] = useState('');

  // Card type detection utility
  const detectCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) return type;
    }
    return 'unknown';
  };

  // Card icon mapping
  const getCardIcon = (cardType) => {
    const icons = {
      visa: VisaIcon,
      mastercard: MastercardIcon,
      amex: AmexIcon,
      unknown: CreditCardIcon,
    };
    return icons[cardType] || CreditCardIcon;
  };

  // Input validation utility
  const validateNumber = (value) => {
    return /^\d*$/.test(value);
  };

  const handleCardNumberChange = ({ value, rawValue }) => {
    const isValidNumber = validateNumber(rawValue || '');

    if (!isValidNumber && rawValue) {
      setCardValidationState('error');
    } else {
      setCardValidationState('none');

      // Detect card type and set icon
      if (rawValue && rawValue.length >= 1) {
        const cardType = detectCardType(rawValue);
        setCardIcon(getCardIcon(cardType));
      } else {
        setCardIcon(null);
      }
    }

    setCardNumber(value || '');
    setRawCardNumber(rawValue || '');
  };

  const handleExpiryChange = ({ value, rawValue }) => {
    const isValidNumber = validateNumber(rawValue || '');

    if (isValidNumber || !rawValue) {
      setExpiryDate(value || '');
      setRawExpiryDate(rawValue || '');
    }
  };

  const handlePhoneChange = ({ value, rawValue }) => {
    setPhoneNumber(value || '');
    setRawPhoneNumber(rawValue || '');
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {/* Payment Card Input with Dynamic Icon */}
      <Box>
        <TextInput
          label="Card Number"
          placeholder="Enter card number"
          name="cardNumber"
          value={cardNumber}
          format="#### #### #### ####"
          trailing={cardIcon}
          onChange={handleCardNumberChange}
          validationState={cardValidationState}
          errorText={cardValidationState === 'error' ? 'Please enter numbers only' : undefined}
          helpText="Try: 4111111111111111 (Visa), 5555555555554444 (Mastercard), 378282246310005 (Amex)"
          type="number"
          autoCompleteSuggestionType="creditCardNumber"
          data-analytics-field="card-number"
        />

        {/* Display formatted vs raw values */}
        <Box
          backgroundColor="surface.background.gray.moderate"
          padding="spacing.3"
          borderRadius="medium"
          marginTop="spacing.2"
        >
          <Text size="small" color="surface.text.gray.muted">
            Formatted: {cardNumber} | Raw: {rawCardNumber}
          </Text>
        </Box>
      </Box>

      {/* Date Input with Clock Icon */}
      <TextInput
        label="Expiry Date"
        placeholder="MM/YY"
        name="expiryDate"
        value={expiryDate}
        format="##/##"
        trailing={ClockIcon}
        onChange={handleExpiryChange}
        helpText="Enter expiry date in MM/YY format"
        type="number"
        autoCompleteSuggestionType="creditCardExpiry"
        data-analytics-field="expiry-date"
      />

      {/* Phone Number with Validation Icon */}
      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        name="phoneNumber"
        value={phoneNumber}
        format="(###) ###-####"
        trailing={rawPhoneNumber.length === 10 ? CheckIcon : undefined}
        onChange={handlePhoneChange}
        validationState={rawPhoneNumber.length === 10 ? 'success' : 'none'}
        successText={rawPhoneNumber.length === 10 ? 'Valid phone number' : undefined}
        helpText="Enter 10-digit US phone number"
        type="telephone"
        autoCompleteSuggestionType="telephone"
        data-analytics-field="phone-number"
      />

      {/* Multiple Format Patterns */}
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Text weight="semibold">Other Format Patterns:</Text>

        <TextInput
          label="Date (Full)"
          placeholder="DD/MM/YYYY"
          format="##/##/####"
          helpText="Full date format"
          type="number"
        />

        <TextInput
          label="Time (24-hour)"
          placeholder="HH:MM:SS"
          format="##:##:##"
          trailing={ClockIcon}
          helpText="24-hour time format"
          type="number"
        />

        <TextInput
          label="IP Address"
          placeholder="192.168.1.1"
          format="###.###.###.###"
          helpText="IPv4 address format"
          type="number"
        />

        <TextInput
          label="License Plate"
          placeholder="AB 12 CDEF"
          format="## ## ####"
          helpText="License plate format"
        />
      </Box>
    </Box>
  );
}
```
