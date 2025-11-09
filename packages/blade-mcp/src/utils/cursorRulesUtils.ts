/**
 * Checks if cursor rules don't exist (version is '0' and client is 'cursor')
 * @param cursorRuleVersion - The version of the cursor rules
 * @param clientName - The name of the client ('claude', 'cursor', or 'unknown')
 * @returns true if cursor rules don't exist, false otherwise
 */
export function doCursorRulesNotExist(
  cursorRuleVersion: string,
  clientName: 'claude' | 'cursor' | 'unknown',
): boolean {
  return cursorRuleVersion === '0' && clientName === 'cursor';
}
