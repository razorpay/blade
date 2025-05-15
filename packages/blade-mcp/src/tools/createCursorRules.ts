import { join } from 'path';
import { existsSync, unlinkSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { BLADE_CURSOR_RULES_FILE_PATH, hasOutDatedRules, CURSOR_RULES_VERSION } from '../utils.js';

const createCursorRulesSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe("The working root directory of the consumer's project"),
};

const createBladeCursorRulesCallback: ToolCallback<typeof createCursorRulesSchema> = ({
  currentProjectRootDirectory,
}) => {
  const ruleFileDir = join(currentProjectRootDirectory, '.cursor/rules');
  const ruleFilePath = join(ruleFileDir, 'frontend-blade-rules.mdc');

  if (existsSync(ruleFilePath)) {
    if (hasOutDatedRules(ruleFilePath)) {
      // removes the outdated rules file and continues execution to generate new rule file
      unlinkSync(ruleFilePath);
    } else {
      return {
        content: [{ type: 'text', text: 'Cursor rules already exist. Doing nothing' }],
      };
    }
  }

  const ruleFileTemplateContent = readFileSync(BLADE_CURSOR_RULES_FILE_PATH, 'utf8').replace(
    'rules_version: <!-- dynamic_version -->',
    `rules_version: ${CURSOR_RULES_VERSION}`,
  );

  if (!existsSync(ruleFileDir)) {
    mkdirSync(ruleFileDir, { recursive: true });
  }

  writeFileSync(ruleFilePath, ruleFileTemplateContent);

  return {
    content: [
      {
        type: 'text',
        text: `Blade cursor rules created at: ${ruleFilePath}. Cursor Rules Version: ${CURSOR_RULES_VERSION}`,
      },
    ],
  };
};

export { createBladeCursorRulesCallback, createCursorRulesSchema };
