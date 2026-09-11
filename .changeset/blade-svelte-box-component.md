---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add Box component with className passthrough

Ships a minimal, polymorphic `Box` for blade-svelte. The `as` prop picks the rendered tag, `className` is forwarded as-is to the DOM element. No Blade style/spacing props — intended for consumers styling layout with utility CSS (e.g. checkout's Tailwind setup).
