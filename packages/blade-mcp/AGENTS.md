# blade-mcp — Agent Context

MCP (Model Context Protocol) server for the Blade Design System. Exposes Blade docs to AI agents via MCP tools along with other tools such as figma-to-code, create-new-blade-project, etc.

Blade MCP is in maintenance mode. New capabilities go into `packages/blade-plugin` (Claude Code plugin + cross-agent skills). The MCP stays for Cursor users without skills support and for the HTTP transport consumed by blade-chat.

## Package Structure

```
bladeSkill/          # Build output (gitignored). Copied from packages/blade-plugin/skills/blade by scripts/copyKnowledgebase.mjs. Never edit here.
src/
  tools/      # MCP tool definitions
  utils/      # Shared utilities
  server.ts   # MCP server entry point
scripts/
  copyKnowledgebase.mjs  # prebuild/pretest/predev copy step
```

Knowledgebase docs (components, patterns, general) are authored in `packages/blade-plugin/skills/blade/references/`. Authoring prompts live in `packages/blade-plugin/authoring/`.

## Quick Commands

> **Note:** Run these commands from the `packages/blade-mcp` directory.

| Task             | Command                                    |
| ---------------- | ------------------------------------------ |
| Build            | `yarn build`                               |
| Dev (watch)      | `yarn dev`                                 |
| Inspect MCP      | `yarn inspect`                             |
| Start server     | `yarn start` (requires build to run first) |
| Type check       | `yarn typecheck`                           |
| Run tests        | `yarn test`                                |
| Update snapshots | `yarn test:updateSnapshots`                |
