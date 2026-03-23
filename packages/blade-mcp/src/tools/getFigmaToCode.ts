import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import dedent from 'dedent';
import { z } from 'zod';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';

const URLS = {
  FIGMA_TO_CODE_URL: {
    DEV: 'http://localhost:8888',
    PROD: 'http://localhost:8888',
  },
} as const;

const getFigmaToCodeToolName = 'get_figma_to_code';

const getFigmaToCodeToolDescription = `Converts Figma designs into Blade Design System code. Provide a Figma design URL to generate the corresponding React components using Blade's component library.

IMPORTANT: This tool MUST be called inside a subagent, not directly. The tool returns chunked data that requires parallel processing by multiple subagents. Always spawn a subagent first (using Claude Opus or Sonnet model - DO NOT use fast/smaller models), then call this tool from within that subagent to handle the Figma-to-code conversion workflow.`;

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
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  isInsideSubagent: z
    .boolean()
    .describe(
      'REQUIRED: Must be set to true. This tool MUST be called from inside a subagent. If you are not inside a subagent, first spawn a subagent (using Claude Opus or Sonnet model - DO NOT use fast/smaller models) and then call this tool from within it.',
    ),
};

type FigmaNode = {
  componentName: string;
  chunkId?: string;
  layout?: string;
  borderRadius?: string;
  backgroundColor?: string[];
  componentProperties?: Record<string, unknown>;
  children?: FigmaNode[];
  layerName?: string;
  iconName?: string;
  componentKey?: string;
  componentSetId?: string;
  componentType?: string;
  isRoot?: boolean;
};

type ChunkInfo = {
  chunkName: string;
  chunkId: string;
};

type ChunkData = {
  chunkId: string;
  chunkName: string;
  figmaContext: FigmaNode[];
  componentsUsed: string[];
};

type FigmaToCodeResponse = {
  figmaJson: FigmaNode[];
  componentsUsed: string[];
  slots: ChunkInfo[];
  chunks: ChunkData[];
  base64Image: string;
};

const sanitizeComponentName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[0-9]/, '_$&')
    .replace(/^\w/, (c) => c.toUpperCase());
};

type ContentBlock = { type: 'text'; text: string };

const generateSimplePrompt = (data: FigmaToCodeResponse): ContentBlock[] => {
  const instructions = dedent`
    ## Figma to Code Conversion
    
    Convert the following Figma design structure to React code using Blade Design System components.
    
    ### Components Available:
    ${(data.componentsUsed || []).join(', ')}
    
    ### Instructions:
    1. Generate a single React component that implements this design
    2. Use Blade components from '@razorpay/blade/components'
    3. Use Blade tokens for spacing, colors, etc.
    4. Follow the layout properties exactly as specified
    5. If you encounter lint errors or need clarification, use \`${getBladeComponentDocsToolName}\`
  `;

  const figmaJsonBlock = dedent`
    ## Figma JSON Structure
    
    \`\`\`json
    ${JSON.stringify(data.figmaJson, null, 2)}
    \`\`\`
  `;

  return [
    { type: 'text', text: instructions },
    { type: 'text', text: figmaJsonBlock },
  ];
};

