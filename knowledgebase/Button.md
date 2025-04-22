## Component Name
Button

## Description
The Button component is a versatile interactive element used for triggering actions within an application. It supports multiple variants, sizes, and colors to accommodate different UI requirements and hierarchies. Buttons can contain text, icons, or both, and feature various states including disabled and loading to provide clear feedback to users during interactions.

## TypeScript Types
The following types represent the props that the Button component accepts. These types allow you to properly configure the button according to your needs.

```typescript
/**
 * Props for the Button component
 */
type ButtonProps = {
  /**
   * The content of the button
   */
  children?: React.ReactNode;

  /**
   * Button variant that defines the visual style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Color theme of the button
   * Note: Not all color and variant combinations are valid
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';

  /**
   * Icon to display in the button
   * Accepts an icon component from Blade
   */
  icon?: IconComponent;

  /**
   * Position of the icon relative to the button text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * The accessible label for the button
   * Required for icon-only buttons
   */
  accessibilityLabel?: string;

  /**
   * Function called when the button is clicked
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;

  /**
   * URL that the button should navigate to when clicked
   * When provided, the button renders as an anchor (<a>) element
   */
  href?: string;

  /**
   * Where to open the linked URL
   * Only applicable when href is provided
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Relationship between the current page and the linked URL
   * Only applicable when href is provided
   */
  rel?: string;

  /**
   * The type of the button element
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Ref object for the button element
   */
  ref?: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
} & StyledPropsBlade & TestID & DataAnalyticsAttribute;

/**
 * Type for icon components
 */
type IconComponent = React.ComponentType<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
}>;

/**
 * Type for test ID
 */
type TestID = {
  /**
   * ID used for testing
   */
  testID?: string;
};

/**
 * Type for data analytics attributes
 */
type DataAnalyticsAttribute = {
  /**
   * Data analytics attribute
   */
  'data-analytics'?: string;
};

/**
 * Styled props for blade components that can be applied to Button
 * Includes margin, padding, and other layout props
 */
type StyledPropsBlade = {
  // Various styling props like margin, padding, etc.
};
```

## Example
Here are comprehensive examples demonstrating various ways to use the Button component:

### Basic Button Variants, Sizes, and Colors

This example demonstrates different button variants, sizes, and colors in a payment form.

```tsx
import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Text, 
  Heading 
} from '@razorpay/blade/components';
import { 
  CreditCardIcon, 
  ArrowRightIcon, 
  ShieldIcon
} from '@razorpay/blade/components/Icons';

const PaymentFormExample = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle success
    }, 2000);
  };
  
  return (
    <Box 
      padding="spacing.5" 
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
      maxWidth="500px"
    >
      <Heading size="large" marginBottom="spacing.4">Complete Payment</Heading>
      
      <Text marginBottom="spacing.5">
        Please select a payment option and complete your transaction.
      </Text>
      
      {/* Primary button - Large size with icon on the right */}
      <Button
        variant="primary"
        color="primary"
        size="large"
        icon={CreditCardIcon}
        iconPosition="right"
        isFullWidth
        isLoading={isProcessing}
        onClick={handlePayment}
        marginBottom="spacing.4"
        testID="pay-button"
        data-analytics="payment-button-click"
      >
        Pay Now ₹1,999
      </Button>
      
      {/* Secondary button - Medium size */}
      <Button
        variant="secondary"
        color="primary"
        size="medium"
        icon={ArrowRightIcon}
        iconPosition="right"
        isFullWidth
        marginBottom="spacing.4"
        onClick={() => console.log('Save for later')}
      >
        Save for Later
      </Button>
      
      {/* Tertiary button - Small size with left icon */}
      <Button
        variant="tertiary"
        color="primary"
        size="small"
        icon={ShieldIcon}
        iconPosition="left"
        href="https://razorpay.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        marginBottom="spacing.5"
      >
        View Terms & Conditions
      </Button>
      
      {/* Extra small icon-only button */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="tertiary"
          size="xsmall"
          icon={CreditCardIcon}
          accessibilityLabel="View payment methods"
          onClick={() => console.log('View payment methods')}
        />
      </Box>
    </Box>
  );
};

export default PaymentFormExample;
```

### Interactive Button with State Management

This example demonstrates buttons with dynamic states and interactions.

```tsx
import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Text 
} from '@razorpay/blade/components';
import {
  CheckIcon,
  RefreshIcon
} from '@razorpay/blade/components/Icons';

const SimpleToggleExample = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleActivate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsActive(true);
    }, 1000);
  };
  
  const handleReset = () => {
    setIsActive(false);
  };
  
  return (
    <Box 
      padding="spacing.5" 
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
      maxWidth="400px"
    >
      <Text marginBottom="spacing.4">
        {isActive 
          ? "Feature is now active!" 
          : "Activate this feature to continue"
        }
      </Text>
      
      <Box display="flex" gap="spacing.3">
        {!isActive ? (
          <Button
            variant="primary"
            icon={CheckIcon}
            iconPosition="right"
            isLoading={isLoading}
            onClick={handleActivate}
          >
            Activate
          </Button>
        ) : (
          <Button
            variant="secondary"
            icon={RefreshIcon}
            iconPosition="left"
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SimpleToggleExample;