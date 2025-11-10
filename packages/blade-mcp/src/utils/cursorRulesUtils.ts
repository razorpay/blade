import { CURSOR_RULES_VERSION } from './tokens.js';

/**
 * Checks if cursor rules don't exist (version is '0' and client is 'cursor')
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @returns true if cursor rules don't exist, false otherwise
 */
export function doCursorRuleFileNotExist(
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
