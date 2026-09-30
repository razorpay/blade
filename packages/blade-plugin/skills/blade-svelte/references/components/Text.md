## Component Name

Text

## Description

Text renders body copy and supporting text with Blade typography tokens. `variant="body"` is for main content and `variant="caption"` for small supporting text; `size`, `weight` and `color` tune it, and `truncateAfterLines` clamps long content. Use `as` to render it as a paragraph, inline span, label, citation or abbreviation, and nest Text inside Text for inline emphasis.

## Important Constraints

- `variant="caption"` only accepts `size="small"` or `size="medium"`; any other size logs an error and falls back to `small`.
- `as` only accepts `p`, `span`, `div`, `abbr`, `figcaption`, `cite`, `q` and `label`; other values log an error.
- `truncateAfterLines` only clamps between 1 and 10 lines, and is read once when the component mounts.
- Setting `styleOverride.root` switches the text color to `currentColor`, so the override class must set `color`.
- Only `data-analytics-*` attributes reach the DOM besides the documented props; `id`, `for`, `aria-*` and other HTML attributes are not supported.
- `textDecorationLine="dotted"` from React Blade is not supported.

## TypeScript Types

These are the props the Text component accepts; defaults are `as="p"`, `variant="body"`, `size="medium"` (body), `weight="regular"` and `color="surface.text.gray.normal"`.

```typescript
type TextVariant = 'body' | 'caption';

type TextAs = 'p' | 'span' | 'div' | 'abbr' | 'figcaption' | 'cite' | 'q' | 'label';

/**
 * Text color tokens, e.g. 'surface.text.gray.normal', 'surface.text.gray.muted',
 * 'surface.text.primary.normal', 'feedback.text.positive.intense',
 * 'interactive.text.primary.normal'. See Tokens.md for the full list.
 */
type TextColors =
  | `interactive.text.${string}`
  | `surface.text.${string}`
  | `feedback.text.${string}`;

type TextSlot = 'root';

type TextCommonProps = {
  as?: TextAs;
  truncateAfterLines?: number;
  children: Snippet | string;
  weight?: 'regular' | 'medium' | 'semibold';
  /**
   * Overrides the color of the Text component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of text
   */
  color?: TextColors | 'currentColor';
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  textDecorationLine?: 'line-through' | 'none' | 'underline';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  testID?: string;
  className?: string;
  styleOverride?: Partial<Record<TextSlot, string>>;
} & StyledPropsBlade;

type TextBodyVariant = TextCommonProps & {
  variant?: 'body';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

type TextCaptionVariant = TextCommonProps & {
  variant?: 'caption';
  size?: 'small' | 'medium';
};

type TextProps<T> = T extends { variant: infer Variant }
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;
```

## Usage Guidelines

**Do**

- Use `Text` for paragraphs, descriptions, table cell content and helper copy.
- Use `variant="body"` for main content and `variant="caption"` with `size="small"` or `size="medium"` for fine print such as timestamps or footnotes.
- Use `as="span"` for inline emphasis inside another Text, and `as="label"` for plain labels next to custom controls.
- Use `color="surface.text.gray.muted"` for secondary information and `feedback.text.*` tokens for status copy.
- Use `truncateAfterLines` for descriptions in fixed-height layouts such as cards and list rows.
- Space Text from neighbours with margin props (`marginBottom="spacing.3"`).

**Don't**

- Don't use `Text` for page or section titles; use `Heading`.
- Don't use `Text` for inline code, API keys or IDs; use `Code`.
- Don't use `Text` for actions; use `Link` or `Button`.
- Don't nest Text more than one level deep; split the copy into separate Text elements instead.

## Examples

### Payment confirmation copy

Body, muted and caption text with an inline semibold span and a status color.

```svelte
<script lang="ts">
  import { Box, Text } from '@razorpay/blade-svelte/components';

  const amount = '₹4,999.00';
  const paymentId = 'pay_Nf29aK1xYz';
</script>

<Box className="display-flex flex-col gap-spacing-2">
  <Text size="large" weight="semibold" color="feedback.text.positive.intense">Payment successful</Text>
  <Text>
    We have received <Text as="span" weight="semibold">{amount}</Text> from Acme Retail. It will be
    settled to your bank account in T+2 working days.
  </Text>
  <Text size="small" color="surface.text.gray.muted" testID="payment-id">
    Payment ID: {paymentId}
  </Text>
  <Text variant="caption" size="small" color="surface.text.gray.muted" marginTop="spacing.2">
    Settlement timelines may vary on bank holidays.
  </Text>
</Box>
```

### Truncated description in a list

Clamp long plan descriptions to two lines so rows keep the same height.

```svelte
<script lang="ts">
  import { Box, Heading, Text } from '@razorpay/blade-svelte/components';

  const plans = [
    {
      id: 'plan_monthly',
      name: 'Monthly subscription',
      description:
        'Charges customers every month on the billing date. Failed charges are retried three times over five days before the subscription is halted.',
    },
    {
      id: 'plan_annual',
      name: 'Annual subscription',
      description:
        'Charges customers once a year with an optional upfront discount. Customers get a reminder email seven days before renewal.',
    },
  ];
</script>

<Box as="section" className="display-flex flex-col gap-spacing-4">
  {#each plans as plan (plan.id)}
    <Box className="display-flex flex-col gap-spacing-1">
      <Heading size="small">{plan.name}</Heading>
      <Text size="small" truncateAfterLines={2} wordBreak="break-word" color="surface.text.gray.muted">
        {plan.description}
      </Text>
    </Box>
  {/each}
</Box>
```
