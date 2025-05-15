#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  createNewBladeProjectCallback,
  createNewBladeProjectSchema,
  createNewBladeProjectDescription,
  createNewBladeProjectToolName,
} from './tools/createNewBladeProject.js';
import {
  createBladeCursorRulesCallback,
  createBladeCursorRulesSchema,
  createBladeCursorRulesDescription,
  createBladeCursorRulesToolName,
} from './tools/createBladeCursorRules.js';
import {
  getBladeComponentDocsCallback,
  getBladeComponentDocsSchema,
  getBladeComponentDocsDescription,
  getBladeComponentDocsToolName,
} from './tools/getBladeComponentDocs.js';
import {
  getFigmaToCodeCallback,
  getFigmaToCodeSchema,
  getFigmaToCodeDescription,
  getFigmaToCodeToolName,
} from './tools/getFigmaToCode.js';
import { getPackageJSONVersion } from './utils.js';
import {
  hiBladeCallback,
  hiBladeDescription,
  hiBladeSchema,
  hiBladeToolName,
} from './tools/hiBlade.js';

try {
  const server = new McpServer({
    name: 'Blade MCP',
    version: getPackageJSONVersion(),
  });

  server.tool(hiBladeToolName, hiBladeDescription, hiBladeSchema, hiBladeCallback);

  server.tool(
    createNewBladeProjectToolName,
    createNewBladeProjectDescription,
    createNewBladeProjectSchema,
    createNewBladeProjectCallback,
  );

  server.tool(
    createBladeCursorRulesToolName,
    createBladeCursorRulesDescription,
    createBladeCursorRulesSchema,
    createBladeCursorRulesCallback,
  );

  server.tool(
    getBladeComponentDocsToolName,
    getBladeComponentDocsDescription,
    getBladeComponentDocsSchema,
    getBladeComponentDocsCallback,
  );

  server.tool(
    getFigmaToCodeToolName,
    getFigmaToCodeDescription,
    getFigmaToCodeSchema,
    getFigmaToCodeCallback,
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
