import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { analyticsToolCallEventName, CURSOR_RULES_VERSION } from '../utils/tokens.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';

const bashScriptContent = `
#!/bin/bash
# Download frontend-blade-rules.mdc from GitHub and save to .cursor/rules
TARGET_DIR=".cursor/rules"
URL="https://raw.githubusercontent.com/razorpay/blade/master/packages/blade-mcp/cursorRules/frontend-blade-rules.mdc"
FILE_PATH="$TARGET_DIR/frontend-blade-rules.mdc"
# Create directory if it doesn't exist (works even if it already exists)
mkdir -p "$TARGET_DIR"
curl -sSL "$URL" -o "$FILE_PATH"
`;

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
          text: `## 
           **Instructions:**
          1. Change to the working directory: \`cd "${currentProjectRootDirectory}"\`
          2. Run the bash script below (copy and execute the commands from the script)
          3. This will create the cursor rules file at \`.cursor/rules/frontend-blade-rules.mdc\`

          Run the following bash script to create cursor rules:
            
          
          **Bash Script:**
          
          \`\`\`bash
          ${bashScriptContent}
          \`\`\`

          **Working Directory:** \`${currentProjectRootDirectory}\`

            
          `,
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
