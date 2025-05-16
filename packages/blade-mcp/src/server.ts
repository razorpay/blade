#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as Sentry from '@sentry/node';
import {
  createNewBladeProjectCallback,
  createNewBladeProjectSchema,
  createNewBladeProjectDescription,
} from './tools/createNewBladeProject.js';
import {
  createBladeCursorRulesCallback,
  createBladeCursorRulesSchema,
  createBladeCursorRulesDescription,
} from './tools/createBladeCursorRules.js';
import {
  getBladeComponentDocsCallback,
  getBladeComponentDocsSchema,
  getBladeComponentDocsDescription,
} from './tools/getBladeComponentDocs.js';
import { hiBladeCallback, hiBladeSchema, hiBladeDescription } from './tools/hiBlade.js';
import { getPackageJSONVersion } from './utils.js';

Sentry.init({
  dsn: process.env.BLADE_MCP_SENTRY_DSN,
  environment: process.env.NODE_ENV ?? 'development',
  release: getPackageJSONVersion(),
  sendDefaultPii: false,
});

try {
  const server = new McpServer({
    name: 'Blade MCP',
    version: getPackageJSONVersion(),
  });

  server.tool('hi_blade', hiBladeDescription, hiBladeSchema, hiBladeCallback);

  server.tool(
    'create_new_blade_project',
    createNewBladeProjectDescription,
    createNewBladeProjectSchema,
    createNewBladeProjectCallback,
  );

  server.tool(
    'create_blade_cursor_rules',
    createBladeCursorRulesDescription,
    createBladeCursorRulesSchema,
    createBladeCursorRulesCallback,
  );

  server.tool(
    'get_blade_component_docs',
    getBladeComponentDocsDescription,
    getBladeComponentDocsSchema,
    getBladeComponentDocsCallback,
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();

  // Use Promise handling for async operations
  await server.connect(transport);
  console.log('Blade MCP connected successfully.');
} catch (error: unknown) {
  Sentry.captureException(error);
  console.error('Blade MCP Error', error);
  process.exit(1);
}
