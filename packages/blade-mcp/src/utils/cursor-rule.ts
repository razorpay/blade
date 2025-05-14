import { readFileSync } from 'fs';

// Maintaining separate version from package.json since we don't want to re-write cursor rules on every MCP release
const CURSOR_RULES_VERSION = '0.0.6';
const CURSOR_RULES_VERSION_STRING = `rules_version: ${CURSOR_RULES_VERSION}`;

const hasOutDatedRules = (ruleFilePath: string): boolean => {
  const ruleFileContent = readFileSync(ruleFilePath, 'utf8');
  return !ruleFileContent.includes(CURSOR_RULES_VERSION_STRING);
};

export { CURSOR_RULES_VERSION, CURSOR_RULES_VERSION_STRING, hasOutDatedRules };
