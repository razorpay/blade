## Component Name

Card

## Description

Card is an elevated container that groups related content and actions on one topic, such as a product summary, a metric or a selectable plan. Compose it with `CardHeader` (`CardHeaderLeading`, `CardHeaderTrailing` and the header visuals `CardHeaderIcon`, `CardHeaderCounter`, `CardHeaderBadge`, `CardHeaderAmount`, `CardHeaderText`, `CardHeaderLink`, `CardHeaderIconButton`), `CardBody` and `CardFooter` (`CardFooterLeading`, `CardFooterTrailing`). Cards can be clickable, linkable or selectable. `TicketCard` (`TicketCardBody` + `TicketCardFooter`) renders a perforated ticket or coupon, and `InfoCard` (`InfoCardBody` + `InfoCardFooter`) renders a two-tone header-over-body card.

## Important Constraints

- Every `CardHeader*`, `CardBody` and `CardFooter*` sub-component must be rendered inside a `Card`, `TicketCard` or `InfoCard`; outside one it logs `[Blade]: <Name> cannot be used outside of Card component` (on localhost) and falls back to `size="large"`
- `backgroundColor` is only accepted with `variant="theme"`; `primary` and `secondary` use fixed surface colors and TypeScript rejects `backgroundColor` on them
- `elevation` is deprecated and a no-op
- `isDisabled` makes the card non-interactive: `href` and `onClick` are ignored and `isSelected` has no visual effect
- `TicketCard` and `InfoCard` render nothing until both their body (`TicketCardBody` / `InfoCardBody`) and footer (`TicketCardFooter` / `InfoCardFooter`) are present; they ignore `padding`, `validationState`, `overflow`, `overflowX`, `overflowY` and `styleOverride`
- `CardFooterTrailing` renders at most two buttons, `actions.primary` and `actions.secondary`
- Partial port of React: `shouldScaleOnHover`, `opacity`, `transition` and `flexShrink` are not supported; `width`, `height` and the min/max sizes take a single CSS string, not responsive objects

## TypeScript Types

These are the props the Card component and its sub-components accept.

```typescript
type CardSpacingValueType = 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';

type CardBackgroundColor =
  | 'surface.background.gray.subtle'
  | 'surface.background.gray.moderate'
  | 'surface.background.gray.intense'
  | 'surface.background.primary.subtle'
  | 'surface.background.primary.intense'
  | 'surface.background.sea.subtle'
  | 'surface.background.sea.intense'
  | 'surface.background.cloud.subtle'
  | 'surface.background.cloud.intense';

type CardSlot = 'root' | 'surface';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CreditCardIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

type CardBaseProps = {
  /**
   * Card contents.
   */
  children?: Snippet;
  /**
   * Sets the border radius of the Card
   *
   * @default 'medium'
   */
  borderRadius?: 'medium' | 'large' | 'xlarge';
  /**
   * Sets the elevation for Cards
   *
   * @deprecated The `elevation` prop is deprecated and is a no-op. The Card always uses a custom elevation. This prop will be removed in a future major version.
   */
  elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
  /**
   * Sets the padding equally on all sides. Only few spacing tokens are allowed deliberately
   *
   * @default 'spacing.7'
   */
  padding?: CardSpacingValueType;
  /**
   * Sets the width of the card
   */
  width?: string;
  /**
   * Sets the height of the card
   */
  height?: string;
  /**
   * Sets minimum height of the card
   */
  minHeight?: string;
  /**
   * Sets minimum width of the card
   */
  minWidth?: string;
  /**
   * Sets maximum width of the card
   */
  maxWidth?: string;
  /**
   * If `true`, the card will be in selected state.
   * Card will have a primary color border around it.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * If `true`, the card is disabled: it becomes non-interactive (`href`/`onClick` are ignored)
   * and is announced as disabled to assistive tech.
   *
   * `isDisabled` takes precedence over `isSelected`.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Makes the Card linkable by setting the `href` prop
   */
  href?: string;
  /**
   * Sets the `target` attribute for the linkable card
   */
  target?: string;
  /**
   * Sets the `rel` attribute for the linkable card
   */
  rel?: string;
  /**
   * Sets the accessibility label for the card.
   * This is useful when the card has an `href` or `onClick` prop.
   */
  accessibilityLabel?: string;
  /**
   * Callback triggered when the card is hovered
   */
  onHover?: () => void;
  /**
   * Sets the size of the card header title
   *
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /**
   * Callback triggered when the card is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Sets the HTML element for the Card.
   * When `as` is set to `label`, the card will be rendered as a label element.
   */
  as?: 'label';
  /**
   * CSS cursor value for the card
   */
  cursor?: string;
  /**
   * Sets the overflow behavior of the card content.
   */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  /**
   * Sets the horizontal overflow behavior of the card content.
   */
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  /**
   * Sets the vertical overflow behavior of the card content.
   */
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  /**
   * Validation state for the card border
   *
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Card.styleOverride`;
   * instance values win on conflicts. Use `variant` and `backgroundColor` for surface fill.
   * **`root`:** repoint `--interactive-border-gray-disabled` on the wrapper to tint the inset
   * border ring on elevated surfaces (`primary`, `theme`).
   */
  styleOverride?: Partial<Record<CardSlot, string>>;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type CardVariantProps =
  | {
      /**
       * Sets the visual treatment of the Card.
       *
       * - `primary`: elevated styling (gradients, drop shadow) with fixed
       *   `surface.background.gray.intense` background.
       * - `secondary`: flat styling with fixed `surface.background.gray.moderate` background.
       *
       * @default 'primary'
       */
      variant?: 'primary' | 'secondary';
      backgroundColor?: never;
    }
  | {
      /**
       * Sets the visual treatment of the Card.
       *
       * `theme`: elevated shadow like `primary` with a configurable `backgroundColor`.
       */
      variant: 'theme';
      /**
       * Sets the background color. Only valid when `variant="theme"`.
       * Supports gray and colored surface tokens (primary, sea, cloud).
       *
       * @default 'surface.background.primary.subtle'
       */
      backgroundColor?: CardBackgroundColor;
    };

