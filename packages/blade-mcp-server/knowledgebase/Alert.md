## Component Name

Alert

## Description

Alerts are messages that communicate information to users about any significant changes or explanations inside the system in a prominent way. They can include titles, descriptions, and actions, and come in different emphasis levels and colors to convey different types of information. Alerts can be dismissible and can span the full width of their container.

## TypeScript Types

The following types represent the props that the Alert component accepts. These types define all the available properties you can use when implementing the Alert component in your application.

```typescript
type PrimaryAction = {
  text: string;
  onClick: () => void;
};

type SecondaryActionButton = {
  text: string;
  onClick: () => void;
};

type SecondaryActionLinkButton = {
  text: string;
  href: string;
  onClick?: () => void;
  target?: string;
  /**
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

type AlertProps = {
  /**
   * Body content, pass text or JSX. Avoid passing components except `Link` to customize the content.
   */
  description: ReactChild;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render custom icon
   */
  icon?: IconComponent;

  /**
   * Can be set to `intense` for a more prominent look. Not to be confused with a11y emphasis.
   *
   * @default subtle
   */
  emphasis?: SubtleOrIntense;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   */
  color?: FeedbackColors;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: {
    /**
     * Renders a button (should **always** be present if `secondary` action is being used)
     */
    primary?: PrimaryAction;
    /**
     * Renders a Link button
     */
    secondary?: SecondaryAction;
  };
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
```

## Examples

### Standard Alert with Title, Description, and Actions

This example demonstrates a standard information alert with title, description, and both primary and secondary actions.

```tsx
import { Alert } from '@razorpay/blade/components';

function StandardAlertExample() {
  return (
    <Alert
      title="International Payments Only"
      description="Currently you can only accept payments in international currencies using PayPal. You cannot accept payments in INR (₹) using PayPal."
      color="information"
      emphasis="subtle"
      isDismissible={true}
      onDismiss={() => console.log('Alert dismissed')}
      actions={{
        primary: {
          text: 'Enable International Payments',
          onClick: () => console.log('Primary action clicked'),
        },
        secondary: {
          text: 'Learn More',
          href: 'https://razorpay.com/docs',
          target: '_blank',
        },
      }}
    />
  );
}
```

### High Emphasis Alerts

High emphasis alerts have a more prominent look with intense styling, useful for drawing more attention.

```tsx
import { Alert } from '@razorpay/blade/components';

function HighEmphasisAlertExample() {
  return (
    <Alert
      title="Unable to fetch merchants"
      description="There was some internal error while fetching the merchants list, this might also be due to the poor internet connection."
      color="negative"
      emphasis="intense"
      isDismissible={true}
      actions={{
        primary: {
          text: 'Try Refetching',
          onClick: () => console.log('Refetch clicked'),
        },
      }}
    />
  );
}
```

### Minimal Alerts

Alerts can be minimal with just a description and no title or actions.

```tsx
import { Alert } from '@razorpay/blade/components';

function MinimalAlertExample() {
  return (
    <Alert
      description="The payment was made 6 months ago, therefore you can't issue refund to this merchant."
      color="notice"
      emphasis="subtle"
      isDismissible={false}
    />
  );
}
```

### Alerts with Single Action

Alerts that provide only a primary action for users to respond.

```tsx
import { Alert } from '@razorpay/blade/components';

function SingleActionAlertExample() {
  return (
    <Alert
      title="Unable to fetch merchants"
      description="There was some internal error while fetching the merchants list, this might also be due to the poor internet connection."
      color="negative"
      emphasis="subtle"
      actions={{
        primary: {
          text: 'Try Refetching',
          onClick: () => console.log('Refetch clicked'),
        },
      }}
    />
  );
}
```

### Full Width Alerts

Full width alerts span the entire width of their container and are useful for full-bleed layouts.

```tsx
import { Alert, Box } from '@razorpay/blade/components';

function FullWidthAlertExample() {
  return (
    <Box position="relative" width="100%">
      <Alert
        title="System Notification"
        description="Currently you can only accept payments in international currencies using PayPal."
        color="information"
        isFullWidth={true}
        actions={{
          primary: {
            text: 'Acknowledge',
            onClick: () => console.log('Acknowledged'),
          },
          secondary: {
            text: 'Read Policy',
            href: 'https://razorpay.com/policy',
            target: '_blank',
          },
        }}
      />
    </Box>
  );
}
```
