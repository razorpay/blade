import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { URLS } from '../utils.js';

const getFigmaToCodeToolName = 'get_figma_to_code';

const getFigmaToCodeDescription = `Converts Figma designs into Blade Design System code. Provide a Figma design URL to generate the corresponding React components using Blade's component library.`;

const getFigmaToCodeSchema = {
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

const getFigmaToCodeCallback: ToolCallback<typeof getFigmaToCodeSchema> = async ({
  fileKey,
  nodeId,
}) => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const url = isDev ? URLS.FIGMA_TO_CODE_URL.DEV : URLS.FIGMA_TO_CODE_URL.PROD;
    const fullUrl = `${url}/figma-to-code`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: new Headers({
        'x-blade-mcp': 'true',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ fileKey, nodeId }),
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
};

export {
  getFigmaToCodeCallback,
  getFigmaToCodeSchema,
  getFigmaToCodeDescription,
  getFigmaToCodeToolName,
};
