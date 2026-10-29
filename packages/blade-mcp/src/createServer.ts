import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  createNewBladeProjectToolName,
  createNewBladeProjectToolDescription,
  createNewBladeProjectToolSchema,
  createNewBladeProjectToolCallback,
} from './tools/createNewBladeProject.js';
import {
  createBladeSkillToolName,
  createBladeSkillToolDescription,
  createBladeSkillToolSchema,
  createBladeSkillStdioCallback,
  createBladeSkillHttpCallback,
} from './tools/createBladeSkill.js';
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
import { sendAnalytics, setMcpSseAnalyticsContext } from './utils/analyticsUtils.js';
import { analyticsToolCallEventName, MCP_DEPRECATION_NUDGE } from './utils/tokens.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpsServerTools = (server: McpServer): void => {
  server.tool(
    createBladeSkillToolName,
    createBladeSkillToolDescription,
    createBladeSkillToolSchema,
    createBladeSkillHttpCallback,
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
    createBladeSkillToolName,
    createBladeSkillToolDescription,
    createBladeSkillToolSchema,
    createBladeSkillStdioCallback,
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

  // MCP is deprecated: every tool keeps its name (so clients still list it) but gets an empty
  // schema and the nudge as callback. The schema must be empty: input validation runs before the
  // callback, so stale clients sending old arguments would otherwise get a validation error
  // instead of the nudge. Done here so new tools can't forget it.
  const registerTool = server.tool.bind(server) as (...args: unknown[]) => unknown;
  (server as { tool: unknown }).tool = (name: string, description: string) =>
    registerTool(name, `[DEPRECATED, install the Blade plugin] ${description}`, {}, () => {
      sendAnalytics({
        eventName: analyticsToolCallEventName,
        properties: { toolName: name, deprecated: true },
      });
      return { isError: true, content: [{ type: 'text', text: MCP_DEPRECATION_NUDGE }] };
    });

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
