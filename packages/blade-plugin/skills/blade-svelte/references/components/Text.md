## Component Name

Text

## Description

Text sets body copy in Blade's Body styles: paragraphs, labels, captions, helper lines and inline runs inside other text. It comes in four sizes (10, 12, 14 and 16px), three weights and eight colours, renders a `p`, `span` or `div`, and can clamp itself to a number of lines with an ellipsis. It has no behaviour of its own; it is the text style most other content sits in, and Amount and Code inherit from it.

## Important Constraints

- The content is `children`, a snippet (plain text between the tags works); there is no `content` or `text` prop
- `as` is `p` (default), `span` or `div` only; use `span` for a run inside another Text, never `p` in `p`
- `color` is one of `default`, `subtle`, `muted`, `primary`, `negative`, `positive`, `white`, `inherit`; React's `danger` and `success` do not exist
- `truncateAfterLines` clamps to at most 6 lines
- `class` places it and may set text alignment; its size, weight and colour are props, never `text-*` or `font-*` classes

## Props

```typescript
type TextSize = 'xsmall' | 'small' | 'medium' | 'large';
type TextWeight = 'regular' | 'medium' | 'semibold';
type TextColor = 'default' | 'subtle' | 'muted' | 'primary' | 'negative' | 'positive' | 'white' | 'inherit';

interface TextProps {
  /** The element: prose (`p`), inline (`span`), a block (`div`). @default 'p' */
  as?: 'p' | 'span' | 'div';
  /** Body styles: 10/13, 12/17, 14/20 or 16/24px (size/line height). @default 'medium' */
  size?: TextSize;
  /** @default 'regular' */
  weight?: TextWeight;
  /** `white` is static, for dark or brand surfaces; `inherit` takes the parent's colour. @default 'default' */
  color?: TextColor;
  /** @default 'start' */
  textAlign?: 'start' | 'center' | 'end';
  /** Cuts the text off with an ellipsis after this many lines (1 to 6; more is capped at 6). */
  truncateAfterLines?: number;
  /** The text. */
  children: Snippet;
  testID?: string;
  /** Placement and text alignment only. */
  class?: string;
}
```

## Guidelines

- Use `color="muted"` or `subtle` for secondary lines (helper text, timestamps), not a smaller size alone.
- Use `color="negative"` and `positive` for inline status text; for a block message use Alert.
- Nest `<Text as="span">` to change the weight or colour of a few words inside a paragraph.
- Use `truncateAfterLines` for descriptions in a list or card that must keep a fixed height.
- Use Heading for titles and Display for hero numbers or words, not a large Text.
- Don't style text with `text-*`, `font-*` or `leading-*` classes on a Text: use `size`, `weight` and `color`.
- Don't use `color="white"` on light surfaces; it does not follow the theme.

## Examples

### Sizes, weights and colours

```svelte
<script lang="ts">
  import { Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-2">
  <Text size="large" weight="semibold">Payment received</Text>
  <Text>Your payment of ₹1,299 to Acme Store was successful.</Text>
  <Text size="small" color="muted">12 Oct 2026, 4:32 PM</Text>
  <Text size="xsmall" color="subtle">Transaction ID pay_Q1w2e3r4t5y6u7</Text>
  <Text color="negative">The card has expired</Text>
</div>
```

### Inline emphasis

```svelte
<script lang="ts">
  import { Text } from '@razorpay/blade-svelte/components';
</script>

<Text>
  Settlements reach your bank in
  <Text as="span" weight="semibold">2 working days</Text>.
  Instant settlements are
  <Text as="span" color="positive" weight="medium">enabled</Text>.
</Text>
```

### Truncated and centred

```svelte
<script lang="ts">
  import { Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex w-[240px] flex-col gap-blade-3">
  <Text truncateAfterLines={2} size="small">
    Accept payments through UPI, cards, netbanking and wallets with one integration, and get settlements the next day.
  </Text>
  <Text class="text-center" size="xsmall" color="muted">Secured by Razorpay</Text>
</div>
```
