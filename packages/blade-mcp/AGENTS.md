# blade-mcp — Agent Context

MCP (Model Context Protocol) server for the Blade Design System. Exposes Blade docs to AI agents via MCP tools along with other tools such as figma-to-code, create-new-blade-project, etc.

## Package Structure

```
knowledgebase/       # Component, Pattern and General Documentation of Blade. This is where most changes happen.
src/
  tools/      # MCP tool definitions
  utils/      # Shared utilities
  server.ts   # MCP server entry point
```

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
