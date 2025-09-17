import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { sendAnalytics, handleError } from '../utils/analyticsUtils.js';
import { hiBladeToolName } from './hiBlade.js';
import { createNewBladeProjectToolName } from './createNewBladeProject.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';
import { getBladePatternDocsToolName } from './getBladePatternDocs.js';
import { getBladeGeneralDocsToolName } from './getBladeGeneralDocs.js';
import { getFigmaToCodeToolName } from './getFigmaToCode.js';
import { getChangelogToolName } from './getChangelog.js';

// List of Blade MCP tool names excluding this metric tool
const bladeMcpToolNames = [
  hiBladeToolName,
  createNewBladeProjectToolName,
  createBladeCursorRulesToolName,
  getBladeComponentDocsToolName,
  getBladePatternDocsToolName,
  getBladeGeneralDocsToolName,
  getFigmaToCodeToolName,
  getChangelogToolName,
] as const;

type BladeMcpToolName = typeof bladeMcpToolNames[number];
// Cast to mutable tuple type expected by z.enum
const bladeMcpToolEnum = z.enum(
  (bladeMcpToolNames as unknown) as [BladeMcpToolName, ...BladeMcpToolName[]],
);

// Tool constants
const publishLinesOfCodeMetricToolName = 'publish_lines_of_code_metric';
const publishLinesOfCodeMetricToolDescription = `
Publish the number of lines of code added by the user as a metric.

# When to Use This Tool

Call this tool **immediately after** you (the AI / Cursor) apply a code edit in the consumer’s project.  The caller should send both the number of lines **inserted** (\`linesOfCodeAdded\`) *and* the number of lines **deleted** (\`linesOfCodeRemoved\`) in that single operation.

# Why This Metric Matters

Tracking the net churn (additions vs. removals) per edit helps the Blade team understand adoption, measure productivity boosts, and detect unusually large or small edits that may need review.


# Example Invocation

\`\`\`json
{
  "name": "publish_lines_of_code_metric",
  "arguments": {
    "files": [
      { "filePath": "src/components/Button.tsx", "linesAdded": 10, "linesRemoved": 0 },
      { "filePath": "src/components/Header.tsx", "linesAdded": 5, "linesRemoved": 0 }
    ],
    "linesOfCodeAddedTotal": 15,
    "linesOfCodeRemovedTotal": 0,
    // Optional categorized metrics
    "bladeUiLinesOfCodeAddedTotal": 12,
    "bladeUiLinesOfCodeRemovedTotal": 0,
    "nonBladeUiLinesOfCodeAddedTotal": 3,
    "nonBladeUiLinesOfCodeRemovedTotal": 1,
    "nonUiLinesOfCodeAddedTotal": 0,
    "nonUiLinesOfCodeRemovedTotal": 2,

    "currentProjectRootDirectory": "/Users/alice/projects/my-app",
    "toolsUsed": [
      "hi_blade",
      "create_new_blade_project",
      "create_blade_cursor_rules",
      "get_blade_component_docs",
      "get_blade_pattern_docs",
      "get_blade_general_docs",
      "get_figma_to_code",
      "get_changelog"
    ]
  }
}
\`\`\`

\`linesOfCodeAdded\` and \`linesOfCodeRemoved\` MUST be non-negative integers.

`;

// Tool schema
const publishLinesOfCodeMetricToolSchema = {
  files: z
    .array(
      z.object({
        filePath: z.string().describe('Path of the file that was edited.'),
        linesAdded: z.number().int().nonnegative().describe('Lines added in this file.'),
        linesRemoved: z.number().int().nonnegative().describe('Lines removed in this file.'),
      }),
    )
    .nonempty()
    .describe('Breakdown of line changes per file in this operation.'),
  linesOfCodeAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .describe('Total lines added across all files.'),
  linesOfCodeRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .describe('Total lines removed across all files.'),
  toolsUsed: z
    .array(bladeMcpToolEnum)
    .optional()
    .describe('List of Blade MCP tool names that were invoked during the conversation'),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  // New aggregated metrics for code categorization
  bladeUiLinesOfCodeAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Blade components (e.g., <Button />, <TextInput />) that were added across all files.',
    ),
  bladeUiLinesOfCodeRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI code that import or reference Blade components that were removed across all files.',
    ),
  nonBladeUiLinesOfCodeAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code (React/JSX/TSX) added that do NOT import or use Blade components — e.g., custom components or components from other libraries such as Material UI.',
    ),
  nonBladeUiLinesOfCodeRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of UI component code that does NOT use Blade components that were removed across all files.',
    ),
  nonUiLinesOfCodeAddedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of non-UI code such as business logic, state management, data fetching, utility functions, etc. that were added.',
    ),
  nonUiLinesOfCodeRemovedTotal: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Total lines of non-UI code such as business logic, state management, data fetching, utility functions, etc. that were removed.',
    ),
};

// Tool callback
const publishLinesOfCodeMetricToolCallback: ToolCallback<
  typeof publishLinesOfCodeMetricToolSchema
> = ({
  files,
  linesOfCodeAddedTotal,
  linesOfCodeRemovedTotal,
  toolsUsed,
  currentProjectRootDirectory,
  bladeUiLinesOfCodeAddedTotal = 0,
  bladeUiLinesOfCodeRemovedTotal = 0,
  nonBladeUiLinesOfCodeAddedTotal = 0,
  nonBladeUiLinesOfCodeRemovedTotal = 0,
  nonUiLinesOfCodeAddedTotal = 0,
  nonUiLinesOfCodeRemovedTotal = 0,
}) => {
  try {
    // Send analytics event
    const flattenedFiles = files
      .map(({ filePath, linesAdded, linesRemoved }) => `${filePath}:${linesAdded}:${linesRemoved}`)
      .join(',');

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: publishLinesOfCodeMetricToolName,
        linesOfCodeAddedTotal,
        linesOfCodeRemovedTotal,
        bladeUiLinesOfCodeAddedTotal,
        bladeUiLinesOfCodeRemovedTotal,
        nonBladeUiLinesOfCodeAddedTotal,
        nonBladeUiLinesOfCodeRemovedTotal,
        nonUiLinesOfCodeAddedTotal,
        nonUiLinesOfCodeRemovedTotal,
        files: flattenedFiles,
        toolsUsed: (toolsUsed ?? []).join(','),
        rootDirectoryName: currentProjectRootDirectory.split('/').pop(),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text:
            `Recorded ${linesOfCodeAddedTotal} lines added and ${linesOfCodeRemovedTotal} lines removed across ` +
            `${files.length} files. Tools used: ${(toolsUsed ?? []).join(', ')}.`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: publishLinesOfCodeMetricToolName,
      errorObject: error,
    });
  }
};

export {
  publishLinesOfCodeMetricToolName,
  publishLinesOfCodeMetricToolDescription,
  publishLinesOfCodeMetricToolSchema,
  publishLinesOfCodeMetricToolCallback,
};
