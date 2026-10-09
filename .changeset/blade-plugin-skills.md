---
'@razorpay/blade-mcp': minor
---

feat: introduce the Blade Claude Code plugin and move the knowledgebase into it

- New `packages/blade-plugin` (private, versioned with blade-mcp) with a single `blade` skill (docs plus upgrade, new-project and figma-to-code workflows), a 1:1 port of the Blade MCP tools including its analytics events. The knowledgebase now lives at `packages/blade-plugin/skills/blade/references` and is copied into blade-mcp at build time.
- Blade MCP behaviour is unchanged: `create_blade_skill` still installs the `ui-code-guidelines` skill (version `1.0.0`), docs tools return the same output, and analytics are untouched. Only the docs source moved.
- `hi_blade` mentions the plugin. Blade MCP enters maintenance mode.
