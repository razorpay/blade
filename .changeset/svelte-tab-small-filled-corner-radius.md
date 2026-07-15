---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(Tabs): align small filled horizontal tab corner radius with Blade React

- TabList container: 16px → 8px (`border.radius.small`)
- TabItem: 12px → 4px (`border.radius.xsmall`, mirrors SegmentedControl item)
- TabIndicator: 12px → 4px (`border.radius.xsmall`, mirrors SegmentedControl indicator)
- Focus ring: 12px → 8px (`border.radius.small` — intentionally larger than item radius to prevent 4px box-shadow inset clipping, consistent with Blade React)
