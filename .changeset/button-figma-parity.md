---
'@razorpay/blade': patch
---

fix(Button): align shadow, disabled and focus styles with Figma

- Filled `primary`, `positive` and `negative` buttons use a stronger inner highlight
- `secondary` and `tertiary` buttons use a darker bottom edge on hover
- `white` buttons use the updated bottom edge, and `white` `secondary` and `tertiary` buttons use a lighter disabled fill
- The focus ring is now a 4px outline with a 1px gap
- `FloatingActionButton` loading dots use the same colors as `Button`: `primary` and `neutral` FABs no longer show white dots on the faded loading surface
