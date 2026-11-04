## Component Name

Toast

## Description

The Toast component displays temporary feedback messages in the interface. It can be used to provide notifications about completed actions, system events, or important information. Toasts appear in a small overlay and can be configured to automatically dismiss after a certain duration or require manual dismissal by the user.

## TypeScript Types

These types represent the props that the Toast component and its associated hooks accept.

```typescript
import type React from 'react';

type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

type IconComponent = React.ComponentType<{
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  color?: string;
}>;

type ToastActionCommon = {
  text: string;
  /**
   * Icon of the action (web only)
   */
  icon?: IconComponent;
  /**
   * Position of the icon (web only)
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
};

// Renders a Button (default)
type ToastButtonAction = ToastActionCommon & {
  variant?: 'button';
  onClick?: ({ event, toastId }: { event: React.MouseEvent<HTMLButtonElement>; toastId: string }) => void;
  isLoading?: boolean;
};

// Renders a Link (web only). Renders an anchor when `href` is given, else a button element.
type ToastLinkAction = ToastActionCommon & {
  variant: 'link';
  // With `href`, the event comes from an anchor element
  onClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>;
    toastId: string;
  }) => void;
  href?: string;
  target?: string;
  /**
   * When `target` is `_blank`, `Link` sets this to `noreferrer noopener`
   */
  rel?: string;
};

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
   * Time in ms of the intro motion that `content` plays. Blade does not animate the content.
   * Blade holds the action and the progress bar until the intro ends, then fades them in.
   * With `autoDismiss`, the timer and the progress bar also start after the intro.
   *
   * Works only on promotional toasts (web only).
   *
   * @default 0
   */
  introDuration?: number;

  /**
   * Shows a 2px progress bar on the bottom edge of the toast for the time left.
   * The bar pauses with the timer.
   *
   * Works only on promotional toasts with `autoDismiss` (web only).
   *
   * @default false
   */
  showProgressBar?: boolean;

  /**
   * Primary action of toast. Renders a `Button` by default.
   * Set `variant: 'link'` to render a `Link`.
   */
  action?: ToastButtonAction | ToastLinkAction;

  /**
   * Forwarded to react-hot-toast
   *
   * This can be used to programatically update toasts by providing an id
   */
  id?: string;
};

// Return type of useToast hook
// A toast that is currently in the toast queue
type BladeToast = ToastProps & { id: string; visible: boolean };

type UseToastReturn = {
  toasts: BladeToast[]; // Currently active toasts
  show: (props: ToastProps) => string; // Show a toast and return its ID
  dismiss: (id?: string) => void; // Dismiss a specific toast or all toasts
};
```

## Usage Guidelines

**Do**

- Use `Toast` for brief, non-critical feedback after user actions (e.g., "Item saved", "Payment successful").
- Use the imperative `useToast()` hook API — call `toast.show()` and `toast.dismiss()`.
- Place `<ToastContainer />` once at the root of your app, outside nested `BladeProvider` instances.
- Use `type="informational"` (default) with auto-dismiss for transient confirmations.
- Use `type="promotional"` for richer content that requires user acknowledgment.
- Keep action labels short — a single verb like "Undo" or "Retry".
- Use `showProgressBar` on a promotional toast with `autoDismiss` to show the time left. The timer and the bar pause while the pointer is over the toast or focus is inside it.
- Use `introDuration` when the promotional `content` plays its own intro. Set it to the length of the intro. The action and the progress bar fade in when the intro ends, and the timer starts then.
- Keep every frame of multi-frame `content` the same height, for example with one grid cell for all frames. The toast measures its height once, at show.
- Use `action.variant: 'link'` with `href` for a call to action that opens a page.
- Use semantic `color` values to match the feedback intent (`positive` for success, `negative` for errors).

**Don't**

