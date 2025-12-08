import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { analyticsToolCallEventName, CURSOR_RULES_VERSION } from '../utils/tokens.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { cursorRuleCreationInstructions } from '../utils/cursorRulesUtils.js';

const createBladeCursorRulesToolName = 'create_blade_cursor_rules';

const createBladeCursorRulesToolDescription =
  'Creates the cursor rules for blade to help with code generation. Returns the bash script that should be executed. while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).';

const createBladeCursorRulesToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createBladeCursorRulesToolCallback: ToolCallback<typeof createBladeCursorRulesToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  try {
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createBladeCursorRulesToolName,
        cursorRulesVersion: CURSOR_RULES_VERSION,
        currentProjectRootDirectory,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `${cursorRuleCreationInstructions(currentProjectRootDirectory)}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createBladeCursorRulesToolName,
      errorObject: error,
    });
  }
};

export {
  createBladeCursorRulesToolName,
  createBladeCursorRulesToolDescription,
  createBladeCursorRulesToolSchema,
  createBladeCursorRulesToolCallback,
};
