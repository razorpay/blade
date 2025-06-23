# InputGroup

## Description

InputGroup is a form layout component that organizes related form inputs with consistent spacing and alignment. It provides a structured way to group multiple input fields together with optional labels, help text, and validation states. The component supports responsive layouts and can handle complex form structures with multiple rows and column distributions. InputGroup automatically manages the context for child inputs, ensuring consistent sizing and disabled states across all grouped inputs.

## TypeScript Types

Below are the props that the InputGroup component and its subcomponents accept:

```typescript
import type { DataAnalyticsAttribute } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput/BaseInput';
import type { MotionMetaProp } from '~components/BaseMotion';

/**
 * Props for the InputGroup component.
 */
type InputGroupProps = {
  /**
   * Label for the entire input group.
   */
  label?: string;
  /**
   * Position of the label relative to the group.
   *
   * @default 'top'
   */
  labelPosition?: BaseInputProps['labelPosition'];
  /**
   * Controls the size of the input group and its child inputs.
   *
   * @default 'medium'
   */
  size?: BaseInputProps['size'];
  /**
   * Help text displayed at the bottom of the group.
   */
  helpText?: string;
  /**
   * Error message that appears when validationState is 'error'.
   */
  errorText?: string;
  /**
   * Success message that appears when validationState is 'success'.
   */
  successText?: string;
  /**
   * Current validation state of the input group.
   *
   * @default 'none'
   */
  validationState?: BaseInputProps['validationState'];
  /**
   * Disables all inputs within the group.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Should be InputRow components or other valid inputs.
   */
  children: React.ReactNode;
  /**
   * Test ID for automation
   */
  testID?: string;
} & DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

/**
 * Props for the InputRow component.
 */
type InputRowProps = {
  /**
   * CSS grid template columns value (e.g., "1fr 2fr" or "200px 1fr").
   * Controls how space is distributed between child inputs.
   */
  gridTemplateColumns?: string;
  /**
   * Input components to render in this row.
   */
  children: React.ReactNode;
  /**
   * Test ID for automation
   */
  testID?: string;
};

type InputGroupContextType = {
  isInsideInputGroup: boolean;
  isDisabled?: BaseInputProps['isDisabled'];
  size?: BaseInputProps['size'];
};
```

## Examples

### Payment Form with Validation

Create a payment information form with format validation, different input types, and error handling.

```jsx
import { InputGroup, InputRow } from '@razorpay/blade/components/InputGroup';
import { TextInput } from '@razorpay/blade/components/Input/TextInput';
import { PasswordInput } from '@razorpay/blade/components/Input/PasswordInput';
import { Button } from '@razorpay/blade/components/Button';
import { Box } from '@razorpay/blade/components/Box';
import { useState } from 'react';

function PaymentForm() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value || '' }));
  };

  const isFieldEmpty = (field) => !formData[field] || formData[field].trim() === '';
  const hasErrors = Object.values(formData).some((value) => !value || value.trim() === '');

  return (
    <Box>
      <InputGroup
        label="Payment Information"
        helpText="Enter your card details to process payment"
        size="large"
        labelPosition="top"
        validationState={hasErrors ? 'error' : 'success'}
        errorText={hasErrors ? 'Please fill in all required fields' : ''}
        successText={!hasErrors ? 'All fields completed' : ''}
        testID="payment-form"
      >
        <InputRow gridTemplateColumns="1fr">
          <TextInput
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            format="#### #### #### ####"
            onChange={({ value }) => handleInputChange('cardNumber', value)}
            validationState={isFieldEmpty('cardNumber') ? 'error' : 'success'}
            errorText={isFieldEmpty('cardNumber') ? 'Card number is required' : ''}
            accessibilityLabel="Enter your credit card number"
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr 1fr">
          <TextInput
            label="Expiry Date"
            placeholder="MM/YY"
            value={formData.expiryDate}
            format="##/##"
            onChange={({ value }) => handleInputChange('expiryDate', value)}
            validationState={isFieldEmpty('expiryDate') ? 'error' : 'success'}
            errorText={isFieldEmpty('expiryDate') ? 'Expiry date is required' : ''}
            accessibilityLabel="Enter card expiry date"
          />
          <PasswordInput
            label="CVV"
            placeholder="123"
            value={formData.cvv}
            maxCharacters={3}
            onChange={({ value }) => handleInputChange('cvv', value)}
            validationState={isFieldEmpty('cvv') ? 'error' : 'success'}
            errorText={isFieldEmpty('cvv') ? 'CVV is required' : ''}
            accessibilityLabel="Enter card CVV"
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <TextInput
            label="Cardholder Name"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={({ value }) => handleInputChange('cardholderName', value)}
            validationState={isFieldEmpty('cardholderName') ? 'error' : 'success'}
            errorText={isFieldEmpty('cardholderName') ? 'Cardholder name is required' : ''}
            accessibilityLabel="Enter cardholder name"
          />
        </InputRow>
      </InputGroup>
      <Box display="flex" justifyContent="flex-end" marginTop="spacing.4">
        <Button variant="primary" isDisabled={hasErrors}>
          Submit Payment
        </Button>
      </Box>
    </Box>
  );
}
```