- Don't use `Toast` for critical errors that need explicit acknowledgment — use `Alert` instead.
- Don't use `Toast` for persistent, inline status messages — use `Alert` for in-page context.
- Don't stack multiple promotional toasts — only one can be active at a time.
- Don't render `ToastContainer` inside `BladeProvider` children if you have nested providers — place it at the app root.
- Don't rely on `onDismissButtonClick` for detecting auto-dismiss — it only fires on manual dismiss.
- Don't use long sentences as toast content — keep messages concise and scannable.
- Don't use `introDuration` or `showProgressBar` on informational toasts — they work only on promotional toasts. `showProgressBar` also needs `autoDismiss`.

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

### Promotional Toast with Progress Bar

This example shows a promotional toast that auto dismisses with a progress bar. Pointer over the toast or focus inside it pauses the timer and the bar.

```tsx
import { ToastContainer, useToast, Box, Button, Heading, Text } from '@razorpay/blade/components';

function PromotionalProgressBarExample() {
  const toast = useToast();

  return (
    <Box>
      <ToastContainer />
      <Button
        onClick={() => {
          toast.show({
            type: 'promotional',
            autoDismiss: true,
            duration: 8000,
            showProgressBar: true,
            content: (
              <Box display="flex" gap="spacing.2" flexDirection="column">
                <Heading size="small">Your monthly report is ready</Heading>
                <Text size="small">See payments, refunds and settlements of last month.</Text>
              </Box>
            ),
            action: {
              text: 'View report',
              onClick: ({ toastId }) => toast.dismiss(toastId),
            },
          });
        }}
      >
        Show Promotional Toast
      </Button>
    </Box>
  );
}
```

### Promotional Toast with Link Action

This example renders the action as a `Link` with an icon on the right. The link uses the `small` size.

```tsx
import {
  ToastContainer,
  useToast,
  Box,
  Button,
  Heading,
  Text,
  ArrowRightIcon,
} from '@razorpay/blade/components';

function PromotionalLinkActionExample() {
  const toast = useToast();

  return (
    <Box>
      <ToastContainer />
      <Button
        onClick={() => {
          toast.show({
            type: 'promotional',
            content: (
              <Box display="flex" gap="spacing.2" flexDirection="column">
                <Heading size="small">Reports are now faster</Heading>
                <Text size="small">Download any report in a few seconds.</Text>
              </Box>
            ),
            action: {
              text: 'See what is new',
              variant: 'link',
              href: 'https://example.com/whats-new',
              target: '_blank',
              icon: ArrowRightIcon,
              iconPosition: 'right',
            },
          });
        }}
      >
        Show Promotional Toast
      </Button>
    </Box>
  );
}
```

### Promotional Toast with Intro

This example plays an intro frame inside `content`, then shows the main frame. `introDuration` matches the intro, so the timer and the bar start with the main frame. Both frames sit in one grid cell, so the toast height does not change.

```tsx
import React from 'react';
import {
  ToastContainer,
  useToast,
  useTheme,
  Box,
  Button,
  Heading,
  Text,
} from '@razorpay/blade/components';

const IntroContent = ({ introDuration }: { introDuration: number }) => {
  const [isIntroDone, setIsIntroDone] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsIntroDone(true), introDuration);
    return () => clearTimeout(timeout);
  }, [introDuration]);

  return (
    <Box display="grid">
      <Box gridArea="1 / 1" visibility={isIntroDone ? 'hidden' : 'visible'}>
        <Heading size="large">Meet your new reports page</Heading>
      </Box>
      <Box gridArea="1 / 1" visibility={isIntroDone ? 'visible' : 'hidden'}>
        <Heading size="small">Reports are now faster</Heading>
        <Text size="small">Download any report in a few seconds.</Text>
      </Box>
    </Box>
  );
};

function PromotionalIntroExample() {
  const toast = useToast();
  const { theme } = useTheme();
  const introDuration = theme.motion.delay.long;

  return (
    <Box>
      <ToastContainer />
      <Button
        onClick={() => {
          toast.show({
            type: 'promotional',
            autoDismiss: true,
            showProgressBar: true,
            introDuration,
            content: <IntroContent introDuration={introDuration} />,
          });
        }}
      >
        Show Promotional Toast
      </Button>
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
