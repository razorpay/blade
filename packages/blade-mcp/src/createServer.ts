import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

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

/**
 * Wrapper around server.registerTool that prevents TypeScript from deeply
 * inferring InputArgs through the MCP SDK's dual Zod v3/v4 SchemaOutput
 * conditional type, which causes "Type instantiation is excessively deep
 * and possibly infinite" errors with complex Zod schemas.
 */
function registerToolSafe(
  server: McpServer,
  name: string,
  config: { description: string; inputSchema?: Record<string, z.ZodTypeAny> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: ToolCallback<any>,
): void {
  server.registerTool(name, config, cb);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpsServerTools = (server: McpServer): void => {
  registerToolSafe(
    server,
    createBladeCursorRulesToolName,
    {
      description: createBladeCursorRulesToolDescription,
      inputSchema: createBladeCursorRulesToolSchema,
    },
    createBladeCursorRulesHttpCallback,
  );

  registerToolSafe(
    server,
    getBladeComponentDocsToolName,
    {
      description: getBladeComponentDocsToolDescription,
      inputSchema: getBladeComponentDocsHttpSchema,
    },
    getBladeComponentDocsHttpCallback,
  );

  registerToolSafe(
    server,
    getBladePatternDocsToolName,
    {
      description: getBladePatternDocsToolDescription,
      inputSchema: getBladePatternDocsHttpSchema,
    },
    getBladePatternDocsHttpCallback,
  );

  registerToolSafe(
    server,
    getBladeGeneralDocsToolName,
    {
      description: getBladeGeneralDocsToolDescription,
      inputSchema: getBladeGeneralDocsHttpSchema,
    },
    getBladeGeneralDocsHttpCallback,
  );
};

const stdioServerTools = (server: McpServer): void => {
  registerToolSafe(
    server,
    createBladeCursorRulesToolName,
    {
      description: createBladeCursorRulesToolDescription,
      inputSchema: createBladeCursorRulesToolSchema,
    },
    createBladeCursorRulesStdioCallback,
  );

  registerToolSafe(
    server,
    getBladeComponentDocsToolName,
    {
      description: getBladeComponentDocsToolDescription,
      inputSchema: getBladeComponentDocsStdioSchema,
    },
    getBladeComponentDocsStdioCallback,
  );

  registerToolSafe(
    server,
    getBladePatternDocsToolName,
    {
      description: getBladePatternDocsToolDescription,
      inputSchema: getBladePatternDocsStdioSchema,
    },
    getBladePatternDocsStdioCallback,
  );

  registerToolSafe(
    server,
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

  registerToolSafe(
    server,
    hiBladeToolName,
    {
      description: hiBladeToolDescription,
      inputSchema: hiBladeToolSchema,
    },
    hiBladeToolCallback,
  );

  registerToolSafe(
    server,
    createNewBladeProjectToolName,
    {
      description: createNewBladeProjectToolDescription,
      inputSchema: createNewBladeProjectToolSchema,
    },
    createNewBladeProjectToolCallback,
  );

  registerToolSafe(
    server,
    getFigmaToCodeToolName,
    {
      description: getFigmaToCodeToolDescription,
      inputSchema: getFigmaToCodeToolSchema,
    },
    getFigmaToCodeToolCallback,
  );

  registerToolSafe(
    server,
    getChangelogToolName,
    {
      description: getChangelogToolDescription,
      inputSchema: getChangelogToolSchema,
    },
    getChangelogToolCallback,
  );

  registerToolSafe(
    server,
    publishLinesOfCodeMetricToolName,
    {
      description: publishLinesOfCodeMetricToolDescription,
      inputSchema: publishLinesOfCodeMetricToolSchema,
    },
    publishLinesOfCodeMetricToolCallback,
  );

  return server;
};
