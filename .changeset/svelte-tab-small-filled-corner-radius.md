---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(Tabs): align small filled horizontal tab corner radius with Blade React

- TabList container: 16px → 8px (`border.radius.small`)
- TabItem: 12px → 6px (deliberate mid-point between xsmall=4px and small=8px, mirrors SegmentedControl item)
- TabIndicator: 12px → 6px (mirrors SegmentedControl indicator)
- Focus ring: 12px → 8px (`border.radius.small`)
