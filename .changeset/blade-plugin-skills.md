---
'@razorpay/blade-mcp': minor
---

feat: introduce the Blade Claude Code plugin and move the knowledgebase into it

- New `packages/blade-plugin` (private, versioned with blade-mcp) with skills `blade`, `blade-upgrade`, `blade-new-project` and `blade-figma-to-code`, a 1:1 port of the Blade MCP tools including its analytics events. The knowledgebase now lives at `packages/blade-plugin/skills/blade/references` and is copied into blade-mcp at build time.
- `create_blade_skill` now installs the full `blade` skill (docs included) at `.agents/skills/blade` and removes the superseded `ui-code-guidelines` skill.
- `hi_blade` and docs tool responses point to the plugin. Blade MCP enters maintenance mode.
- Removed the unused `cursorRules` template and `skillTemplate`.
