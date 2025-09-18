import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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
import { getPackageJSONVersion } from './utils/generalUtils.js';
import {
  getBladePatternDocsToolName,
  getBladePatternDocsToolDescription,
  getBladePatternDocsToolSchema,
  getBladePatternDocsToolCallback,
} from './tools/getBladePatternDocs.js';
import {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsToolSchema,
  getBladeGeneralDocsToolCallback,
} from './tools/getBladeGeneralDocs.js';
import {
  getFigmaToCodeToolName,
  getFigmaToCodeToolDescription,
  getFigmaToCodeToolSchema,
  getFigmaToCodeToolCallback,
} from './tools/getFigmaToCode.js';
import {
  getChangelogToolName,
  getChangelogToolDescription,
  getChangelogToolSchema,
  getChangelogToolCallback,
} from './tools/getChangelog.js';

export const createServer = (): McpServer => {
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
    getBladePatternDocsToolName,
    getBladePatternDocsToolDescription,
    getBladePatternDocsToolSchema,
    getBladePatternDocsToolCallback,
  );

  server.tool(
    getBladeGeneralDocsToolName,
    getBladeGeneralDocsToolDescription,
    getBladeGeneralDocsToolSchema,
    getBladeGeneralDocsToolCallback,
  );

  server.tool(
    getFigmaToCodeToolName,
    getFigmaToCodeToolDescription,
    getFigmaToCodeToolSchema,
    getFigmaToCodeToolCallback,
  );

  server.tool(
    getChangelogToolName,
    getChangelogToolDescription,
    getChangelogToolSchema,
    getChangelogToolCallback,
  );

  return server;
};
