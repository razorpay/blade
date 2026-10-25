---
'@razorpay/blade-plugin': patch
---

feat(blade-plugin): teach apps to compose their own components on blade-svelte

- blade-svelte skill: `references/general/Composing.md` (when to compose, the file layout, provider defaults through `useComponentDefaults` and `ComponentStyleProps`, placing Blade's parts with `class`, `classes` and the part resolvers, `getAdapters()`, the `/runes` entry, a responsive dialog example)
- `authoring/composed-components.prompt.txt`: the doc prompt for a component an app builds on blade-svelte
- The Svelte knowledgebase lint and drift check run against another package's docs (`--package`, `--docs`, `--config`)
