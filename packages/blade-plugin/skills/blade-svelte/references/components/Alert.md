## Component Name

Alert

## Description

Alert is an inline, contextual message that tells users about a significant change, an error or an explanation inside a page section. It supports a title, a text or snippet description, a primary button and a secondary link action, and comes in semantic colors with subtle or intense emphasis. Alerts are dismissible by default and can span the full width of their container.

## Important Constraints

- `description` is required; pass a string or a snippet
- The leading icon is chosen from `color` (`CheckCircleIcon` for positive, `AlertOctagonIcon` for negative, `AlertTriangleIcon` for notice, `InfoIcon` otherwise) unless `icon` is passed
- Dismissing hides the Alert through internal state; there is no prop to show it again, so re-mount it (for example with `{#if}`) to bring it back
- `negative` and `notice` alerts get `role="alert"`; other colors get `role="status"`
- Partial port: the React `maxWidth` prop is not available; non-full-width alerts are capped at 584px

## TypeScript Types

These are the props the Alert component accepts.

```typescript
type AlertColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive' | 'primary';
type AlertEmphasis = 'subtle' | 'intense';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. InfoIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type PrimaryAction = {
  /** Button label text */
  text: string;
  /** Callback when button is clicked */
  onClick: () => void;
};

type SecondaryActionButton = {
  /** Link button label text */
  text: string;
  /** Callback when link button is clicked */
  onClick: () => void;
};

type SecondaryActionLinkButton = {
  /** Link button label text */
  text: string;
  /** URL to navigate to */
  href: string;
  /** Optional click callback */
  onClick?: () => void;
  /** Link target attribute */
  target?: string;
  /**
   * Link rel attribute.
   * When `target` is set to `_blank` this is automatically set to `noopener noreferrer`
   */
  rel?: string;
};

type SecondaryAction = SecondaryActionButton | SecondaryActionLinkButton;

type AlertActions = {
  /**
   * Renders a button (should **always** be present if `secondary` action is being used)
   */
  primary?: PrimaryAction;
  /**
   * Renders a Link button
   */
  secondary?: SecondaryAction;
};

interface AlertProps extends StyledPropsBlade {
  /**
   * Body content, pass text or a Snippet. Avoid passing components except `Link` to customize the content.
   */
  description: Snippet | string;

  /**
   * A brief heading
   */
  title?: string;

  /**
   * Shows a dismiss button
   * @default true
   */
  isDismissible?: boolean;

  /**
   * A callback when the dismiss button is clicked
   */
  onDismiss?: () => void;

  /**
   * Can be used to render a custom icon
   */
  icon?: IconComponent;

  /**
   * Can be set to `intense` for a more prominent look. Not to be confused with a11y emphasis.
   * @default 'subtle'
   */
  emphasis?: AlertEmphasis;

  /**
   * Makes the Alert span the entire container width, instead of the default max width of `584px`.
   * This also makes the alert borderless, useful for creating full bleed layouts.
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Sets the color tone
   * @default 'neutral'
   */
  color?: AlertColor;

  /**
   * Renders a primary action button and a secondary action link button
   */
  actions?: AlertActions;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `Alert` for important messages tied to a section of the page, such as a KYC reminder above settlement details.
- Match `color` to intent: `negative` for errors, `notice` for warnings, `positive` for confirmations, `information` or `neutral` for general info, `primary` for feature promotion.
- Keep `title` short and put the explanation in `description`; use a snippet description only to add a `Link` or emphasized `Text`.
- Add a `primary` action when there is one clear next step; add `secondary` only next to a primary action.
- Use `isFullWidth` for alerts that run edge to edge across a card or page section.
- Set `isDismissible={false}` for alerts the user must not hide, such as a blocking compliance message.
- Reserve `emphasis="intense"` for the single most critical alert on screen.

**Don't**

- Don't use `Alert` for transient feedback after an action; use `Toast`.
- Don't use `Alert` for a product-wide broadcast at the top of the app; use `AnnouncementBanner`.
- Don't put buttons or form fields inside `description`; use `actions` for buttons and a `Modal` for input.
- Don't pass `secondary` without `primary`; promote the only action to `primary`.
- Don't override `icon` just for decoration; keep the color-driven default so meaning stays consistent.
- Don't stack several alerts for one issue; combine them into one Alert.

## Examples

### Failed payout with actions

A dismissible negative alert with a retry button and a link to the help article.

```svelte
<script lang="ts">
  import { Alert } from '@razorpay/blade-svelte/components';

  let isRetrying = $state(false);

  const retryPayout = (): void => {
    isRetrying = true;
  };
</script>

<Alert
  title="Payout to HDFC ••4521 failed"
  description="The beneficiary bank rejected the transfer of ₹12,450. Retry the payout or update the bank account."
  color="negative"
  emphasis="subtle"
  marginBottom="spacing.4"
  onDismiss={() => (isRetrying = false)}
  testID="payout-failed-alert"
  data-analytics-section="payouts"
  actions={{
    primary: { text: isRetrying ? 'Retrying...' : 'Retry payout', onClick: retryPayout },
    secondary: {
      text: 'Why payouts fail',
      href: 'https://razorpay.com/docs/payments/payouts/',
      target: '_blank',
    },
  }}
/>
```

### Full-width KYC reminder with rich description

A non-dismissible, intense full-width alert whose description is a snippet with a Link.

```svelte
<script lang="ts">
  import { Alert, Link, Text } from '@razorpay/blade-svelte/components';
</script>

<Alert
  color="notice"
  emphasis="intense"
  isFullWidth={true}
  isDismissible={false}
  actions={{
    primary: { text: 'Complete KYC', onClick: () => {} },
  }}
>
  {#snippet description()}
    <Text size="small" color="surface.text.staticWhite.normal">
      Settlements are on hold until you complete KYC.
      <Link href="https://razorpay.com/docs/payments/kyc/" size="small" color="white">See required documents</Link>
    </Text>
  {/snippet}
</Alert>
```

### Description-only information alert

A compact alert with no title or actions, shown conditionally.

```svelte
<script lang="ts">
  import { Alert } from '@razorpay/blade-svelte/components';

  let { isOlderThanSixMonths = true }: { isOlderThanSixMonths?: boolean } = $props();
</script>

{#if isOlderThanSixMonths}
  <Alert
    description="This payment was made more than 6 months ago, so it can't be refunded."
    color="information"
    isDismissible={false}
  />
{/if}
```