const generateChunkedPrompt = (
  data: FigmaToCodeResponse,
  currentProjectRootDirectory: string,
): ContentBlock[] => {
  const slots = data.slots || [];
  const chunks = data.chunks || [];
  const componentsUsed = data.componentsUsed || [];

  const orchestrationInstructions = dedent`
    ## Figma to Code Conversion - Parallel Chunk Architecture
    
    This design has been decomposed into ${chunks.length} independent chunks that can be 
    processed in parallel by subagents, then stitched together.
    
    ### Project Root: ${currentProjectRootDirectory}
    
    ---
    
    ## ORCHESTRATION STRATEGY
    
    ### Step 1: Process Chunks in Parallel
    Launch a subagent for EACH chunk below. 
    IMPORTANT: Use Claude Opus or Sonnet model for subagents - DO NOT use fast/smaller models.
    
    Each subagent should:
    - Generate a standalone React component for that chunk
    - Name the component based on the chunkName (PascalCase)
    - Export it as a named export
    - Save it to a file like \`<ComponentName>.tsx\`
    
    ### Step 2: Assemble the Main Component  
    After all chunks are complete, create the main component that:
    - Imports all chunk components
    - Uses the main tree structure to compose them together
    - Replaces \`chunkId\` references with the actual chunk components
    
    ---
    
    ## ASSEMBLY INSTRUCTIONS
    
    After all chunks are generated, create the main component file that:
    
    1. **Imports**: Import all chunk components:
    ${slots
      .map(
        (s) =>
          `   - import { ${sanitizeComponentName(s.chunkName)} } from './${sanitizeComponentName(
            s.chunkName,
          )}'`,
      )
      .join('\n')}
    
    2. **Structure**: Follow the main \`figmaJson\` tree structure exactly
    
    3. **Slot Replacement**: Where you see a node with \`chunkId\`, render the corresponding component:
    ${slots
      .map((s) => `   - chunkId "${s.chunkId}" → <${sanitizeComponentName(s.chunkName)} />`)
      .join('\n')}
    
    4. **Layout**: Apply Box layout properties from the \`layout\` field
    
    ---
    
    ## NOTES
    - Use \`${getBladeComponentDocsToolName}\` if you need component documentation
    - Use the attached screenshot to verify visual accuracy
    - Blade imports: \`import { Box, Text, ... } from '@razorpay/blade/components'\`
  `;

  const slotsList = slots.map((s) => `- ${s.chunkName} (chunkId: ${s.chunkId})`).join('\n');

  const mainTreeBlock = dedent`
    ## Main Component Tree Structure
    
    This is the root layout structure. Slots marked with \`chunkId\` are placeholders 
    where the corresponding chunk components should be inserted.
    
    ### Slot Components to Import:
    ${slotsList}
    
    ### All Components Used:
    ${componentsUsed.join(', ')}
    
    ### Figma JSON Structure:
    \`\`\`json
    ${JSON.stringify(data.figmaJson, null, 2)}
    \`\`\`
  `;

  const chunkBlocks: ContentBlock[] = chunks.map((chunk, index) => {
    const chunkPrompt = dedent`
      ## Chunk ${index + 1}/${chunks.length}: "${chunk.chunkName}" (ID: ${chunk.chunkId})
      
      ### Components Available:
      ${(chunk.componentsUsed || []).join(', ')}
      
      ### Instructions for this chunk:
      - Generate a React component named \`${sanitizeComponentName(chunk.chunkName)}\`
      - Export the component as a named export
      - Use only the Blade components listed above
      - Follow the layout properties exactly as specified in figmaContext
      - Return ONLY the component code, no explanations
      
      ### Figma Context:
      \`\`\`json
      ${JSON.stringify(chunk.figmaContext, null, 2)}
      \`\`\`
    `;
    return { type: 'text' as const, text: chunkPrompt };
  });

  return [
    { type: 'text', text: orchestrationInstructions },
    { type: 'text', text: mainTreeBlock },
    ...chunkBlocks,
  ];
};

const getFigmaToCodeToolCallback: ToolCallback<typeof getFigmaToCodeToolSchema> = async ({
  fileKey,
  nodeId,
  currentProjectRootDirectory,
  isInsideSubagent,
}) => {
  if (!isInsideSubagent) {
    return {
      content: [
        {
          type: 'text',
          text: dedent`
            ## Error: This tool must be called from inside a subagent
            
            The \`get_figma_to_code\` tool returns chunked Figma data that requires parallel processing 
            by multiple subagents. You cannot call this tool directly from the main agent.
            
            ### How to fix:
            1. First, spawn a subagent using a capable model (Claude Opus or Sonnet - DO NOT use fast/smaller models)
            2. From within that subagent, call this tool with \`isInsideSubagent: true\`
            3. The subagent will then spawn additional subagents to process each chunk in parallel
            
            IMPORTANT: Use Claude Opus or Sonnet model for the subagent. Fast/smaller models lack the 
            capability to properly handle the complex Figma-to-code conversion and chunk orchestration.
            
            Please retry by first creating a subagent with an appropriate model, then calling this tool from within it.
          `,
        },
      ],
    };
  }

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

    const data: FigmaToCodeResponse = await response.json();

    if (!data.figmaJson) {
      return handleError({
        toolName: getFigmaToCodeToolName,
        mcpErrorMessage: `Failed to fetch figma data from backend.`,
      });
    }

    const componentsUsedString = (data.componentsUsed || []).join(', ');
    const hasChunks = data.chunks && data.chunks.length > 0;

    const textBlocks = hasChunks
      ? generateChunkedPrompt(data, currentProjectRootDirectory)
      : generateSimplePrompt(data);

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getFigmaToCodeToolName,
        chunksCount: data.chunks?.length ?? 0,
        componentsUsed: componentsUsedString,
        currentProjectRootDirectory,
      },
    });

    const content: Array<
      { type: 'text'; text: string } | { type: 'image'; mimeType: string; data: string }
    > = [...textBlocks];

    if (data.base64Image) {
      content.push({
        type: 'image',
        mimeType: 'image/jpeg',
        data: data.base64Image,
      });
    }

    return { content };
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
