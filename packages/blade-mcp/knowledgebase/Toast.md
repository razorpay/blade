## Component Name

Toast

## Description

The Toast component displays temporary feedback messages in the interface. It can be used to provide notifications about completed actions, system events, or important information. Toasts appear in a small overlay and can be configured to automatically dismiss after a certain duration or require manual dismissal by the user.

## TypeScript Types

These types represent the props that the Toast component and its associated hooks accept.

```typescript
// Main Toast component props
type ToastProps = {
  /**
   * @default `informational`
   */
  type?: 'informational' | 'promotional';

  /**
   * Content of the toast
   */
  content: React.ReactNode;

  /**
   * @default `neutral`
   */
  color?: FeedbackColors; // 'neutral' | 'positive' | 'negative' | 'notice' | 'information'

  /**
   * Can be used to render an icon
   */
  leading?: React.ComponentType<any>;

  /**
   * If true, the toast will be dismissed after few seconds
   *
   * Duration for promotional toast is 8s
   * Duration for informational toast is 4s
   *
   * @default false
   */
  autoDismiss?: boolean;

  /**
   * Duration in milliseconds for which the toast will be visible
   *
   * @default 4000 for informational toast
   * @default 8000 for promotional toast
   */
  duration?: number;

  /**
   * Called when the toast is dismissed or duration runs out
   */
  onDismissButtonClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    toastId: string;
  }) => void;

  /**
   * Primary action of toast
   */
  action?: {
    text: string;
    onClick?: ({ event, toastId }: { event: ButtonProps['onClick']; toastId: string }) => void;
    isLoading?: boolean;
  };

  /**
   * Forwarded to react-hot-toast
   *
   * This can be used to programatically update toasts by providing an id
   */
  id?: string;
};

// Return type of useToast hook
type UseToastReturn = {
  toasts: BladeToast[]; // Currently active toasts
  show: (props: ToastProps) => string; // Show a toast and return its ID
  dismiss: (id?: string) => void; // Dismiss a specific toast or all toasts
};
```

## Example

### Basic Usage

This example demonstrates the simplest implementation of a Toast notification with success message using the useToast hook.

```tsx
import { ToastContainer, useToast, Box, Button } from '@razorpay/blade/components';

function BasicToastExample() {
  const toast = useToast();

  return (
    <Box>
      {/* Place ToastContainer at the root of your app */}
      <ToastContainer />

      <Button
        onClick={() => {
          toast.show({
            content: 'Payment successful',
            color: 'positive',
          });
        }}
      >
        Show Success Toast
      </Button>
    </Box>
  );
}
```

### Toast with Different Colors

This example shows how to create toasts with different color schemes to convey various types of messages like success, error, warning, and information.

```tsx
import { ToastContainer, useToast, Box, Button } from '@razorpay/blade/components';

function ColoredToastExample() {
  const toast = useToast();

  return (
    <Box display="flex" gap="spacing.4">
      <Button
        variant="tertiary"
        onClick={() => {
          toast.show({
            content: 'Payment successful',
            color: 'positive',
          });
        }}
      >
        Positive Toast
      </Button>

      <Button
        variant="tertiary"
        onClick={() => {
          toast.show({
            content: 'Unable to fetch merchant details',
            color: 'negative',
          });
        }}
      >
        Negative Toast
      </Button>

      <Button
        variant="tertiary"
        onClick={() => {
          toast.show({
            content: 'Your KYC is pending',
            color: 'notice',
          });
        }}
      >
        Notice Toast
      </Button>

      <Button
        variant="tertiary"
        onClick={() => {
          toast.show({
            content: 'Your transaction will be settled in 3 business days',
            color: 'information',
          });
        }}
      >
        Information Toast
      </Button>

      <Button
        variant="tertiary"
        onClick={() => {
          toast.show({
            content: 'Transaction has been initiated',
            color: 'neutral',
          });
        }}
      >
        Neutral Toast
      </Button>
    </Box>
  );
}
```

### Toast with Action Button

This example demonstrates how to add an interactive action button to a toast, along with custom dismissal behavior and event logging.

```tsx
import { ToastContainer, useToast, Box, Button } from '@razorpay/blade/components';

function ActionToastExample() {
  const toast = useToast();

  const showToastWithAction = () => {
    const toastId = toast.show({
      content: 'Payment successful',
      color: 'positive',
      autoDismiss: false,
      action: {
        text: 'View Details',
        onClick: ({ toastId }) => {
          console.log('View details clicked');
          toast.dismiss(toastId);
        },
      },
      onDismissButtonClick: ({ toastId }) => {
        console.log(`Toast ${toastId} dismissed`);
      },
    });

    console.log(`Toast ID: ${toastId}`);
  };

  return (
    <Box>
      <Button onClick={showToastWithAction}>Show Toast with Action</Button>
    </Box>
  );
}
```

