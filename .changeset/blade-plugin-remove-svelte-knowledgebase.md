---
'@razorpay/blade-plugin': minor
---

feat(blade-plugin): remove the blade-svelte skill and its knowledgebase

- The `blade-svelte` skill and its reference docs are removed. They documented the previous `@razorpay/blade-svelte` API, which has been replaced.
- The SessionStart hook only nudges to the `blade` skill. Projects that use only `@razorpay/blade-svelte` get no nudge, and in projects that use both packages the nudge says the `blade` skill covers `.tsx`/`.jsx` files only.
- Skill analytics always report `framework: 'react'`.