### Business Onboarding Form with Responsive Layout

Create a comprehensive business onboarding form with conditional layouts that adapt to different screen sizes.

```jsx
import { InputGroup, InputRow } from '@razorpay/blade/components/InputGroup';
import { TextInput } from '@razorpay/blade/components/Input/TextInput';
import { SelectInput } from '@razorpay/blade/components/Input/DropdownInputTriggers';
import { Dropdown, DropdownOverlay } from '@razorpay/blade/components/Dropdown';
import { ActionList, ActionListItem } from '@razorpay/blade/components/ActionList';
import { Button } from '@razorpay/blade/components/Button';
import { Box } from '@razorpay/blade/components/Box';
import { useIsMobile } from '@razorpay/blade/utils/useIsMobile';

function BusinessOnboardingForm() {
  const isMobile = useIsMobile();

  return (
    <Box>
      <InputGroup
        label="Merchant Onboarding"
        helpText="Complete your business details to start accepting payments"
        size="medium"
        labelPosition="left"
        validationState="none"
        testID="business-onboarding"
      >
        {isMobile ? (
          <>
            <InputRow gridTemplateColumns="1fr">
              <TextInput
                placeholder="Business Name"
                label="Business Name"
                accessibilityLabel="Enter your business name"
              />
            </InputRow>
            <InputRow gridTemplateColumns="1fr">
              <TextInput
                placeholder="Trading Name"
                label="Trading Name"
                accessibilityLabel="Enter your trading name"
              />
            </InputRow>
          </>
        ) : (
          <InputRow gridTemplateColumns="1fr 1fr">
            <TextInput
              placeholder="Business Name"
              label="Business Name"
              accessibilityLabel="Enter your business name"
            />
            <TextInput
              placeholder="Trading Name"
              label="Trading Name"
              accessibilityLabel="Enter your trading name"
            />
          </InputRow>
        )}
        <InputRow gridTemplateColumns="1fr">
          <TextInput
            placeholder="Business Email"
            label="Business Email"
            accessibilityLabel="Enter your business email address"
          />
        </InputRow>
        {isMobile ? (
          <>
            <InputRow gridTemplateColumns="1fr">
              <TextInput
                placeholder="PAN Number"
                label="Business PAN"
                accessibilityLabel="Enter business PAN number"
              />
            </InputRow>
            <InputRow gridTemplateColumns="1fr">
              <TextInput
                placeholder="GST Number"
                label="GSTIN"
                accessibilityLabel="Enter GST identification number"
              />
            </InputRow>
          </>
        ) : (
          <InputRow gridTemplateColumns="1fr 1fr">
            <TextInput
              placeholder="PAN Number"
              label="Business PAN"
              accessibilityLabel="Enter business PAN number"
            />
            <TextInput
              placeholder="GST Number"
              label="GSTIN"
              accessibilityLabel="Enter GST identification number"
            />
          </InputRow>
        )}
        <InputRow gridTemplateColumns="1fr">
          <Dropdown selectionType="single">
            <SelectInput
              label="Business Category"
              placeholder="Select Business Category"
              name="businessCategory"
              onChange={({ name, values }) => console.log({ name, values })}
              accessibilityLabel="Select your business category"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="E-commerce" value="ecommerce" />
                <ActionListItem title="Education" value="education" />
                <ActionListItem title="Healthcare" value="healthcare" />
                <ActionListItem title="Food & Beverage" value="food_beverage" />
                <ActionListItem title="Financial Services" value="financial" />
                <ActionListItem title="Others" value="others" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </InputRow>
      </InputGroup>
      <Box display="flex" justifyContent="flex-end" marginTop="spacing.4">
        <Button variant="primary">Start Onboarding</Button>
      </Box>
    </Box>
  );
}
```
