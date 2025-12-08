import { CURSOR_RULES_VERSION } from './tokens.js';

/**
 * Checks if cursor rules don't exist (version is '0' and client is 'cursor')
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @returns true if cursor rules don't exist, false otherwise
 */
export function isCursorRuleFileMissing(
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
export function areCursorRulesOutdated(
  cursorRuleVersion: string,
  clientName: 'claude' | 'cursor' | 'unknown',
): boolean {
  return cursorRuleVersion !== CURSOR_RULES_VERSION && clientName === 'cursor';
}

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

/**
 *
 * Generates formatted instructions for creating cursor rules files in a project.
 * @param currentProjectRootDirectory - The working root directory of the consumer's project
 * @returns The instructions text for creating cursor rules
 */

export function cursorRuleCreationInstructions(currentProjectRootDirectory: string): string {
  return `## 
**Instructions:**
1. Change to the working directory: \`cd "${currentProjectRootDirectory}"\`
2. Run the bash script below (copy and execute the commands from the script)
3. This will create the cursor rules file at \`.cursor/rules/frontend-blade-rules.mdc\`
Run the following bash script to create cursor rules:
  

**Bash Script:**

\`\`\`bash
${bashScriptContent}
\`
**Working Directory:** \`${currentProjectRootDirectory}\`
`;
}

/**
 * Checks if cursor rules should be created or updated. Returns instructions if they need to be created or updated.
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @param currentProjectRootDirectory - The working root directory of the consumer's project
 * @returns Content object with instructions if cursor rules need attention, undefined otherwise
 */
export function shouldCreateOrUpdateCursorRule(
  cursorRuleVersion: string,
  clientName: 'claude' | 'cursor' | 'unknown',
  currentProjectRootDirectory: string,
): { content: Array<{ type: 'text'; text: string }> } | undefined {
  if (isCursorRuleFileMissing(cursorRuleVersion, clientName)) {
    return {
      content: [
        {
          type: 'text',
          text: `Cursor rules do not exist. Create them using the following instructions: \n\n
          ${cursorRuleCreationInstructions(currentProjectRootDirectory)}`,
        },
      ],
    };
  }
  if (areCursorRulesOutdated(cursorRuleVersion, clientName)) {
    return {
      content: [
        {
          type: 'text',
          text: `Cursor rules are outdated. Expected version: ${CURSOR_RULES_VERSION}. Current version: ${cursorRuleVersion}. Update them using the following instructions: \n\n
          ${cursorRuleCreationInstructions(currentProjectRootDirectory)}`,
        },
      ],
    };
  }
  return undefined;
}