### Promotional Toast

This example shows how to create a rich promotional toast with custom content, images, and multiple text elements for marketing announcements.

```tsx
import { ToastContainer, useToast, Box, Button, Heading, Text } from '@razorpay/blade/components';

function PromotionalToastExample() {
  const toast = useToast();

  const showPromotionalToast = () => {
    toast.show({
      type: 'promotional',
      content: (
        <Box display="flex" gap="spacing.3" flexDirection="column">
          <Heading>Introducing TurboUPI</Heading>
          <img
            loading="lazy"
            width="100%"
            height="100px"
            alt="Promotional Toast"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            src="https://example.com/promotional-image.png"
          />
          <Text weight="semibold">Lightning-fast payments with the new Razorpay Turbo UPI</Text>
          <Text size="xsmall">
            Turbo UPI allows end-users to complete their payment in-app, with no redirections or
            dependence on third-party UPI apps. With Turbo UPI, payments will be 5x faster with a
            significantly-improved success rate of 10%!
          </Text>
        </Box>
      ),
      action: {
        text: 'Try TurboUPI',
        onClick: ({ toastId }) => {
          console.log('Try TurboUPI clicked');
          toast.dismiss(toastId);
        },
      },
      onDismissButtonClick: ({ toastId }) => {
        console.log(`Promotional toast ${toastId} dismissed`);
      },
    });
  };

  return (
    <Box>
      <Button onClick={showPromotionalToast}>Show Promotional Toast</Button>
    </Box>
  );
}
```

### Comprehensive Example

This advanced example demonstrates multiple toast types, dynamic updating of toast content, handling loading states, and programmatic toast management.

```tsx
import {
  ToastContainer,
  useToast,
  Box,
  Button,
  Heading,
  Text,
  CheckCircleIcon,
} from '@razorpay/blade/components';

function ComprehensiveToastExample() {
  const toast = useToast();

  // Show a basic informational toast with auto-dismiss
  const showBasicToast = () => {
    toast.show({
      content: 'Your changes have been saved',
      color: 'positive',
      autoDismiss: true,
      duration: 4000, // 4 seconds
    });
  };

  // Show a toast with custom icon and action button
  const showCustomIconToast = () => {
    toast.show({
      content: 'Payment of ₹1,000 received',
      color: 'positive',
      leading: CheckCircleIcon,
      autoDismiss: false,
      action: {
        text: 'View Receipt',
        onClick: ({ toastId }) => {
          console.log('View receipt clicked');
          toast.dismiss(toastId);
        },
        isLoading: false, // Can be set to true when performing async action
      },
      onDismissButtonClick: ({ toastId }) => {
        console.log(`Toast ${toastId} dismissed`);
      },
    });
  };

  // Show a negative toast for errors
  const showErrorToast = () => {
    toast.show({
      content: 'Failed to process transaction',
      color: 'negative',
      autoDismiss: false,
      action: {
        text: 'Retry',
        onClick: ({ toastId }) => {
          // Update the same toast to show loading state
          toast.show({
            id: toastId,
            content: 'Retrying transaction...',
            color: 'notice',
            action: {
              text: 'Retry',
              isLoading: true,
            },
          });

          // Simulate API call
          setTimeout(() => {
            toast.show({
              id: toastId,
              content: 'Transaction processed successfully',
              color: 'positive',
              autoDismiss: true,
            });
          }, 2000);
        },
      },
    });
  };

  // Show a promotional toast with rich content
  const showPromotionalToast = () => {
    toast.show({
      type: 'promotional',
      content: (
        <Box display="flex" gap="spacing.3" flexDirection="column">
          <Heading>New Feature Available</Heading>
          <Text weight="semibold">Try our new instant settlement feature</Text>
          <Text size="xsmall">
            Get your funds instantly with our new settlement option. Available for all business
            accounts.
          </Text>
        </Box>
      ),
      action: {
        text: 'Enable Now',
        onClick: ({ toastId }) => {
          console.log('Enable now clicked');
          toast.dismiss(toastId);
        },
      },
    });
  };

  // Dismiss all toasts
  const dismissAllToasts = () => {
    toast.dismiss();
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <ToastContainer />

      <Box display="flex" gap="spacing.4">
        <Button onClick={showBasicToast}>Basic Toast</Button>

        <Button onClick={showCustomIconToast}>Custom Icon Toast</Button>

        <Button onClick={showErrorToast}>Error Toast</Button>

        <Button onClick={showPromotionalToast}>Promotional Toast</Button>

        <Button variant="tertiary" onClick={dismissAllToasts}>
          Dismiss All Toasts
        </Button>
      </Box>
    </Box>
  );
}
```
