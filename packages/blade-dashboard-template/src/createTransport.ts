import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { StreamableHTTPServerTransportOptions } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export const createStdioTransport = (): StdioServerTransport => {
  const transport = new StdioServerTransport();
  return transport;
};

/**
 * Creating streamable http transport for Blade MCP server.
 *
 * ```
 * import { createServer, createStreamableHttpTransport } from '@razorpay/blade-mcp';
 *
 * const server = createServer();
 *
 * // somewhere in your nodejs server. Refer to https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#streamable-http
 * const transport = createStreamableHttpTransport();
 * server.connect(transport);
 * ```
 */
export const createStreamableHttpTransport = (
  options: StreamableHTTPServerTransportOptions,
): StreamableHTTPServerTransport => {
  const transport = new StreamableHTTPServerTransport(options);
  return transport;
};
