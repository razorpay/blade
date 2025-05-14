import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { workingDirectory } from '../../utils/get-working-dir.js';
import { CURSOR_RULES_VERSION, hasOutDatedRules } from '../../utils/cursor-rule.js';

const toolName = 'create_blade_cursor_rules';
const toolDescription =
  'Creates the cursor rules for blade to help with code generation. Call this before get_blade_docs and while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).';

const toolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe("The working root directory of the consumer's project"),
};

const registerCreateBladeCursorRulesTool = (server: McpServer): ReturnType<McpServer['tool']> => {
  return server.tool(toolName, toolDescription, toolSchema, ({ currentProjectRootDirectory }) => {
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

    const ruleFileTemplatePath = join(workingDirectory, 'cursorRules', 'frontend-blade-rules.mdc');
    const ruleFileTemplateContent = readFileSync(ruleFileTemplatePath, 'utf8').replace(
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
  });
};

export { registerCreateBladeCursorRulesTool };
