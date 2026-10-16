## Component Name

TrustBadge

## Description

TrustBadge shows that a business is trusted by Razorpay. It renders the branded shield (`RazorpayTrustIcon`) next to a pill with a trust label, which defaults to "Razorpay Trusted Business". The `icon-only` variant shows only the shield for compact surfaces. `AppBarLeading` renders TrustBadge for you through its `trustBadgeVariant` and `trustBadgeLabel` props.

## Important Constraints

- TrustBadge takes no children and no icon; the shield is always `RazorpayTrustIcon` and the text comes only from `label`
- With `variant="icon-only"` the label is not rendered as text; it becomes the `aria-label` of the shield (`role="img"`)
- With `variant="default"` the shield is `aria-hidden` and the visible label is the accessible text

## TypeScript Types

These are the props the TrustBadge component accepts.

```typescript
type TrustBadgeVariant = 'default' | 'icon-only';

type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - `'default'`: brand shield + the trust label pill.
   * - `'icon-only'`: shield only — no pill/text. For compact/dense surfaces.
   *
   * @default 'default'
   */
  variant?: TrustBadgeVariant;

  /**
   * Trust label displayed in the pill (only visible when `variant='default'`).
   * Also used as the accessible label for the icon-only form.
   *
   * @default 'Razorpay Trusted Business'
   */
  label?: string;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Place TrustBadge next to the merchant name or logo on checkout and payment pages to signal trust.
- Use `variant="icon-only"` in dense headers or narrow mobile layouts; keep a meaningful `label` because it is still announced.
- Keep the default label unless the product has an approved alternative such as "Razorpay Verified".
- Use margin styled props (`marginLeft`, `marginTop`) to space it from neighbouring content.

**Don't**

- Don't add TrustBadge inside `AppBar` yourself; set `trustBadgeVariant` on `AppBarLeading` instead.
- Don't use TrustBadge for payment or order status; use `Badge` with a semantic `color`.
- Don't render `RazorpayTrustIcon` on its own to mean "trusted"; use TrustBadge so the label and accessibility are handled.
- Don't write long sentences in `label`; use `Text` next to the badge for extra explanation.

## Examples

### Merchant header on a checkout page

The default badge beside a merchant name, with a custom test ID and analytics attributes.

```svelte
<script lang="ts">
  import { TrustBadge, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="merchant">
  <div>
    <Heading size="small">Acme Electronics</Heading>
    <Text size="small" color="surface.text.gray.muted">Order #order_9A33XWu170gUtm</Text>
  </div>
  <TrustBadge
    marginLeft="spacing.4"
    testID="checkout-trust-badge"
    data-analytics-section="checkout-header"
  />
</div>

<style>
  .merchant {
    display: flex;
    align-items: center;
    padding: var(--spacing-5);
    background-color: var(--surface-background-gray-subtle);
  }
</style>
```

### Compact badge on a mobile summary

The icon-only variant with a custom label that screen readers announce.

```svelte
<script lang="ts">
  import { Box, TrustBadge, Text } from '@razorpay/blade-svelte/components';
</script>

<Box className="display-flex items-center gap-spacing-2">
  <Text size="medium" weight="semibold">Paying Acme Electronics</Text>
  <TrustBadge variant="icon-only" label="Razorpay Verified" />
</Box>
```
