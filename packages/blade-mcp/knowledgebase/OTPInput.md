## Component Name

OTPInput

## Description

OTPInput is a specialized input component for collecting one-time passwords or verification codes. It presents a sequence of individual input fields (typically 4 or 6) where each field accepts a single character. The component supports both controlled and uncontrolled modes, auto-focusing between fields, masking for secure inputs, and validation states to provide feedback during verification processes.

## TypeScript Types

The following types define the props that the OTPInput component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type FormInputOnEventWithIndex = ({
  name,
  value,
  inputIndex,
}: {
  name?: string;
  value?: string;
  inputIndex: number;
}) => void;

type OTPInputCommonProps = {
  /**
   * Determines the number of input fields to show for the OTP
   * @default 6
   */
  otpLength?: 4 | 6;

  /**
   * The callback function to be invoked when all the values of the OTPInput are filled
   */
  onOTPFilled?: ({ name, value }: { name?: string; value?: string }) => void;

  /**
   * Masks input characters in all the fields
   */
  isMasked?: boolean;

  /**
   * Determines what autoComplete suggestion type to show. Defaults to `oneTimeCode`.
   * It's not recommended to turn this off in favor of otp input practices.
   */
  autoCompleteSuggestionType?: 'none' | 'oneTimeCode';

  /**
   * The callback function to be invoked when one of the input fields gets focus
   */
  onFocus?: FormInputOnEventWithIndex;

  /**
   * The callback function to be invoked when one of the input fields is blurred
   */
  onBlur?: FormInputOnEventWithIndex;

  /* Common input props */
  label?: string;
  accessibilityLabel?: string;
  labelPosition?: 'top' | 'left';
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  name?: string;
  onChange?: ({ name, value }: { name?: string; value?: string }) => void;
  value?: string;
  isDisabled?: boolean;
  autoFocus?: boolean;
  keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'search' | 'send';
  keyboardType?: 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';
  placeholder?: string;
  testID?: string;
  size?: 'medium' | 'large';
} & DataAnalyticsAttribute &
  StyledPropsBlade;

type OTPInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
} & OTPInputCommonProps;

type OTPInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
} & OTPInputCommonProps;

type OTPInputProps = OTPInputPropsWithA11yLabel | OTPInputPropsWithLabel;
```

## Example

### Basic OTP Input with Validation

This example shows a basic OTP verification flow with different states based on the input validation.

```jsx
import { useState, useEffect } from 'react';
import { OTPInput, Box, Button, Text } from '@razorpay/blade/components';

function OTPVerificationExample() {
  const [otp, setOtp] = useState('');
  const [validationState, setValidationState] = useState('none');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Mock verification - in real apps, this would call your API
  const verifyOTP = () => {
    setIsVerifying(true);

    // Simulate API call delay
    setTimeout(() => {
      if (otp === '123456') {
        setValidationState('success');
      } else {
        setValidationState('error');
        setAttempts((prev) => prev + 1);
      }
      setIsVerifying(false);
    }, 1000);
  };

  // Reset validation state when OTP changes
  useEffect(() => {
    if (otp && validationState !== 'none') {
      setValidationState('none');
    }
  }, [otp]);

  return (
    <Box width="100%" maxWidth="568px">
      <OTPInput
        label="Verification Code"
        name="verificationCode"
        otpLength={6}
        value={otp}
        onChange={({ value }) => setOtp(value || '')}
        onOTPFilled={({ value }) => {
          console.log('OTP filled:', value);
          setOtp(value || '');
        }}
        validationState={validationState}
        errorText={
          attempts >= 3
            ? 'Too many incorrect attempts. Please request a new code.'
            : 'Incorrect verification code. Please try again.'
        }
        successText="Verification successful!"
        helpText="Enter the 6-digit code sent to your phone"
        autoFocus={true}
        size="medium"
        keyboardType="decimal"
        autoCompleteSuggestionType="oneTimeCode"
        data-analytics-section="verification"
        data-analytics-field="otp-input"
        marginBottom="spacing.4"
      />

      <Button
        onClick={verifyOTP}
        isLoading={isVerifying}
        isDisabled={otp.length !== 6 || isVerifying || attempts >= 3}
        marginBottom="spacing.3"
      >
        Verify
      </Button>

      {attempts > 0 && (
        <Text size="small" color="text.error.normal">
          Attempts: {attempts}/3
        </Text>
      )}
    </Box>
  );
}
```

### Secure PIN Input with Masking

This example demonstrates using OTPInput for PIN entry with masked input for enhanced security.

```jsx
import { useState, useRef } from 'react';
import { OTPInput, Box, Button, Text } from '@razorpay/blade/components';

