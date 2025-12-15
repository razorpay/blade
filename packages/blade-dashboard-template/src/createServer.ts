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
  createBladeCursorRulesStdioCallback,
  createBladeCursorRulesHttpCallback,
} from './tools/createBladeCursorRules.js';
import {
  getBladeComponentDocsToolName,
  getBladeComponentDocsToolDescription,
  getBladeComponentDocsHttpSchema,
  getBladeComponentDocsStdioSchema,
  getBladeComponentDocsStdioCallback,
  getBladeComponentDocsHttpCallback,
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
  getBladePatternDocsHttpSchema,
  getBladePatternDocsHttpCallback,
  getBladePatternDocsStdioSchema,
  getBladePatternDocsStdioCallback,
} from './tools/getBladePatternDocs.js';
import {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsHttpCallback,
  getBladeGeneralDocsHttpSchema,
  getBladeGeneralDocsStdioSchema,
  getBladeGeneralDocsStdioCallback,
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
import {
  publishLinesOfCodeMetricToolName,
  publishLinesOfCodeMetricToolDescription,
  publishLinesOfCodeMetricToolSchema,
  publishLinesOfCodeMetricToolCallback,
} from './tools/publishLinesOfCodeMetric.js';
import { setMcpSseAnalyticsContext } from './utils/analyticsUtils.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpsServerTools = (server: McpServer): void => {
  server.tool(
    createBladeCursorRulesToolName,
    createBladeCursorRulesToolDescription,
    createBladeCursorRulesToolSchema,
    createBladeCursorRulesHttpCallback,
  );

  server.tool(
    getBladeComponentDocsToolName,
    getBladeComponentDocsToolDescription,
    getBladeComponentDocsHttpSchema,
    getBladeComponentDocsHttpCallback,
  );

  server.tool(
    getBladePatternDocsToolName,
    getBladePatternDocsToolDescription,
    getBladePatternDocsHttpSchema,
    getBladePatternDocsHttpCallback,
  );

  server.tool(
    getBladeGeneralDocsToolName,
    getBladeGeneralDocsToolDescription,
    getBladeGeneralDocsHttpSchema,
    getBladeGeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  server.tool(
    createBladeCursorRulesToolName,
    createBladeCursorRulesToolDescription,
    createBladeCursorRulesToolSchema,
    createBladeCursorRulesStdioCallback,
  );

  server.tool(
    getBladeComponentDocsToolName,
    getBladeComponentDocsToolDescription,
    getBladeComponentDocsStdioSchema,
    getBladeComponentDocsStdioCallback,
  );

  server.tool(
    getBladePatternDocsToolName,
    getBladePatternDocsToolDescription,
    getBladePatternDocsStdioSchema,
    getBladePatternDocsStdioCallback,
  );

  server.tool(
    getBladeGeneralDocsToolName,
    getBladeGeneralDocsToolDescription,
    getBladeGeneralDocsStdioSchema,
    getBladeGeneralDocsStdioCallback,
  );
};
export const createServer = ({
  transportType = 'stdio',
}: {
  transportType?: 'stdio' | 'http';
}): McpServer => {
  const server = new McpServer({
    name: 'Blade MCP',
    version: getPackageJSONVersion(),
  });

  setMcpSseAnalyticsContext({ protocol: transportType });

  if (transportType === 'http') {
    httpsServerTools(server);
  } else {
    stdioServerTools(server);
  }

  server.tool(hiBladeToolName, hiBladeToolDescription, hiBladeToolSchema, hiBladeToolCallback);

  server.tool(
    createNewBladeProjectToolName,
    createNewBladeProjectToolDescription,
    createNewBladeProjectToolSchema,
    createNewBladeProjectToolCallback,
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

  server.tool(
    publishLinesOfCodeMetricToolName,
    publishLinesOfCodeMetricToolDescription,
    publishLinesOfCodeMetricToolSchema,
    publishLinesOfCodeMetricToolCallback,
  );

  return server;
};
