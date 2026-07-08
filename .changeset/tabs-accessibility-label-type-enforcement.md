---
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): enforce accessibilityLabel at type level for icon-only TabItem

Split `TabItemWithLeadingProps` into two discriminated variants — `TabItemIconOnlyProps` (accessibilityLabel required) and `TabItemIconWithLabelProps` (accessibilityLabel optional) — to enforce accessibility requirements at compile time.