function SecurePINEntryExample() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState('create');
  const confirmInputRef = useRef(null);

  const handlePinChange = ({ value }) => {
    setPin(value || '');
  };

  const handleConfirmPinChange = ({ value }) => {
    setConfirmPin(value || '');
  };

  const handleContinue = () => {
    if (step === 'create') {
      setStep('confirm');
      // Focus on first input of confirm PIN field
      setTimeout(() => {
        confirmInputRef.current?.[0]?.focus();
      }, 100);
    } else if (pin === confirmPin) {
      setStep('success');
    } else {
      setStep('mismatch');
    }
  };

  const resetForm = () => {
    setPin('');
    setConfirmPin('');
    setStep('create');
  };

  return (
    <Box
      width="100%"
      maxWidth="450px"
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <Text size="xlarge" weight="semibold" marginBottom="spacing.5">
        {step === 'success' ? 'PIN Created Successfully' : 'Create Transaction PIN'}
      </Text>

      {step !== 'success' && (
        <>
          <Box marginBottom="spacing.5">
            <OTPInput
              label="Enter PIN"
              name="pin"
              otpLength={4}
              value={pin}
              onChange={handlePinChange}
              onOTPFilled={handlePinChange}
              isMasked={true}
              validationState={step === 'mismatch' ? 'error' : 'none'}
              helpText="Create a 4-digit PIN for secure transactions"
              autoFocus={step === 'create'}
              size="large"
              labelPosition="top"
              autoCompleteSuggestionType="none"
              keyboardType="decimal"
              data-analytics-field="create-pin"
            />
          </Box>

          {(step === 'confirm' || step === 'mismatch') && (
            <Box marginBottom="spacing.5">
              <OTPInput
                ref={confirmInputRef}
                label="Confirm PIN"
                name="confirmPin"
                otpLength={4}
                value={confirmPin}
                onChange={handleConfirmPinChange}
                onOTPFilled={handleConfirmPinChange}
                isMasked={true}
                validationState={step === 'mismatch' ? 'error' : 'none'}
                errorText={step === 'mismatch' ? "PINs don't match" : undefined}
                helpText="Re-enter the same PIN to confirm"
                size="large"
                labelPosition="top"
                autoCompleteSuggestionType="none"
                keyboardType="decimal"
                data-analytics-field="confirm-pin"
              />
            </Box>
          )}

          <Button
            onClick={handleContinue}
            isDisabled={
              (step === 'create' && pin.length !== 4) ||
              (step === 'confirm' && confirmPin.length !== 4)
            }
            width="100%"
          >
            {step === 'confirm' || step === 'mismatch' ? 'Confirm PIN' : 'Continue'}
          </Button>
        </>
      )}

      {step === 'success' && (
        <Box textAlign="center">
          <Text marginBottom="spacing.4">
            Your PIN has been created. You can use it for future transactions.
          </Text>
          <Button onClick={resetForm} variant="secondary">
            Create New PIN
          </Button>
        </Box>
      )}
    </Box>
  );
}
```

### OTP Input with Ref and Programmatic Focus

This example shows how to use refs with OTPInput to programmatically control focus, useful for complex forms or when specific behaviors are needed.

```jsx
import { useState, useRef } from 'react';
import { OTPInput, Box, Button, Text } from '@razorpay/blade/components';

function ProgrammaticOTPExample() {
  const [otp, setOtp] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const otpInputRef = useRef(null);

  const handleFocusInput = (index) => {
    if (otpInputRef.current && otpInputRef.current[index]) {
      otpInputRef.current[index].focus();
      setFocusIndex(index);
    }
  };

  const handleClear = () => {
    setOtp('');
    // Focus on first input after clearing
    handleFocusInput(0);
  };

  return (
    <Box width="100%" maxWidth="568px">
      <Text marginBottom="spacing.4">Current focus position: {focusIndex + 1} of 6</Text>

      <OTPInput
        ref={otpInputRef}
        label="One-time Password"
        accessibilityLabel="Enter your one-time password"
        name="otpCode"
        value={otp}
        onChange={({ value }) => setOtp(value || '')}
        onFocus={({ inputIndex }) => setFocusIndex(inputIndex)}
        helpText="Use the buttons below to manipulate input focus"
        size="medium"
        otpLength={6}
        data-analytics-field="otp-with-ref"
        marginBottom="spacing.4"
      />

      <Box display="flex" gap="spacing.3" marginBottom="spacing.4">
        <Button onClick={() => handleFocusInput(0)} variant="secondary" size="small">
          Focus 1st
        </Button>
        <Button onClick={() => handleFocusInput(2)} variant="secondary" size="small">
          Focus 3rd
        </Button>
        <Button onClick={() => handleFocusInput(5)} variant="secondary" size="small">
          Focus Last
        </Button>
        <Button onClick={handleClear} variant="tertiary" size="small">
          Clear
        </Button>
      </Box>

      <Text size="small">
        Note: The OTPInput ref exposes an array of input references that can be used to
        programmatically focus specific inputs.
      </Text>
    </Box>
  );
}
```
