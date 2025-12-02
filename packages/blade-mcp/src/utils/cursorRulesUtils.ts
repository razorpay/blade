import { CURSOR_RULES_VERSION } from './tokens.js';
import { cursorRuleCreationInstructions } from './cursorRule.js';

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
          ${cursorRuleCreationInstructions({
            currentProjectRootDirectory,
            cursorRulesVersion: CURSOR_RULES_VERSION,
          })}`,
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
          ${cursorRuleCreationInstructions({
            currentProjectRootDirectory,
            cursorRulesVersion: CURSOR_RULES_VERSION,
          })}`,
        },
      ],
    };
  }
  return undefined;
}
