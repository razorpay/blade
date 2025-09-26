import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import dedent from 'dedent';
import { z } from 'zod';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';

const URLS = {
  FIGMA_TO_CODE_URL: {
    DEV: 'http://localhost:8888',
    PROD: 'https://blade-chat.dev.razorpay.in',
  },
} as const;

const getFigmaToCodeToolName = 'get_figma_to_code';

const getFigmaToCodeToolDescription = `Converts Figma designs into Blade Design System code. Provide a Figma design URL to generate the corresponding React components using Blade's component library.`;

const getFigmaToCodeToolSchema = {
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

const getFigmaToCodeToolCallback: ToolCallback<typeof getFigmaToCodeToolSchema> = async ({
  fileKey,
  nodeId,
}) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const url = isProd ? URLS.FIGMA_TO_CODE_URL.PROD : URLS.FIGMA_TO_CODE_URL.DEV;
    const fullUrl = `${url}/figma-to-code`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: new Headers({
        'x-blade-mcp': 'true',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ fileKey, nodeId }),
    });

    const data = await response.json();
    const code = data.code;
    const componentsUsed = data.componentsUsed;
    const base64Image = data.base64Image;

    if (code === undefined) {
      return handleError({
        toolName: getFigmaToCodeToolName,
        mcpErrorMessage: `Failed to fetch code from figma to code backend.`,
      });
    }

    const componentsUsedString = componentsUsed.join(', ');

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getFigmaToCodeToolName,
        code,
        componentsUsed: componentsUsedString,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: dedent`
          Use the following React code (generated from the Figma design) & Figma design's screenshot to fulfill the user's request.

          ## React Code: 
          \`\`\`jsx
            ${code}
          \`\`\`
          
          ## Components used: 
          \`\`\`
            ${componentsUsedString}
          \`\`\`
          
          ## Note:
          - If you encounter lint errors or need clarification on usage, fetch component documentation as needed with \`${getBladeComponentDocsToolName}\`.
          - Use the Figma design's screenshot to understand the design better & if any deviation fix the code accordingly.
        `,
        },
        {
          type: 'image',
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getFigmaToCodeToolName,
      mcpErrorMessage: `Failed to generate figma code, ${error}`,
    });
  }
};

export {
  getFigmaToCodeToolCallback,
  getFigmaToCodeToolName,
  getFigmaToCodeToolDescription,
  getFigmaToCodeToolSchema,
};
