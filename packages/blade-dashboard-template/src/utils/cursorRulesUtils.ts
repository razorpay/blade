import { existsSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line import/no-cycle
import { createBladeCursorRulesToolName } from '../tools/createBladeCursorRules.js';
import { CURSOR_RULES_VERSION, CONSUMER_CURSOR_RULES_RELATIVE_PATH } from './tokens.js';
import { hasOutDatedRules } from './generalUtils.js';
import { handleError } from './analyticsUtils.js';
import type { McpToolResponse } from './types.js';

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

const cursorRuleCreationInstructions = ({
  currentProjectRootDirectory,
}: {
  currentProjectRootDirectory: string;
}): string => `
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
`;

/**
 * Checks if cursor rules don't exist (version is '0' and client is 'cursor')
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @returns true if cursor rules don't exist, false otherwise
 */
function isCursorRuleFileMissing(
  cursorRuleVersion: string,
  clientName: 'claude' | 'cursor' | 'unknown',
): boolean {
  return cursorRuleVersion === '0' && clientName === 'cursor';
}

/**
 * Checks if cursor rules are outdated (version doesn't match the latest version and client is 'cursor')
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @returns true if cursor rules are outdated, false otherwise
 */
function areCursorRulesOutdated(
  cursorRuleVersion: string,
  clientName: 'claude' | 'cursor' | 'unknown',
): boolean {
  return cursorRuleVersion !== CURSOR_RULES_VERSION && clientName === 'cursor';
}

/**
 * Checks if cursor rules should be created or updated. Returns instructions if they need to be created or updated.
 * This function checks both the file system and version numbers to determine if cursor rules need attention.
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @param currentProjectRootDirectory - The working root directory of the consumer's project
 * @param skipLocalCursorRuleChecks - If true, skip file system checks and only check versions (for HTTP transport)
 * @param toolName - The name of the tool calling this function (for error messages)
 * @returns Error format for stdio transport or content format for HTTP transport if cursor rules need attention, undefined otherwise
 */
function shouldCreateOrUpdateCursorRule(
  cursorRuleVersion = '0',
  clientName: 'claude' | 'cursor' | 'unknown',
  currentProjectRootDirectory: string,
  skipLocalCursorRuleChecks = false,
  toolName?: string,
): McpToolResponse | undefined {
  let isMissing = false;

  // Check file system first if directory is provided and skipLocalCursorRuleChecks is false
  if (currentProjectRootDirectory && !skipLocalCursorRuleChecks) {
    const ruleFilePath = join(currentProjectRootDirectory, CONSUMER_CURSOR_RULES_RELATIVE_PATH);

    // Check if file exists
    if (!existsSync(ruleFilePath)) {
      isMissing = true;
    } else if (hasOutDatedRules(ruleFilePath)) {
      // File exists but is outdated
      isMissing = false;
    } else {
      // File exists and is up to date
      return undefined;
    }
  }

  // Fallback to version-based checks if file system checks were skipped
  if (!currentProjectRootDirectory || skipLocalCursorRuleChecks) {
    if (isCursorRuleFileMissing(cursorRuleVersion, clientName)) {
      isMissing = true;
    } else if (areCursorRulesOutdated(cursorRuleVersion, clientName)) {
      isMissing = false;
    } else {
      // Rules are up to date
      return undefined;
    }
  }

  // For stdio transport (skipLocalCursorRuleChecks = false), return error format
  if (!skipLocalCursorRuleChecks && toolName) {
    return handleError({
      toolName,
      mcpErrorMessage: isMissing
        ? `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`
        : `Cursor rules are outdated. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
    });
  }

  // For HTTP transport (skipLocalCursorRuleChecks = true), return content format
  return {
    content: [
      {
        type: 'text',
        text: isMissing
          ? `Cursor rules do not exist. Create them using the following instructions: \n\n
          ${cursorRuleCreationInstructions({
            currentProjectRootDirectory,
          })}`
          : `Cursor rules are outdated. Expected version: ${CURSOR_RULES_VERSION}. Current version: ${cursorRuleVersion}. Update them using the following instructions: \n\n
          ${cursorRuleCreationInstructions({
            currentProjectRootDirectory,
          })}`,
      },
    ],
  };
}

export {
  bashScriptContent,
  cursorRuleCreationInstructions,
  shouldCreateOrUpdateCursorRule,
  areCursorRulesOutdated,
  isCursorRuleFileMissing,
};
