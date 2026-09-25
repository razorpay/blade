---
"@razorpay/blade": patch
---

fix(Toast): add missing drop shadow on web

Toast on web now renders the `midRaised` elevation drop shadow from the Figma design. The toast container gives the shadow room so it isn't clipped, while keeping the backdrop blur over stacked toasts intact.
