import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CONFIG } from '../../config.js';

const toolName = 'get_figma_to_code';
const toolDescription = `Converts Figma designs into Blade Design System code. Provide a Figma design URL to generate the corresponding React components using Blade's component library.`;

const toolSchema = {
  fileKey: z
    .string()
    .describe(
      'The unique identifier of your Figma file, found in the URL after "figma.com/file/" or "figma.com/design/". For example, in "figma.com/file/abc123XYZ/MyDesign", the fileKey would be "abc123XYZ". This key is required to access and convert your Figma design.',
    ),
  nodeId: z
    .string()
    .describe(
      'The specific element or frame ID within your Figma file that you want to convert. Found in the URL as "node-id=xyz123" when you select an element in Figma. For example, in "figma.com/design/file_id/file_name?node-id=ab-1234", the nodeId would be "ab-1234".',
    ),
};

const registerFigmaToCodeTool = (server: McpServer): ReturnType<McpServer['tool']> => {
  return server.tool(toolName, toolDescription, toolSchema, async ({ fileKey, nodeId }) => {
    try {
      const isDev = process.env.NODE_ENV === 'development';
      const url = isDev ? CONFIG.FIGMA_TO_CODE_URL.DEV : CONFIG.FIGMA_TO_CODE_URL.PROD;
      const fullUrl = `${url}/image-to-code`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify({ fileKey, nodeId, userId: 'blade-mcp' }),
      });

      const data = await response.text();

      // TODO: Inject images: https://docs.cursor.com/context/model-context-protocol#image-injection
      return {
        content: [
          {
            type: 'text',
            text: data,
          },
        ],
      };
    } catch (error: unknown) {
      console.error('Error fetching Figma to Code:', error);
      return {
        isError: true,
        content: [{ type: 'text', text: 'error' }],
      };
    }
  });
};

export { registerFigmaToCodeTool };
