# TrustBadge

## Component Name

TrustBadge

## Description

TrustBadge shows that a business is trusted. It has a brand shield and a pill with a trust label. The default label is "Razorpay Trusted Business". The `icon-only` variant shows only the shield for small spaces. `AppBarLeading` uses TrustBadge through its `trustBadgeVariant` prop.

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
   * Trust label in the pill. Also used as the accessible label for the icon-only form.
   * @default 'Razorpay Trusted Business'
   */
  label?: string;
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
      <TrustBadge />
      <TrustBadge variant="icon-only" />
      <TrustBadge label="Razorpay Verified" />
    </Box>
  );
}

export default TrustBadgeExample;
```
