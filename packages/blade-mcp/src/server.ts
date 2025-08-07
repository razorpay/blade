#!/usr/bin/env node

import * as Sentry from '@sentry/node';
import { getPackageJSONVersion } from './utils/generalUtils.js';
import { createServer } from './createServer.js';
import { createStdioTransport } from './createTransport.js';

Sentry.init({
  dsn: process.env.BLADE_MCP_SENTRY_DSN,
  environment: process.env.NODE_ENV ?? 'development',
  release: getPackageJSONVersion(),
  sendDefaultPii: false,
});

try {
  const server = createServer();
  const transport = createStdioTransport();
  await server.connect(transport);
  // Why console.error? Checkout https://modelcontextprotocol.io/quickstart/server#logging-in-mcp-servers-2
  console.error('Blade MCP connected successfully.');
} catch (error: unknown) {
  Sentry.captureException(error);
  console.error('Blade MCP Error', error);
  process.exit(1);
}
