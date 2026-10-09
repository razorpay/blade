## Component Name

Accordion

## Description

Accordion stacks related content sections vertically and lets users expand one section at a time, for FAQs, checkout steps or settings groups. Each `AccordionItem` contains one `AccordionItemHeader` (title, subtitle, leading visual, title suffix and trailing content) and one `AccordionItemBody`. It supports numbered items, `transparent` and `filled` variants, two sizes, a gray body surface, and controlled or uncontrolled expansion.

## Important Constraints

- `AccordionItem` must be rendered inside `Accordion` (it reads the Accordion context and fails without it), and must contain `AccordionItemHeader` first and `AccordionItemBody` second
- `AccordionItemHeader` throws `[blade-svelte] AccordionItemHeader must be used inside an <AccordionItem> component.` when rendered outside an `AccordionItem`
- Only one item can be expanded at a time; `-1` means no item is expanded
- Items are indexed in render order, starting at `0`; `expandedIndex` and `defaultExpandedIndex` refer to that order
- In controlled mode (`expandedIndex` set) the Accordion does not change its own state; update `expandedIndex` from `onExpandChange`
- `styleOverride` is ignored when `variant="filled"`, and a warning is logged
- Passing `children` to `AccordionItemHeader` replaces the `title`, `subtitle` and `titleSuffix` layout
- When `showNumberPrefix` is set, the number replaces the header's `leading` snippet
- Partial port of React: the deprecated `title`, `description` and `icon` props on `AccordionItem` are not supported; `maxWidth` and `minWidth` take a CSS string, not responsive objects

## TypeScript Types

These are the props the Accordion component and its sub-components accept.

```typescript
type AccordionVariantType = 'filled' | 'transparent';

type AccordionSlot = 'root' | 'item' | 'headerButton' | 'body' | 'title' | 'subtitle';

type AccordionProps = {
  /**
   * Accepts `AccordionItem` child nodes.
   */
  children: Snippet;

  /**
   * Makes the passed item index expanded by default (uncontrolled).
   */
  defaultExpandedIndex?: number;

  /**
   * Expands the passed index (controlled), `-1` implies no expanded items.
   */
  expandedIndex?: number;

  /**
   * Callback for change in any item's expanded state.
   * `-1` implies no expanded items.
   */
  onExpandChange?: (payload: { expandedIndex: number }) => void;

  /**
   * Adds numeric index at the beginning of items.
   * @default false
   */
  showNumberPrefix?: boolean;

  /**
   * Visual variant of AccordionItem.
   * @default 'transparent'
   */
  variant?: AccordionVariantType;

  /**
   * Size of the Accordion.
   * @default 'large'
   */
  size?: 'large' | 'medium';

  /**
   * CSS max-width value for the accordion.
   */
  maxWidth?: string;

  /**
   * CSS min-width value for the accordion.
   */
  minWidth?: string;

  /**
   * Renders expanded body on a recessed gray surface.
   * Uses `surface.background.gray.subtle`.
   *
   * Recommended with `variant="filled"` for checkout-style accordions.
   *
   * @default false
   */
  hasGrayBody?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Accordion.styleOverride`;
   * instance values win on conflicts. Ignored when `variant="filled"` (fixed checkout shell).
   */
  styleOverride?: Partial<Record<AccordionSlot, string>>;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

