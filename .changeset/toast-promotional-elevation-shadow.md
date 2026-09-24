---
"@razorpay/blade": patch
---

fix(Toast): add elevation shadow to promotional toast on web

Promotional toasts on web were missing the elevation shadow specified in the Figma design. The toast surface now composes the `midRaised` elevation shadow ahead of the inset border/highlight shadows, and the toast container no longer clips the wrapper of promotional toasts (`overflow: visible`), which was masking the shadow. Informational toasts are unchanged, and this brings web to parity with the existing React Native implementation.
