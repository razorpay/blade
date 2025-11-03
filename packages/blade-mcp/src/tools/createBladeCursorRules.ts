import { join, basename } from 'path';
import { readFileSync } from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  BLADE_CURSOR_RULES_FILE_PATH,
  CURSOR_RULES_VERSION,
  analyticsToolCallEventName,
  CURSOR_RULES_FILE_NAME,
} from '../utils/tokens.js';

import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';

const createBladeCursorRulesToolName = 'create_blade_cursor_rules';

const createBladeCursorRulesToolDescription =
  'Creates the cursor rules for blade to help with code generation. Returns the cursor rules file content that should be created. Call this before get_blade_docs and while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).';

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
    const ruleFileDir = join(currentProjectRootDirectory, '.cursor/rules');
    const ruleFilePath = join(ruleFileDir, CURSOR_RULES_FILE_NAME);

    // Read the cursor rules template from the package's cursorRules directory
    const ruleFileTemplateContent = readFileSync(BLADE_CURSOR_RULES_FILE_PATH, 'utf8').replace(
      'rules_version: <!-- dynamic_version -->',
      `rules_version: ${CURSOR_RULES_VERSION}`,
    );

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createBladeCursorRulesToolName,
        cursorRulesVersion: CURSOR_RULES_VERSION,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `## Blade Cursor Rules File Content

**File Path:** \`${ruleFilePath}\`

**Instructions:**
1. Create the directory if it doesn't exist: \`.cursor/rules/\`
2. Create a new file named \`${CURSOR_RULES_FILE_NAME}\` in that directory.
3. Copy the content below into the file

**Cursor Rules Version:** ${CURSOR_RULES_VERSION}

---

${ruleFileTemplateContent}`,
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
