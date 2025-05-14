#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
// eslint-disable-next-line import/extensions
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line import/extensions
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { workingDirectory } from './utils/get-working-dir.js';
import {
  registerHiBladeTool,
  registerGetBladeComponentDocsTool,
  registerCreateBladeCursorRulesTool,
  registerCreateNewBladeProjectTool,
  registerFigmaToCodeTool,
} from './tools/index.js';

// Get package.json path and read version
const packageJson = JSON.parse(readFileSync(resolve(workingDirectory, './package.json'), 'utf8'));

try {
  const server = new McpServer({
    name: 'Blade MCP',
    version: packageJson.version,
  });

  registerHiBladeTool(server);
  registerCreateNewBladeProjectTool(server);
  registerCreateBladeCursorRulesTool(server);
  registerGetBladeComponentDocsTool(server);
  registerFigmaToCodeTool(server);

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();

  // Use Promise handling for async operations
  await server.connect(transport);
  console.error('Blade MCP connected successfully.');
} catch (error: unknown) {
  console.error('Blade MCP initialization failed:', error);
  process.exit(1);
}
