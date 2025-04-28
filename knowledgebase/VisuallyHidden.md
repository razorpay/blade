## Component Name

VisuallyHidden

## Description

The VisuallyHidden component is an accessibility-focused utility that makes content invisible to sighted users while keeping it accessible to screen readers. It's particularly useful for providing additional context to screen reader users without affecting the visual layout. This component implements the screen reader class technique from WebAIM, ensuring content is properly hidden visually but remains accessible to assistive technologies.

## TypeScript Types

The following types represent the props that the VisuallyHidden component accepts. These types allow you to properly configure the component for accessibility purposes.

```typescript
/**
 * Props for the VisuallyHidden component
 */
export type VisuallyHiddenProps = {
  /**
   * The content to be hidden visually but available to screen readers
   */
  children: React.ReactNode;
} & TestID;

/**
 * TestID type for component testing
 */
type TestID = {
  /**
   * ID for testing purposes
   */
  testID?: string;
};
```

## Example

Here's a comprehensive example demonstrating various use cases of the VisuallyHidden component:

### Accessibility-Enhanced Form Elements

This example shows how to use VisuallyHidden to enhance form accessibility by providing additional context to screen reader users while maintaining a clean visual interface.

```tsx
import { VisuallyHidden, Box, Text, Button, Checkbox, TextInput } from '@razorpay/blade/components';
import { InfoIcon } from '@razorpay/blade/components/Icons';

const AccessibleFormExample = () => {
  return (
    <Box padding="spacing.5">
      {/* Using VisuallyHidden with Checkbox for better labeling */}
      <Box marginBottom="spacing.4">
        <Checkbox>
          <VisuallyHidden>Accept terms and conditions for account creation</VisuallyHidden>I accept
          the terms
        </Checkbox>
      </Box>

      {/* Using VisuallyHidden to provide additional context for input fields */}
      <Box marginBottom="spacing.4">
        <Text>Card number</Text>
        <TextInput
          type="text"
          placeholder="1234 5678 9012 3456"
          aria-label="Enter 16-digit card number"
        />
        <VisuallyHidden testID="card-format-info">
          Enter your 16-digit card number without spaces. For example: 1234567890123456
        </VisuallyHidden>
      </Box>

      {/* Using VisuallyHidden with icon buttons for proper accessibility */}
      <Box display="flex" alignItems="center" gap="spacing.2">
        <Button variant="tertiary" icon={InfoIcon}>
          <VisuallyHidden>View detailed payment information and processing fees</VisuallyHidden>
        </Button>
        <Text>Payment Information</Text>
      </Box>

      {/* Using VisuallyHidden to provide status updates */}
      <Box marginTop="spacing.4">
        <Button variant="primary">
          Submit Payment
          <VisuallyHidden testID="payment-status">
            This will process your payment and cannot be undone
          </VisuallyHidden>
        </Button>
      </Box>
    </Box>
  );
};

export default AccessibleFormExample;
```

This example demonstrates:

- Using VisuallyHidden with form controls to provide detailed instructions
- Enhancing icon buttons with descriptive labels
- Adding context to checkboxes and interactive elements
- Using testID prop for testing purposes
- Providing additional status information for screen reader users
- Maintaining clean visual design while ensuring full accessibility
