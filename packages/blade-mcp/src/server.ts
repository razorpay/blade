#!/usr/bin/env node

import { createServer } from './createServer.js';
import { createStdioTransport } from './createTransport.js';
import { captureException, initSentry } from './utils/sentryUtils.js';

initSentry();

try {
  const server = createServer({ transportType: 'stdio' });
  const transport = createStdioTransport();
  await server.connect(transport);
  // Why console.error? Checkout https://modelcontextprotocol.io/quickstart/server#logging-in-mcp-servers-2
  console.error('Blade MCP connected successfully.');
} catch (error: unknown) {
  captureException(error);
  console.error('Blade MCP Error', error);
  process.exit(1);
}
