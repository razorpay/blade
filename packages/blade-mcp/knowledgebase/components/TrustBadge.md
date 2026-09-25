# TrustBadge

## Component Name

TrustBadge

## Description

TrustBadge shows that a business is trusted. It has a brand shield and a pill with a trust label. The `label` prop is required — consumers own the copy (e.g. "Razorpay Trusted Business"). The `icon-only` variant shows only the shield for small spaces. `AppBarLeading` uses TrustBadge through its `trustBadgeVariant` prop.

## Usage Guidelines

- Use TrustBadge near a merchant name or logo to show trust.
- Use `variant="icon-only"` in dense layouts. The label is still used as the accessible label.
- Inside `AppBar`, use `trustBadgeVariant` on `AppBarLeading` instead of adding TrustBadge yourself.

## TypeScript Types

```typescript
type TrustBadgeProps = {
  /**
   * Visual variant of the badge.
   * - 'default': brand shield and trust label pill
   * - 'icon-only': shield only, no text
   * @default 'default'
   */
  variant?: 'default' | 'icon-only';
  /**
   * Trust label displayed in the pill (only visible when `variant='default'`).
   * Also used as the accessible label for the icon-only form.
   * The component ships no default copy — consumers own this text.
   */
  label: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

## Examples

### TrustBadge Variants

```tsx
import React from 'react';
import { TrustBadge, Box } from '@razorpay/blade/components';

function TrustBadgeExample(): React.ReactElement {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
    >
      <TrustBadge label="Razorpay Trusted Business" />
      <TrustBadge variant="icon-only" label="Razorpay Trusted Business" />
      <TrustBadge label="Razorpay Verified" />
    </Box>
  );
}

export default TrustBadgeExample;
```
