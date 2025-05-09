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
  onChange?: ({ name, value }: { name?: string; value?: string }) => void;
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
  trailingButton?: React.ReactElement;
  trailingIcon?: React.ComponentType<any>;
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
import { TextInput, Box, EmailIcon } from '@razorpay/blade/components';

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
        leadingIcon={EmailIcon}
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