type AccordionItemProps = {
  /**
   * Slot, renders AccordionItemHeader and AccordionItemBody.
   */
  children: Snippet;

  /**
   * Disabled state of the item.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type AccordionItemHeaderProps = {
  /**
   * Title text for the header.
   */
  title?: string;

  /**
   * Subtitle text for the header.
   */
  subtitle?: string;

  /**
   * Leading element snippet (icon, image, etc.).
   */
  leading?: Snippet;

  /**
   * Custom header content snippet, replaces default title/subtitle layout.
   */
  children?: Snippet;

  /**
   * Trailing element snippet.
   */
  trailing?: Snippet;

  /**
   * Element placed adjacent to the title.
   * Typically used for `Badge`, `Counter`, or `AvatarGroup`.
   */
  titleSuffix?: Snippet;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

type AccordionItemBodyProps = {
  /**
   * Body content. String children are wrapped in Text component.
   */
  children: Snippet | string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `Accordion` for three or more related sections where only one needs to be open at a time, such as FAQs or checkout steps.
- Keep header titles short and scannable, and put the detail in `AccordionItemBody`.
- Use `showNumberPrefix` for ordered steps, such as onboarding or KYC stages.
- Use the `leading` snippet for a category icon and `titleSuffix` for a `Badge` or `Counter`.
- Use `variant="filled"` with `hasGrayBody` for checkout-style payment method selectors.
- Use `size="medium"` in dense layouts such as side panels.
- Use controlled mode (`expandedIndex` with `onExpandChange`) when another control, such as a "Next" button, must open an item.
- Call `event.stopPropagation()` in the `onClick` of an interactive element in the `trailing` snippet so it does not toggle the item.

**Don't**

- Don't use `Accordion` when several sections must be open at once; use separate `Collapsible` components.
- Don't nest an Accordion inside another Accordion; flatten the content or link to a separate page.
- Don't use `Accordion` to switch between peer views of equal weight; use `Tabs`.
- Don't combine `showNumberPrefix` with a `leading` snippet; the number replaces it, so pick one.
- Don't pass `styleOverride` with `variant="filled"`; switch to `variant="transparent"` to override slots.

## Examples

### Settlement FAQs

A numbered, uncontrolled FAQ list with the first answer open and string bodies.

```svelte
<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AccordionItemHeader,
    AccordionItemBody,
  } from '@razorpay/blade-svelte/components';
</script>

<Accordion
  showNumberPrefix
  defaultExpandedIndex={0}
  maxWidth="640px"
  data-analytics-section="settlement-faqs"
>
  {#snippet children()}
    <AccordionItem>
      {#snippet children()}
        <AccordionItemHeader title="When will I receive my settlements?" />
        <AccordionItemBody>
          Settlements reach your bank account on T+2 working days by default. You can switch to
          instant settlements from Settings.
        </AccordionItemBody>
      {/snippet}
    </AccordionItem>
    <AccordionItem>
      {#snippet children()}
        <AccordionItemHeader title="Why is my settlement on hold?" />
        <AccordionItemBody>
          Settlements are held when your KYC is pending or a transaction is under review.
        </AccordionItemBody>
      {/snippet}
    </AccordionItem>
    <AccordionItem>
      {#snippet children()}
        <AccordionItemHeader title="Can I change my settlement bank account?" />
        <AccordionItemBody>
          Yes. Update the bank account from Account and Settings. The change takes effect after
          verification.
        </AccordionItemBody>
      {/snippet}
    </AccordionItem>
  {/snippet}
</Accordion>
```

### Checkout payment methods

A controlled, filled accordion with a gray body, leading icons, a title suffix badge and a disabled item.

```svelte
<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AccordionItemHeader,
    AccordionItemBody,
    Badge,
    Button,
    Text,
    BankIcon,
    CreditCardIcon,
    PhoneIcon,
  } from '@razorpay/blade-svelte/components';

  let expandedMethod = $state(0);
</script>

<Accordion
  variant="filled"
  hasGrayBody
  size="medium"
  expandedIndex={expandedMethod}
  onExpandChange={({ expandedIndex }) => (expandedMethod = expandedIndex)}
>
  {#snippet children()}
    <AccordionItem>
      {#snippet children()}
        <AccordionItemHeader title="UPI" subtitle="Google Pay, PhonePe, Paytm and more">
          {#snippet leading()}
            <PhoneIcon size="large" />
          {/snippet}
          {#snippet titleSuffix()}
            <Badge size="small" color="positive">Recommended</Badge>
          {/snippet}
        </AccordionItemHeader>
        <AccordionItemBody>
          {#snippet children()}
            <Text size="small">Scan the QR code or enter your UPI ID to pay ₹1,499.</Text>
            <Button size="small" marginTop="spacing.4">Pay with UPI</Button>
          {/snippet}
        </AccordionItemBody>
      {/snippet}
    </AccordionItem>
    <AccordionItem>
      {#snippet children()}
        <AccordionItemHeader title="Cards" subtitle="Visa, Mastercard, RuPay">
          {#snippet leading()}
            <CreditCardIcon size="large" />
          {/snippet}
        </AccordionItemHeader>
        <AccordionItemBody>Saved cards appear here after your first payment.</AccordionItemBody>
      {/snippet}
    </AccordionItem>
    <AccordionItem isDisabled>
      {#snippet children()}
        <AccordionItemHeader title="Netbanking" subtitle="Temporarily unavailable">
          {#snippet leading()}
            <BankIcon size="large" />
          {/snippet}
        </AccordionItemHeader>
        <AccordionItemBody>Netbanking is under maintenance.</AccordionItemBody>
      {/snippet}
    </AccordionItem>
  {/snippet}
</Accordion>
```
