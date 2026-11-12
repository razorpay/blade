---
'@razorpay/blade': patch
---

fix(Drawer): fade the `DrawerHeader` gradient into the drawer body and tone it down

The header gradient used to stop with a visible edge where the header meets the drawer body, most noticeable in dark mode. It now fades to transparent towards the bottom of the header, and the whole gradient is softened to 64% opacity (`opacity[800]`) so the tint stays subtle. Applies to web and React Native, matching the updated Figma component.
