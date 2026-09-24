---
"@razorpay/blade": patch
---

fix(Toast): add elevation shadow to promotional toast on web

Promotional toasts on web were missing the elevation shadow specified in the Figma design. They now render with the `midRaised` elevation shadow, matching the existing React Native implementation. Informational toasts are unchanged.
