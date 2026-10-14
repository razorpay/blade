## Component Name

CardGroup

## Description

CardGroup stacks rows into one elevated card surface and draws the border, radius, elevation and the dividers between rows. `CardGroupItem` is a row that navigates (`href`), selects (`onClick` / `isSelected`) or only displays content. `CardGroupCollapsibleItem` turns a row into a disclosure: its first `CardGroupItem` becomes the trigger and `CardGroupCollapsibleItemBody` holds the revealed content.

## Important Constraints

- CardGroup has no React Blade equivalent; it exists only in `@razorpay/blade-svelte`.
- A `CardGroupItem` either navigates (`href`) or selects (`onClick` / `isSelected`), never both. When `href` is set, `onClick` and `isSelected` are ignored.
- Inside a `CardGroupCollapsibleItem`, the `CardGroupItem` placed directly in it is the disclosure trigger: it renders a `<button>` with a down chevron and ignores `href` and `onClick`. Rows inside `CardGroupCollapsibleItemBody` are normal rows again.
- A `CardGroupItem` with `href` renders an `<a>` with a right chevron; with `onClick` or `isSelected` it renders a `<button>`; otherwise it renders a plain `<div>`.
- Selection is owned by the consumer. The group does not track which row is selected; pass `isSelected` to each row from your own state.
- Row content goes in the `children` snippet (or a plain string); use the `leading` and `trailing` snippets for icons, avatars, badges or amounts.

## TypeScript Types

These are the props the CardGroup components accept.

```typescript
type AnalyticsAttribute = {
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type CardGroupProps = {
  /**
   * Rows of the group — compose `CardGroupItem` and `CardGroupCollapsibleItem`.
   */
  children: Snippet;
  /**
   * Accessible label for the group, announced by screen readers.
   */
  accessibilityLabel?: string;
  /**
   * Test ID for the root element.
   */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

type CardGroupItemProps = {
  /**
   * Row content — the free slot between the leading and trailing slots.
   */
  children?: Snippet | string;
  /**
   * Leading slot, rendered before the content (e.g. an icon or avatar).
   */
  leading?: Snippet;
  /**
   * Trailing slot, rendered after the content and before the chevron
   * (e.g. a badge or amount).
   */
  trailing?: Snippet;
  /**
   * Renders the row as a navigating link. A row either navigates (`href`) or
   * selects (`onClick` / `isSelected`) — never both. Ignored when the row acts
   * as a collapsible trigger.
   */
  href?: string;
  /** Link target, used only with `href`. */
  target?: string;
  /** Link rel, used only with `href`. */
  rel?: string;
  /**
   * Click handler for a selecting row. Ignored when `href` is set or when the
   * row acts as a collapsible trigger.
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Marks a selecting row as selected. Selection is consumer-driven; the group
   * does not own selection state.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * Disables the row.
   *
   * @default false
   */
  isDisabled?: boolean;
  /** Accessible label for the row. */
  accessibilityLabel?: string;
  /** Test ID for the row. */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

type CardGroupCollapsibleItemProps = {
  /**
   * Compose a `CardGroupItem` (the disclosure trigger) followed by a
   * `CardGroupCollapsibleItemBody` (the revealed content).
   */
  children: Snippet;
  /** Expands the row (controlled). */
  isExpanded?: boolean;
  /**
   * Expands the row by default (uncontrolled).
   *
   * @default false
   */
  defaultIsExpanded?: boolean;
  /** Callback for a change in the row's expanded state. */
  onExpandChange?: (args: { isExpanded: boolean }) => void;
  /** Test ID for the row. */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

type CardGroupCollapsibleItemBodyProps = {
  /**
   * Revealed content — a free slot that may hold anything, including a nested
   * `CardGroup`.
   */
  children: Snippet | string;
  /** Test ID for the body element. */
  testID?: string;
} & AnalyticsAttribute;
```

## Usage Guidelines

**Do**

- Use CardGroup for a short list of related rows on one surface, such as settings entries, payment methods or account links.
- Give the group an `accessibilityLabel` that names the list, for example "Payment methods".
- Use `href` for rows that open another page and `onClick` with `isSelected` for rows that pick an option.
- Put supporting visuals in `leading` (an icon) and status or values in `trailing` (a Badge or Text).
- Use `CardGroupCollapsibleItem` when a row hides details that most users don't need, and control it with `isExpanded` / `onExpandChange` when other UI depends on its state.

**Don't**

- Don't pass both `href` and `onClick` to one row; split the actions into separate rows or move the action into the page the row opens.
- Don't wrap CardGroup in a `Card`; CardGroup already draws its own card surface.
- Don't add `Divider` between rows; the group draws the dividers.
- Don't put interactive controls such as `Button` inside a row that already navigates or selects; nested interactive elements break keyboard and screen reader use.

## Examples

### Settings links with status

Navigating rows with a leading icon and a trailing status badge.

```svelte
<script lang="ts">
  import {
    Badge,
    BankIcon,
    CardGroup,
    CardGroupItem,
    LockIcon,
    UserIcon,
  } from '@razorpay/blade-svelte/components';
</script>

<CardGroup accessibilityLabel="Account settings">
  <CardGroupItem href="/settings/profile">
    {#snippet leading()}
      <UserIcon size="medium" color="surface.icon.gray.normal" />
    {/snippet}
    Business profile
  </CardGroupItem>
  <CardGroupItem href="/settings/bank-account">
    {#snippet leading()}
      <BankIcon size="medium" color="surface.icon.gray.normal" />
    {/snippet}
    Settlement bank account
    {#snippet trailing()}
      <Badge color="positive">Verified</Badge>
    {/snippet}
  </CardGroupItem>
  <CardGroupItem href="/settings/security" isDisabled>
    {#snippet leading()}
      <LockIcon size="medium" color="surface.icon.gray.normal" />
    {/snippet}
    Two-factor authentication
  </CardGroupItem>
</CardGroup>
```

### Selectable payment methods with a disclosure

Selecting rows driven by local state, plus a collapsible row that reveals more options.

```svelte
<script lang="ts">
  import {
    CardGroup,
    CardGroupCollapsibleItem,
    CardGroupCollapsibleItemBody,
    CardGroupItem,
    CreditCardIcon,
    PhoneIcon,
    Text,
  } from '@razorpay/blade-svelte/components';

  let selectedMethod = $state('card');
  let isUpiExpanded = $state(false);
</script>

<CardGroup accessibilityLabel="Payment methods">
  <CardGroupItem isSelected={selectedMethod === 'card'} onClick={() => (selectedMethod = 'card')}>
    {#snippet leading()}
      <CreditCardIcon size="medium" color="surface.icon.gray.normal" />
    {/snippet}
    Cards
  </CardGroupItem>
  <CardGroupCollapsibleItem
    isExpanded={isUpiExpanded}
    onExpandChange={({ isExpanded }) => (isUpiExpanded = isExpanded)}
  >
    <CardGroupItem>
      {#snippet leading()}
        <PhoneIcon size="medium" color="surface.icon.gray.normal" />
      {/snippet}
      UPI
    </CardGroupItem>
    <CardGroupCollapsibleItemBody>
      <Text size="small" color="surface.text.gray.muted">
        Pay with any UPI app such as Google Pay, PhonePe or Paytm.
      </Text>
    </CardGroupCollapsibleItemBody>
  </CardGroupCollapsibleItem>
</CardGroup>
```
