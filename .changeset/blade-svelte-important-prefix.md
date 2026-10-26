---
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): read Tailwind v3's leading `!` for important

- Important is also Tailwind v3's leading `!` on the utility, after its variants (`!p-4`, `hover:!p-4`, `!-mt-2`), beside v4's trailing one (`p-4!`). A `!` before a variant (`!hover:p-4`) is not read, as in Tailwind v3