type CardProps = CardBaseProps & CardVariantProps;

type CardBodyProps = {
  /**
   * Card body contents
   */
  children: Snippet;
  /**
   * Sets the height of the card body
   */
  height?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type CardHeaderProps = {
  /**
   * Card header contents (CardHeaderLeading and/or CardHeaderTrailing)
   */
  children?: Snippet;
  /**
   * For spacing between divider and header title
   *
   * @default 'spacing.4'
   */
  paddingBottom?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   *
   * @default 'spacing.4'
   */
  marginBottom?: CardSpacingValueType;
  /**
   * Whether to show the divider below the header
   *
   * @default true
   */
  showDivider?: boolean;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type CardHeaderLeadingProps = {
  /**
   * Title text for the card header
   */
  title: string;
  /**
   * Subtitle text for the card header
   */
  subtitle?: string;
  /**
   * Prefix element of Card header.
   * Accepts CardHeaderIcon component via Snippet.
   */
  prefix?: Snippet;
  /**
   * Suffix element of Card header.
   * Adds marginLeft to CardHeaderCounter, CardHeaderLink components by default.
   */
  suffix?: Snippet;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type CardHeaderTrailingProps = {
  /**
   * Renders a visual ornament in card header trailing section
   */
  visual?: Snippet;
};

/**
 * Props for CardHeaderIcon.
 */
type CardHeaderIconProps = {
  /** Icon component to render */
  icon: IconComponent;
};

type CardHeaderIconButtonProps = {
  /**
   * Icon component to render in the button
   */
  icon: IconComponent;
  /**
   * Whether the button is disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the button is in a loading state
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Callback triggered when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * The accessible label for the button
   */
  accessibilityLabel?: string;
  /**
   * Button type attribute
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * Test ID for testing
   */
  testID?: string;
};

type CardHeaderLinkProps = {
  children?: Snippet | string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
  isDisabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'anchor' | 'button';
  testID?: string;
  [key: `data-analytics-${string}`]: string;
};

type CardFooterProps = {
  /**
   * Card footer contents (CardFooterLeading and/or CardFooterTrailing)
   */
  children?: Snippet;
  /**
   * For spacing between divider and footer title
   *
   * @default 'spacing.4'
   */
  paddingTop?: CardSpacingValueType;
  /**
   * For spacing between body content and divider
   *
   * @default 'spacing.4'
   */
  marginTop?: CardSpacingValueType;
  /**
   * Whether to show the divider above the footer
   *
   * @default true
   */
  showDivider?: boolean;
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type CardFooterAction = {
  /**
   * Button text
   */
  text?: string;
  /**
   * Button type attribute
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * The accessible label for the button
   */
  accessibilityLabel?: string;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean;
  /**
   * Icon component for the button
   */
  icon?: IconComponent;
  /**
   * Position of the icon
   */
  iconPosition?: 'left' | 'right';
  /**
   * Callback triggered when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;
};

type CardFooterLeadingProps = {
  /**
   * Footer leading title
   */
  title?: string;
  /**
   * Footer leading subtitle
   */
  subtitle?: string;
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type CardFooterTrailingProps = {
  /**
   * Primary and secondary action buttons
   */
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
  /**
   * Analytics data attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type TicketCardProps = CardBaseProps & {
  /**
   * Must contain exactly one `TicketCardBody` and one `TicketCardFooter`.
   */
  children: Snippet;
};

type InfoCardProps = CardBaseProps & {
  /**
   * Must contain exactly one `InfoCardBody` and one `InfoCardFooter`.
   */
  children: Snippet;
};

/**
 * Props for TicketCardBody, TicketCardFooter, InfoCardBody and InfoCardFooter.
 */
type SectionedCardBodyProps = {
  children: Snippet;
  testID?: string;
  [key: `data-analytics-${string}`]: string;
};

type SectionedCardFooterProps = {
  children: Snippet;
  testID?: string;
  [key: `data-analytics-${string}`]: string;
};
```

`CardHeaderCounter`, `CardHeaderBadge`, `CardHeaderAmount` and `CardHeaderText` forward their props unchanged to `Counter`, `Badge`, `Amount` and `Text` (body or caption variant); see those docs for their props.

## Usage Guidelines

**Do**

- Use `Card` to group content and actions about one topic on a consistent surface.
- Compose in order: `CardHeader`, then `CardBody`, then `CardFooter`; put `CardHeaderLeading` and `CardHeaderTrailing` inside `CardHeader`, and `CardFooterLeading` and `CardFooterTrailing` inside `CardFooter`.
- Use the `CardHeader*` visuals in header snippets: `CardHeaderIcon` in `prefix`, `CardHeaderCounter` or `CardHeaderLink` in `suffix`, and `CardHeaderBadge`, `CardHeaderAmount`, `CardHeaderText`, `CardHeaderLink` or `CardHeaderIconButton` in `visual`.
- Pass `accessibilityLabel` whenever the card has `onClick` or `href`, and `accessibilityLabel` on every `CardHeaderIconButton`.
- Use `isSelected` with `onClick` (or `as="label"` around a form control) for selectable cards, and `validationState="error"` when a required selection is missing.
- Use `size="medium"` with `padding="spacing.5"` for compact metric or summary cards.
- Use `variant="secondary"` for flat, low-emphasis groupings and `variant="theme"` with `backgroundColor` for tinted promotional cards.
- Use `TicketCard` for tickets, coupons and offers, and `InfoCard` for a highlighted summary over supporting detail.

**Don't**

- Don't use Card as a generic layout wrapper; use `Box` with layout utility classes (see Usage.md).
- Don't put more than two actions in a footer; move extra actions into the body as `Link` or `Button`.
- Don't put `Button` or `IconButton` directly in the header; use `CardHeaderIconButton` or `CardHeaderLink`.
- Don't nest interactive cards (`onClick` or `href`) inside each other; make only the outer card interactive and use `Button` or `Link` inside it.
- Don't pass `elevation`; it is a no-op. Pick a `variant` instead.
- Don't pass `backgroundColor` with `primary` or `secondary`; switch to `variant="theme"`.

## Examples

### Payment Links product card

A full card with header icon, counter and badge, a body and two footer actions.

```svelte
<script lang="ts">
  import {
    Card,
    CardHeader,
    CardHeaderLeading,
    CardHeaderTrailing,
    CardHeaderIcon,
    CardHeaderCounter,
    CardHeaderBadge,
    CardBody,
    CardFooter,
    CardFooterLeading,
    CardFooterTrailing,
    Text,
    CreditCardIcon,
  } from '@razorpay/blade-svelte/components';

  let isCreating = $state(false);

  function createLink(): void {
    isCreating = true;
  }
</script>

<Card maxWidth="480px" data-analytics-section="payment-links-card">
  <CardHeader>
    <CardHeaderLeading
      title="Payment Links"
      subtitle="Share a link over SMS, email or WhatsApp and get paid instantly"
    >
      {#snippet prefix()}
        <CardHeaderIcon icon={CreditCardIcon} />
      {/snippet}
      {#snippet suffix()}
        <CardHeaderCounter value={12} />
      {/snippet}
    </CardHeaderLeading>
    <CardHeaderTrailing>
      {#snippet visual()}
        <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
      {/snippet}
    </CardHeaderTrailing>
  </CardHeader>
  <CardBody>
    <Text>
      Create Payment Links from the Dashboard or APIs and accept UPI, cards and netbanking without a
      website.
    </Text>
  </CardBody>
  <CardFooter>
    <CardFooterLeading title="12 active links" subtitle="3 expire this week" />
    <CardFooterTrailing
      actions={{
        primary: { text: 'Create link', isLoading: isCreating, onClick: createLink },
        secondary: { text: 'View all', onClick: () => console.log('View all links') },
      }}
    />
  </CardFooter>
</Card>
```

### Selectable settlement schedule

Clickable cards that act as a single-choice group, with a selected state and an error border until a choice is made.

```svelte
<script lang="ts">
  import {
    Box,
    Button,
    Card,
    CardHeader,
    CardHeaderLeading,
    CardHeaderTrailing,
    CardHeaderBadge,
    Text,
  } from '@razorpay/blade-svelte/components';

  const schedules = [
    { id: 'instant', title: 'Instant settlements', subtitle: 'Within 30 minutes', fee: '0.1% fee' },
    { id: 'standard', title: 'Standard settlements', subtitle: 'T+2 working days', fee: 'Free' },
  ];

  let selectedSchedule = $state<string | undefined>(undefined);
  let hasSubmitted = $state(false);

  const showError = $derived(hasSubmitted && !selectedSchedule);
</script>

<Box className="display-flex flex-col gap-spacing-4">
  {#each schedules as schedule (schedule.id)}
    <Card
      size="medium"
      padding="spacing.5"
      isSelected={selectedSchedule === schedule.id}
      validationState={showError ? 'error' : 'none'}
      accessibilityLabel={`Choose ${schedule.title}`}
      onClick={() => (selectedSchedule = schedule.id)}
    >
      <CardHeader showDivider={false} marginBottom="spacing.0" paddingBottom="spacing.0">
        <CardHeaderLeading title={schedule.title} subtitle={schedule.subtitle} />
        <CardHeaderTrailing>
          {#snippet visual()}
            <CardHeaderBadge size="small" color="information">{schedule.fee}</CardHeaderBadge>
          {/snippet}
        </CardHeaderTrailing>
      </CardHeader>
    </Card>
  {/each}
  {#if showError}
    <Text size="small" color="feedback.text.negative.intense">Choose a settlement schedule</Text>
  {/if}
  <Button onClick={() => (hasSubmitted = true)}>Save schedule</Button>
</Box>

```

### Compact order summary

Medium-size cards with a header icon button, a header amount, and an `href` that makes the whole card a link.

```svelte
<script lang="ts">
  import {
    Box,
    Card,
    CardBody,
    CardHeader,
    CardHeaderLeading,
    CardHeaderTrailing,
    CardHeaderIconButton,
    CardHeaderAmount,
    Text,
    Amount,
    ChevronRightIcon,
  } from '@razorpay/blade-svelte/components';
</script>

<Box className="display-flex flex-col gap-spacing-5">
  <Card maxWidth="380px" size="medium">
    <CardHeader>
      <CardHeaderLeading title="Order summary" subtitle="order_NkP8x2Zc1" />
      <CardHeaderTrailing>
        {#snippet visual()}
          <CardHeaderIconButton
            icon={ChevronRightIcon}
            accessibilityLabel="Open order details"
            onClick={() => console.log('Open order')}
          />
        {/snippet}
      </CardHeaderTrailing>
    </CardHeader>
    <CardBody>
      <Box className="display-flex justify-between items-center">
        <Text weight="semibold">boAt XP345 Headphones</Text>
        <Amount value={1149} fractionDigits={0} weight="semibold" />
      </Box>
    </CardBody>
  </Card>

  <Card
    maxWidth="380px"
    size="medium"
    padding="spacing.5"
    href="/app/settlements"
    accessibilityLabel="View settlements"
  >
    <CardHeader showDivider={false}>
      <CardHeaderLeading title="Next settlement" subtitle="Scheduled for 2 Oct" />
      <CardHeaderTrailing>
        {#snippet visual()}
          <CardHeaderAmount value={248500} weight="semibold" />
        {/snippet}
      </CardHeaderTrailing>
    </CardHeader>
  </Card>
</Box>

```

### Event ticket and offer info card

`TicketCard` and `InfoCard` each take exactly one body part and one footer part.

```svelte
<script lang="ts">
  import {
    Box,
    TicketCard,
    TicketCardBody,
    TicketCardFooter,
    InfoCard,
    InfoCardBody,
    InfoCardFooter,
    Text,
    Amount,
  } from '@razorpay/blade-svelte/components';

  let isTicketSelected = $state(false);
</script>

<Box className="display-flex flex-wrap-wrap gap-spacing-5">
  <TicketCard
    width="280px"
    isSelected={isTicketSelected}
    accessibilityLabel="Select Razorpay Summit ticket"
    onClick={() => (isTicketSelected = !isTicketSelected)}
  >
    <TicketCardBody>
      <Text weight="semibold">Razorpay Summit 2026</Text>
      <Text size="small" color="surface.text.gray.subtle">General Admission</Text>
    </TicketCardBody>
    <TicketCardFooter>
      <Box className="display-flex justify-between items-center">
        <Text weight="semibold">Seat A-24</Text>
        <Amount value={4999} type="body" weight="semibold" />
      </Box>
    </TicketCardFooter>
  </TicketCard>

  <InfoCard width="280px">
    <InfoCardBody>
      <Text weight="semibold">Zero-fee UPI for 30 days</Text>
    </InfoCardBody>
    <InfoCardFooter>
      <Text size="small" color="surface.text.gray.subtle">
        Applies to all UPI payments captured before 31 Oct.
      </Text>
    </InfoCardFooter>
  </InfoCard>
</Box>

```
