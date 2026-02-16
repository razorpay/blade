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
  server.registerTool(
    createBladeCursorRulesToolName,
    {
      description: createBladeCursorRulesToolDescription,
      inputSchema: createBladeCursorRulesToolSchema,
    },
    createBladeCursorRulesHttpCallback,
  );

  server.registerTool(
    getBladeComponentDocsToolName,
    {
      description: getBladeComponentDocsToolDescription,
      inputSchema: getBladeComponentDocsHttpSchema,
    },
    getBladeComponentDocsHttpCallback,
  );

  server.registerTool(
    getBladePatternDocsToolName,
    {
      description: getBladePatternDocsToolDescription,
      inputSchema: getBladePatternDocsHttpSchema,
    },
    getBladePatternDocsHttpCallback,
  );

  server.registerTool(
    getBladeGeneralDocsToolName,
    {
      description: getBladeGeneralDocsToolDescription,
      inputSchema: getBladeGeneralDocsHttpSchema,
    },
    getBladeGeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  server.registerTool(
    createBladeCursorRulesToolName,
    {
      description: createBladeCursorRulesToolDescription,
      inputSchema: createBladeCursorRulesToolSchema,
    },
    createBladeCursorRulesStdioCallback,
  );

  server.registerTool(
    getBladeComponentDocsToolName,
    {
      description: getBladeComponentDocsToolDescription,
      inputSchema: getBladeComponentDocsStdioSchema,
    },
    getBladeComponentDocsStdioCallback,
  );

  server.registerTool(
    getBladePatternDocsToolName,
    {
      description: getBladePatternDocsToolDescription,
      inputSchema: getBladePatternDocsStdioSchema,
    },
    getBladePatternDocsStdioCallback,
  );

  server.registerTool(
    getBladeGeneralDocsToolName,
    {
      description: getBladeGeneralDocsToolDescription,
      inputSchema: getBladeGeneralDocsStdioSchema,
    },
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

  server.registerTool(
    hiBladeToolName,
    {
      description: hiBladeToolDescription,
      inputSchema: hiBladeToolSchema,
    },
    hiBladeToolCallback,
  );

  server.registerTool(
    createNewBladeProjectToolName,
    {
      description: createNewBladeProjectToolDescription,
      inputSchema: createNewBladeProjectToolSchema,
    },
    createNewBladeProjectToolCallback,
  );

  server.registerTool(
    getFigmaToCodeToolName,
    {
      description: getFigmaToCodeToolDescription,
      inputSchema: getFigmaToCodeToolSchema,
    },
    getFigmaToCodeToolCallback,
  );

  server.registerTool(
    getChangelogToolName,
    {
      description: getChangelogToolDescription,
      inputSchema: getChangelogToolSchema,
    },
    getChangelogToolCallback,
  );

  server.registerTool(
    publishLinesOfCodeMetricToolName,
    {
      description: publishLinesOfCodeMetricToolDescription,
      inputSchema: publishLinesOfCodeMetricToolSchema,
    },
    publishLinesOfCodeMetricToolCallback,
  );

  return server;
};
