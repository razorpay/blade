---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(Button): add `neutral` color

- `color="neutral"` is available with `variant="primary"` and renders a filled neutral button
- `ButtonGroup` colors are unchanged
- `CardHeaderIconButton` `color` now accepts only `primary` and `white`, the colors its tertiary button supports. `positive` and `negative` already threw an error at render, so code passing them now fails to type-check instead
