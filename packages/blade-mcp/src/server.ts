#!/usr/bin/env node

import { join } from 'path';
import { readFileSync } from 'fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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
// import {
//   getBladeComponentDocsCallback,
//   getBladeComponentDocsSchema,
//   getBladeComponentDocsDescription,
// } from './tools/getBladeComponentDocs.js';
import { hiBladeCallback, hiBladeSchema, hiBladeDescription } from './tools/hiBlade.js';
import { getPackageJSONVersion, KNOWLEDGEBASE_DIRECTORY } from './utils.js';

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

  // server.tool(
  //   'get_blade_component_docs',
  //   getBladeComponentDocsDescription,
  //   getBladeComponentDocsSchema,
  //   getBladeComponentDocsCallback,
  // );

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
            text: `Go through the docs that you need from this index:\n${baseBladeDocs}`,
          },
        ],
      };
    },
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();

  // Use Promise handling for async operations
  await server.connect(transport);
  console.error('Blade MCP connected successfully.');
} catch (error: unknown) {
  console.error('Blade MCP initialization failed:', error);
  process.exit(1);
}
