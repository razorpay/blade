import { join, basename } from 'path';
import { existsSync, unlinkSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  BLADE_CURSOR_RULES_FILE_PATH,
  CURSOR_RULES_VERSION,
  analyticsToolCallEventName,
} from '../utils/tokens.js';

import { hasOutDatedRules } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { cursorRuleCreationInstructions } from '../utils/cursorRule.js';

const createBladeCursorRulesToolName = 'create_blade_cursor_rules';

const createBladeCursorRulesToolDescription =
  'Creates the cursor rules for blade to help with code generation. Returns the bash script that should be executed. while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).';
// Schema for stdio transport
const createBladeCursorRulesToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

// Core business logic function
const createBladeCursorRulesCore = ({
  currentProjectRootDirectory,
  isHttpTransport = false,
}: {
  currentProjectRootDirectory: string;
  isHttpTransport?: boolean;
}): {
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  try {
    // For HTTP transport, return instructions instead of creating the file directly
    if (isHttpTransport) {
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
            text: cursorRuleCreationInstructions({
              currentProjectRootDirectory,
              cursorRulesVersion: CURSOR_RULES_VERSION,
            }),
          },
        ],
      };
    }

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
          text: `Blade cursor rules created at: ${ruleFilePath}. Cursor Rules Version: ${CURSOR_RULES_VERSION}`,
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

// Callback for stdio transport
const createBladeCursorRulesStdioCallback: ToolCallback<
  typeof createBladeCursorRulesToolSchema
> = ({ currentProjectRootDirectory }) => {
  return createBladeCursorRulesCore({
    currentProjectRootDirectory,
    isHttpTransport: false,
  });
};

// Callback for HTTP transport
const createBladeCursorRulesHttpCallback: ToolCallback<typeof createBladeCursorRulesToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  return createBladeCursorRulesCore({
    currentProjectRootDirectory,
    isHttpTransport: true,
  });
};

const createBladeCursorRulesToolCallback = (
  transportType: 'stdio' | 'http',
): typeof createBladeCursorRulesStdioCallback | typeof createBladeCursorRulesHttpCallback => {
  if (transportType === 'stdio') {
    return createBladeCursorRulesStdioCallback;
  }
  return createBladeCursorRulesHttpCallback;
};

export {
  createBladeCursorRulesToolName,
  createBladeCursorRulesToolDescription,
  createBladeCursorRulesToolSchema,
  createBladeCursorRulesToolCallback,
};
