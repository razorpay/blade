# Blade MCP Server

[![npm version](https://img.shields.io/npm/v/@razorpay/blade-mcp-server.svg)](https://www.npmjs.com/package/@razorpay/blade-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Blade MCP Server is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) that implements Razorpay's Design Guidelines and allows anyone to build Web Interfaces using Blade Design System.


## Prerequisites

- Node.js 18.x or higher ([install using NVM](https://github.com/nvm-sh/nvm#installing-and-updating))

## Integrations

### Cursor  or VS Code

Create or update your `mcp.json` file with:

```json
{
  "mcpServers": {
    "blade-mcp-server": {
      "command": "npx",
      "args": ["@razorpay/blade-mcp-server@latest"]
    }
  }
}

```

### Claude Desktop

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blade-mcp-server": {
      "command": "npx",
      "args": ["@razorpay/blade-mcp-server@latest"]
    }
  }
}
```
> [!NOTE]
> * Learn about how to configure MCP servers in [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
> * Learn how to install [Claude Desktop](https://claude.ai/download)

## Usage Example

```
Can you create a signup form with best UX practices using Blade?
```

The AI agents will use the MCP server to retrieve components and generate appropriate code.

## Local Development Setup

### Clone the repository
```bash
# Clone the repository
git clone https://github.com/razorpay/blade.git
cd blade

# Install dependencies
yarn

# Navigate to the MCP server package
cd packages/blade-mcp-server

# Build the package
yarn build
```

### Local Development with Cursor

For local development with Cursor, update your `mcp.json` with the local path:

```json
{
  "blade-mcp-server": {
    "command": "node",
    "args": ["<<USER_PATH>>/blade/packages/blade-mcp-server/dist/index.js"]
  }
}
```

Replace the `<<USER_PATH>>` with your actual local path to the repository.


## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © Razorpay 