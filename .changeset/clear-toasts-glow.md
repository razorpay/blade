---
"@razorpay/blade": minor
---

feat(Toast): add opt-in glass variant to promotional toast

- `variant: 'glass'` (web only) gives a promotional toast a lighter backdrop blur, a thinner border and a larger corner radius.
- The glass toast scales in and out from its centre instead of sliding.
- Informational toasts ignore `variant`. Toasts without `variant` do not change.
