## Component Name

Checkbox

## Description

Checkbox is a form control that allows users to select one or multiple options from a set of choices. It can be used individually or grouped together using CheckboxGroup for managing related options. Checkboxes support various states including checked, unchecked, indeterminate, disabled, and can display help text or error messages to guide users.

## TypeScript Types

The following types represent the props that the Checkbox component and its subcomponents accept. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Checkbox component
 */
type CheckboxProps = {
  /**
   * The label for the checkbox
   */
  children?: React.ReactNode;

  /**
   * The default state of the checkbox (uncontrolled)
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Error message to display when validation state is error
   */
  errorText?: string;

  /**
   * Help text to display below the checkbox
   */
  helpText?: string;

  /**
   * Whether the checkbox is checked (controlled)
   */
  isChecked?: boolean;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the checkbox is in an indeterminate state
   * @default false
   */
  isIndeterminate?: boolean;

  /**
   * Whether the checkbox is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Name of the checkbox for form submission
   */
  name?: string;

  /**
   * Callback fired when the checkbox state changes
   */
  onChange?: (event: { isChecked: boolean; name?: string; value?: string }) => void;

  /**
   * Size of the checkbox
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The validation state of the checkbox
   */
  validationState?: 'error' | 'none';

  /**
   * Value of the checkbox for form submission
   */
  value?: string;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the CheckboxGroup component
 */
type CheckboxGroupProps = {
  /**
   * The checkboxes to be grouped
   */
  children: React.ReactNode;

  /**
   * The default selected values (uncontrolled)
   */
  defaultValue?: string[];

  /**
   * Error message to display when validation state is error
   */
  errorText?: string;

  /**
   * Help text to display below the checkbox group
   */
  helpText?: string;

  /**
   * Whether the checkbox group is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the checkbox group is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * The label for the checkbox group
   */
  label: string;

  /**
   * Position of the label relative to the checkbox group
   */
  labelPosition?: 'top' | 'left';

  /**
   * Name of the checkbox group for form submission
   */
  name?: string;

  /**
   * Indicator for whether the checkbox group is required or optional
   * @default 'none'
   */
  necessityIndicator?: 'none' | 'required' | 'optional';

  /**
   * Callback fired when any checkbox in the group changes
   */
  onChange?: (event: { values: string[]; name?: string }) => void;

  /**
   * Size of the checkboxes in the group
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The validation state of the checkbox group
   */
  validationState?: 'error' | 'none';

  /**
   * The selected values (controlled)
   */
  value?: string[];
} & StyledPropsBlade &
  TestID;
```

## Examples

### Payment Setup Form with Checkboxes

This comprehensive example demonstrates a payment setup form with both single checkboxes and checkbox groups. It covers various use cases including:
- Controlled and uncontrolled checkboxes
- Required validation with error states
- Indeterminate state with "select all" functionality
- Different checkbox sizes
- Help text and error messaging
- Label positioning options for CheckboxGroup

```tsx
import React, { useState, useRef } from 'react';
import { Checkbox, CheckboxGroup, Box, Text, Button, Heading } from '@razorpay/blade/components';

const PaymentSetupForm = () => {
  // State for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State for terms agreement (single controlled checkbox)
  const [termsAgreed, setTermsAgreed] = useState(false);

  // State for notification preferences (single checkboxes)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Ref for focusing checkbox
  const termsCheckboxRef = useRef(null);

  // State for payment methods (checkbox group with select all functionality)
  const paymentMethods = ['credit_card', 'debit_card', 'netbanking', 'upi', 'wallet'];
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState(['credit_card', 'upi']);

  // Calculate select all states
  const allMethodsSelected = selectedPaymentMethods.length === paymentMethods.length;
  const someMethodsSelected = selectedPaymentMethods.length > 0 && !allMethodsSelected;
  const noMethodsSelected = selectedPaymentMethods.length === 0;
  // Handlers for payment methods
  const handleSelectAllMethods = (event) => {
    if (event.isChecked) {
      setSelectedPaymentMethods([...paymentMethods]);
    } else {
      setSelectedPaymentMethods([]);
    }
  };

  const handlePaymentMethodsChange = (event) => {
    setSelectedPaymentMethods(event.values);
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Focus terms checkbox if not agreed
    if (!termsAgreed) {
      termsCheckboxRef.current?.focus();
      return;
    }
    // If validation passes, submit form data
    if (termsAgreed && !noMethodsSelected) {
      console.log('Form submitted successfully!', {
        termsAgreed,
        emailNotifications,
        smsNotifications,
        selectedPaymentMethods,
      });

      alert('Payment setup completed successfully!');
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      gap="spacing.8"
      maxWidth="600px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="border.normal"
      borderRadius="radius.2"
    >
      <Heading size="large">Payment Gateway Setup</Heading>

      {/* Section 1: Basic Business Preferences (Uncontrolled Checkboxes) */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Business Preferences
        </Text>

        <Checkbox
          defaultChecked
          name="international_payments"
          value="enabled"
          onChange={(e) => console.log('International payments:', e.isChecked)}
          helpText="Enable payments from international customers"
        >
          Accept International Payments
        </Checkbox>
        <Checkbox
          defaultChecked={false}
          name="test_mode"
          value="enabled"
          onChange={(e) => console.log('Test mode:', e.isChecked)}
          helpText="Process transactions in test mode with no real money movement"
        >
          Enable Test Mode
        </Checkbox>
      </Box>

      {/* Section 2: Payment Methods (Checkbox Group with Select All) */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Payment Methods
        </Text>

        <Checkbox
          isChecked={allMethodsSelected}
          isIndeterminate={someMethodsSelected}
          onChange={handleSelectAllMethods}
          validationState={formSubmitted && noMethodsSelected ? 'error' : 'none'}
          size="medium"
        >
          Select All Payment Methods
        </Checkbox>
        <CheckboxGroup
          name="payment_methods"
          helpText="Choose which payment methods to offer your customers"
          errorText="At least one payment method must be selected"
          validationState={formSubmitted && noMethodsSelected ? 'error' : 'none'}
          value={selectedPaymentMethods}
          onChange={handlePaymentMethodsChange}
          size="small"
        >
          <Checkbox value="credit_card" helpText="Visa, Mastercard, American Express, etc.">
            Credit Cards
          </Checkbox>
          <Checkbox value="debit_card" helpText="Visa Debit, Maestro, RuPay, etc.">
            Debit Cards
          </Checkbox>
          <Checkbox value="netbanking" helpText="Direct bank transfers">
            Netbanking
          </Checkbox>
          <Checkbox value="upi" helpText="Google Pay, PhonePe, Paytm UPI, etc.">
            UPI
          </Checkbox>
          <Checkbox value="wallet" helpText="Paytm, Amazon Pay, PhonePe, etc.">
            Wallets
          </Checkbox>
        </CheckboxGroup>
      </Box>

      {/* Section 3: Notification Preferences (Controlled Checkboxes) */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Notification Preferences
        </Text>

        <CheckboxGroup
          label="How would you like to receive notifications?"
          name="notification_preferences"
          labelPosition="left"
          necessityIndicator="optional"
          helpText="Select your preferred notification channels"
        >
          <Checkbox
            value="email"
            isChecked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.isChecked)}
          >
            Email Notifications
          </Checkbox>
          <Checkbox
            value="sms"
            isChecked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.isChecked)}
          >
            SMS Notifications
          </Checkbox>
        </CheckboxGroup>
      </Box>

      {/* Section 4: Advanced Settings (Disabled Checkboxes) */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Advanced Settings
        </Text>

        <CheckboxGroup
          label="Enterprise Features"
          name="enterprise_features"
          isDisabled
          helpText="Contact your account manager to enable these features"
        >
          <Checkbox value="recurring_billing">Recurring Billing</Checkbox>
          <Checkbox value="payment_links">Payment Links</Checkbox>
          <Checkbox value="subscription_management">Subscription Management</Checkbox>
        </CheckboxGroup>
      </Box>
      {/* Section 5: Terms and Conditions (Required Checkbox with Ref) */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Checkbox
          ref={termsCheckboxRef}
          isChecked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.isChecked)}
          isRequired
          validationState={formSubmitted && !termsAgreed ? 'error' : 'none'}
          errorText="You must agree to the terms and conditions"
          helpText="By checking this box, you agree to our terms of service"
          size="large"
        >
          I agree to the Terms and Conditions
        </Checkbox>
      </Box>
      <Button type="submit" variant="primary" size="medium">
        Complete Setup
      </Button>
    </Box>
  );
};

export default PaymentSetupForm;
```

### Product Configuration Form

This example showcases a product configuration form with checkboxes for customizing a product purchase. It demonstrates different Checkbox sizes and validation states.

```tsx
import React, { useState } from 'react';
import { Checkbox, CheckboxGroup, Box, Text, Button, Heading } from '@razorpay/blade/components';

const ProductConfigurationForm = () => {
  // State for selected features
  const [selectedFeatures, setSelectedFeatures] = useState(['basic_reporting']);
  // State for add-ons
  const [giftWrap, setGiftWrap] = useState(false);
  const [expressShipping, setExpressShipping] = useState(false);
  const [insuranceAdded, setInsuranceAdded] = useState(false);

  // State for validation
  const [showValidation, setShowValidation] = useState(false);

  // Validate and submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (selectedFeatures.length > 0) {
      console.log('Configuration submitted:', {
        selectedFeatures,
        addOns: {
          giftWrap,
          expressShipping,
          insuranceAdded,
        },
      });

      alert('Product configured successfully!');
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      gap="spacing.6"
      maxWidth="550px"
    >
      <Heading size="medium">Configure Your Product</Heading>
      {/* Product Features Section */}
      <CheckboxGroup
        label="Choose Product Features"
        name="product_features"
        necessityIndicator="required"
        helpText="Select at least one feature package"
        errorText="You must select at least one feature"
        validationState={showValidation && selectedFeatures.length === 0 ? 'error' : 'none'}
        value={selectedFeatures}
        onChange={(e) => setSelectedFeatures(e.values)}
        isRequired
      >
        <Checkbox value="basic_reporting" helpText="Includes standard reports and basic analytics">
          Basic Reporting
        </Checkbox>
        <Checkbox
          value="advanced_analytics"
          helpText="Unlock detailed user behavior tracking and custom reports"
        >
          Advanced Analytics
        </Checkbox>
        <Checkbox value="multi_user" helpText="Add up to 5 team members with custom permissions">
          Multi-User Access
        </Checkbox>
        <Checkbox value="api_access" helpText="Connect with our API for custom integrations">
          API Access
        </Checkbox>
      </CheckboxGroup>

      {/* Add-ons Section with Various Checkboxes */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Optional Add-ons
        </Text>

        <Checkbox
          isChecked={giftWrap}
          onChange={(e) => setGiftWrap(e.isChecked)}
          name="gift_wrap"
          helpText="Items will be wrapped in premium packaging"
          size="small"
        >
          Gift Wrapping (+₹99)
        </Checkbox>
        <Checkbox
          isChecked={expressShipping}
          onChange={(e) => setExpressShipping(e.isChecked)}
          name="express_shipping"
          helpText="Guaranteed delivery within 24 hours"
          size="small"
        >
          Express Shipping (+₹199)
        </Checkbox>
        <Checkbox
          isChecked={insuranceAdded}
          onChange={(e) => setInsuranceAdded(e.isChecked)}
          name="insurance"
          helpText="Protection against damage or loss during shipping"
          size="small"
        >
          Add Shipping Insurance (+₹149)
        </Checkbox>
      </Box>

      {/* Disabled Options Based on Plan */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold">
          Enterprise Features
        </Text>
        <Text size="small" color="text.subdued">
          The following features are only available with Enterprise plan
        </Text>

        <Checkbox
          isDisabled
          name="white_label"
          helpText="Remove all Razorpay branding from customer-facing elements"
        >
          White Labeling
        </Checkbox>
        <Checkbox
          isDisabled
          name="priority_support"
          helpText="24/7 dedicated support team with 1-hour response time"
        >
          Priority Support
        </Checkbox>
      </Box>
      <Button type="submit" variant="primary">
        Save Configuration
      </Button>
    </Box>
  );
};

export default ProductConfigurationForm;
```
