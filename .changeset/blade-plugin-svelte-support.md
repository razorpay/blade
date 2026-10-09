---
'@razorpay/blade-plugin': minor
---

feat(blade-plugin): add blade-svelte support

- New `blade-svelte` skill with a knowledgebase for every public `@razorpay/blade-svelte` component, a Svelte setup guide, the Svelte icon list, and the shared token and white-labelling docs.
- Skill scripts send `Blade Plugin Tool Called` instead of `Blade MCP Tool Called`, with a `framework` property (`react` or `svelte`). The `blade-svelte` skill reports lines of code like the `blade` skill.
- Hooks detect whether a project uses `@razorpay/blade`, `@razorpay/blade-svelte` or both, and point the agent at the matching skill.
- `blade-plugin` now versions independently of `blade-mcp`.
