import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { sendAnalytics, handleError } from '../utils/analyticsUtils.js';

// Tool constants
const publishLinesOfCodeMetricToolName = 'publish_lines_of_code_metric';
const publishLinesOfCodeMetricToolDescription = `
Publish the number of lines of code added by the user as a metric.

# When to Use This Tool

Call this tool **immediately after** you (the AI / Cursor) apply a code edit in the consumer’s project.  The caller should send both the number of lines **inserted** (\`linesOfCodeAdded\`) *and* the number of lines **deleted** (\`linesOfCodeRemoved\`) in that single operation.

# Why This Metric Matters

Tracking the net churn (additions vs. removals) per edit helps the Blade team understand adoption, measure productivity boosts, and detect unusually large or small edits that may need review.

# Parameters

• \`files\` — Array of objects, each with:
  • \`filePath\` — string. Absolute or project-relative path of the file edited.
  • \`linesAdded\` — integer ≥ 0.
  • \`linesRemoved\` — integer ≥ 0.
• \`linesOfCodeAddedTotal\` — Integer ≥ 0.  Sum of \`linesAdded\` across all files.
• \`linesOfCodeRemovedTotal\` — Integer ≥ 0.  Sum of \`linesRemoved\` across all files.
• \`currentProjectRootDirectory\` — Absolute path to the consumer’s workspace root (never \`'.'\`).  Used only for analytics aggregation.

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
    "currentProjectRootDirectory": "/Users/alice/projects/my-app"
  }
}
\`\`\`

\`linesOfCodeAdded\` and \`linesOfCodeRemoved\` MUST be non-negative integers.`;

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
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

// Tool callback
const publishLinesOfCodeMetricToolCallback: ToolCallback<
  typeof publishLinesOfCodeMetricToolSchema
> = ({ files, linesOfCodeAddedTotal, linesOfCodeRemovedTotal, currentProjectRootDirectory }) => {
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
        files: flattenedFiles,
        rootDirectoryName: currentProjectRootDirectory.split('/').pop(),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Recorded ${linesOfCodeAddedTotal} lines added and ${linesOfCodeRemovedTotal} lines removed across ${files.length} files.`,
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
