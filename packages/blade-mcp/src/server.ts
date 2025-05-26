#!/usr/bin/env node

import { join } from 'path';
import { readFileSync } from 'fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as Sentry from '@sentry/node';
import {
  createNewBladeProjectToolName,
  createNewBladeProjectToolDescription,
  createNewBladeProjectToolSchema,
  createNewBladeProjectToolCallback,
} from './tools/createNewBladeProject.js';
import {
  createBladeCursorRulesToolName,
  createBladeCursorRulesToolDescription,
  createBladeCursorRulesToolSchema,
  createBladeCursorRulesToolCallback,
} from './tools/createBladeCursorRules.js';
import {
  getBladeComponentDocsToolName,
  getBladeComponentDocsToolDescription,
  getBladeComponentDocsToolSchema,
  getBladeComponentDocsToolCallback,
} from './tools/getBladeComponentDocs.js';
import {
  hiBladeToolName,
  hiBladeToolDescription,
  hiBladeToolSchema,
  hiBladeToolCallback,
} from './tools/hiBlade.js';
import { getPackageJSONVersion, KNOWLEDGEBASE_DIRECTORY } from './utils.js';

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

  server.tool(hiBladeToolName, hiBladeToolDescription, hiBladeToolSchema, hiBladeToolCallback);

  server.tool(
    createNewBladeProjectToolName,
    createNewBladeProjectToolDescription,
    createNewBladeProjectToolSchema,
    createNewBladeProjectToolCallback,
  );

  server.tool(
    createBladeCursorRulesToolName,
    createBladeCursorRulesToolDescription,
    createBladeCursorRulesToolSchema,
    createBladeCursorRulesToolCallback,
  );

  server.tool(
    getBladeComponentDocsToolName,
    getBladeComponentDocsToolDescription,
    getBladeComponentDocsToolSchema,
    getBladeComponentDocsToolCallback,
  );

  server.tool(
    'get_blade_docs',
    'Fetch the latest Blade Design System docs. Use this to get information about the components, patterns, usage, props, and anything about design-system',
    {},
    () => {
      const baseBladeDocs = readFileSync(join(KNOWLEDGEBASE_DIRECTORY, 'base.md'), 'utf8');

      return {
        content: [
          {
            type: 'text',
            text: `Go through the docs that you need from this index:\n${baseBladeDocs.replaceAll(
              '<_dirname_>',
              KNOWLEDGEBASE_DIRECTORY,
            )}`,
          },
        ],
      };
    },
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
