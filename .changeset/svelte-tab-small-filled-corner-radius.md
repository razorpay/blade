---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(Tabs): align small filled horizontal tab corner radius with Blade React

- TabList container: 16px → 8px (`border.radius.small`)
- TabItem: 12px → 6px (deliberate mid-point between xsmall=4px and small=8px, mirrors Blade React's hardcoded 6px and SegmentedControl item radius)
- TabIndicator: 12px → 6px (mirrors Blade React's hardcoded 6px and SegmentedControl indicator radius)
- Focus ring: 12px → 8px (`border.radius.small` — intentionally larger than item radius to prevent box-shadow inset clipping, consistent with Blade React)
- SegmentedControl: item and indicator radius changed from hardcoded 6px to `border.radius.xsmall` (4px) token for consistency with the token system
