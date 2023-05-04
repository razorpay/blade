---
"@razorpay/blade": patch
---

fix(blade): bottomsheet isOpen state, simplify isOpen logic & glue code

Previously if users did not changed the isOpen state to false inside `onDismiss` the bottomsheet's internal state will still remain "open", but the bottomsheet would visually be hidden and the backdrop will still remain, this fixes the bug so that internally we won't modify the bottomsheet's position instead we will just call the `onDismiss`. [Check the loom](https://www.loom.com/share/f24fcb51b245431fbf1a0aeb53cea287) video here for more info.

