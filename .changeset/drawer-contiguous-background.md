---
"@razorpay/blade": minor
---

feat(Drawer): add `backgroundStyle` prop to `DrawerHeader` for contiguous gradient background

Adds a new `backgroundStyle` prop to `DrawerHeader` with two values:
- `'default'` (existing behavior): gradient is applied only to the header section with a divider separating header from body
- `'contiguous'`: gradient spans the full drawer from the top, creating a seamless one-surface appearance without a visual break between header and body. The divider is hidden by default in this mode.
