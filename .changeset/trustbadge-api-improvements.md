---
"@razorpay/blade": major
"@razorpay/blade-core": major
"@razorpay/blade-svelte": major
---

fix(TrustBadge, AppBar): improve TrustBadge API — rename variant `'default'` to `'full'` and group AppBarLeading trust-badge props into a single `trustBadge` object

**Breaking changes:**

- `TrustBadgeVariant`: `'default'` renamed to `'full'`. Update `variant="default"` to `variant="full"` on `<TrustBadge>` and in the `trustBadge.variant` prop on `<AppBarLeading>`.
- `AppBarLeading`: flat props `trustBadgeVariant` and `trustBadgeLabel` replaced by a single `trustBadge?: { variant?, label? }` object prop, mirroring the `backButton` object pattern already used on `AppBar`.

**Migration:**

```jsx
// Before
<TrustBadge variant="default" />
<AppBarLeading trustBadgeVariant="default" trustBadgeLabel="Razorpay Verified" />

// After
<TrustBadge variant="full" />
<AppBarLeading trustBadge={{ variant: 'full', label: 'Razorpay Verified' }} />
```
