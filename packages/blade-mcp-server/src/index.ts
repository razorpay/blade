import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get package.json path and read version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

try {
  const server = new McpServer({
    name: 'Blade MCP Server',
    version: packageJson.version,
  });

  server.tool(
    'get-blade-components',
    `Return a list of Blade Design System components' knowledgebase files required for generating UI code`,
    { componentList: z.string() },
    async ({ componentList }: { componentList: string }) => ({
      content: [{ type: 'text', text: `List of Blade components: ${componentList}` }],
    }),
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();

  // Use Promise handling for async operations
  await server.connect(transport);
  console.error('Blade MCP Server connected successfully');
} catch (error) {
  console.error('Blade MCP Server initialization failed:', error);
  process.exit(1);
}
