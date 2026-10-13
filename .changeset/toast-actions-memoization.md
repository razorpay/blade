---
"@razorpay/blade": minor
"@razorpay/blade-svelte": minor
"@razorpay/blade-mcp": minor
---

feat(Toast): add useToastActions() hook with referentially-stable show/dismiss decoupled from toast-state subscription

Introduces a new `useToastActions()` hook across React Web, React Native, and Svelte that returns stable `show` and `dismiss` functions without subscribing to the toast-state store. Components using this hook will NOT re-render when toasts are shown or dismissed. `useToast()` remains backward compatible but now also returns stable `show`/`dismiss` references.
