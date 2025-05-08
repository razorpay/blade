## Component Name

PasswordInput

## Description

PasswordInput is a secure input field designed for entering passwords. It masks the input by default and provides an optional reveal button to toggle visibility, enhancing user experience and security. The component supports accessibility features, validation states, character limits, and integrates seamlessly with browser autofill and password managers. It is highly configurable, supporting various sizes, disabled and required states, and can be used in both controlled and uncontrolled forms.

## TypeScript Types

Below are the TypeScript types for the `PasswordInput` component and its relevant subcomponents. These types represent the props that the component and its subcomponents accept. Refer to these when using `PasswordInput` in your application to ensure correct usage and type safety.

### PasswordInput Types

```ts
// PasswordInput.tsx

export type PasswordInputProps = (
  | {
      /**
       * Label to be shown for the input field
       */
      label?: undefined;
      /**
       * Accessibility label for the input
       */
      accessibilityLabel: string;
    }
  | {
      /**
       * Label to be shown for the input field
       */
      label: string;
      /**
       * Accessibility label for the input
       */
      accessibilityLabel?: string;
    }
) & {
  /**
   * Shows a reveal button to toggle password visibility
   * @default true
   */
  showRevealButton?: boolean;
  /**
   * Displays asterisk (`*`) when `isRequired` is enabled
   * @default none
   */
  necessityIndicator?: 'required' | 'none';
  /**
   * Determines what autoComplete suggestion type to show. Defaults to using platform heuristics.
   * It's not recommended to turn this off in favor of safe password practices.
   * Providing `password` or `newPassword` is more informative to the platform for browser autofill or password managers.
   * **Note**: Using `newPassword` on iOS has some [known issue](https://github.com/facebook/react-native/issues/21911) on React Native
   */
  autoCompleteSuggestionType?: 'none' | 'password' | 'newPassword';
  labelPosition?: 'left' | 'top';
  maxCharacters?: number;
  validationState?: 'success' | 'error' | 'none';
  errorText?: string;
  successText?: string;
  helpText?: string;
  isDisabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (args: { name?: string; value?: string }) => void;
  onBlur?: (args: { name?: string; value?: string }) => void;
  onSubmit?: (args: { name?: string; value?: string }) => void;
  onFocus?: (args: { name?: string; value?: string }) => void;
  name?: string;
  autoFocus?: boolean;
  keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
  testID?: string;
  size?: 'medium' | 'large';
  alignSelf?: string;
  display?: string;
  justifySelf?: string;
  placeSelf?: string;
  order?: number;
  position?: string;
  zIndex?: number;
  gridColumn?: string;
  gridColumnStart?: string;
  gridColumnEnd?: string;
  gridRow?: string;
  gridRowStart?: string;
  gridRowEnd?: string;
  gridArea?: string;
  margin?: string;
  marginX?: string;
  marginY?: string;
  marginBottom?: string;
  marginTop?: string;
  marginRight?: string;
  marginLeft?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  visibility?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;
```

### CharacterCounter Subcomponent

```ts
// CharacterCounter.tsx

type CharacterCounterProps = {
  currentCount: number;
  maxCount: number;
  size?: 'medium' | 'large';
};
```

### IconButton Subcomponent

```ts
// IconButton.tsx

type IconButtonProps = {
  icon: React.ComponentType<any>;
  size?: 'small' | 'medium' | 'large';
  emphasis?: 'intense' | 'subtle';
  accessibilityLabel: string;
  isDisabled?: boolean;
  _tabIndex?: number;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement> | import('react-native').GestureResponderEvent,
  ) => void;
  isHighlighted?: boolean;
  [key: `data-analytics-${string}`]: string;
  // StyledPropsBlade and BladeCommonEvents are also supported
};
```

## Example

### Comprehensive PasswordInput Usage

This example demonstrates a practical usage of `PasswordInput` with various props combined, including accessibility, validation, character limit, disabled state, required state, and autofill hints. It also shows how to use the component in a controlled form scenario.

```tsx
import React, { useState, useRef } from 'react';
import { PasswordInput } from '@razorpay/blade/components';
import { Button } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

export default function PasswordInputExample() {
  const [password, setPassword] = useState('');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" maxWidth="400px">
      <PasswordInput
        label="Create Password"
        accessibilityLabel="Password"
        helpText="Password must be at least 8 characters."
        placeholder="Enter a strong password"
        maxCharacters={16}
        value={password}
        onChange={({ value }) => setPassword(value || '')}
        validationState={
          password.length > 0 && password.length < 8
            ? 'error'
            : password.length >= 8
            ? 'success'
            : 'none'
        }
        errorText={password.length > 0 && password.length < 8 ? 'Password is too short' : ''}
        successText={password.length >= 8 ? 'Strong password' : ''}
        showRevealButton
        isRequired
        necessityIndicator="required"
        autoCompleteSuggestionType="newPassword"
        size="large"
        testID="password-input"
        marginBottom="spacing.4"
      />

      <PasswordInput
        accessibilityLabel="Password without visible label"
        placeholder="No label visible"
        helpText="This input uses only accessibility label."
      />
    </Box>
  );
}
```
