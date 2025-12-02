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

const createBladeCursorRulesToolName = 'create_blade_cursor_rules';

const createBladeCursorRulesToolDescription =
  'Creates the cursor rules for blade to help with code generation. Call this before get_blade_docs and while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).';

// Schema for stdio transport
const createBladeCursorRulesStdioSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

// Schema for HTTP transport
const createBladeCursorRulesHttpSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  clientName: z
    .enum(['claude', 'cursor', 'unknown'])
    .default('unknown')
    .describe(
      'The name of the client that is calling the tool. It can be "claude", "cursor", or "unknown". Use "unknown" if you are not sure.',
    ),
  cursorRuleVersion: z
    .string()
    .describe('The version of cursor rules. Not used for this tool but required for consistency.'),
};

// Core business logic function
const createBladeCursorRulesCore = ({
  currentProjectRootDirectory,
  isHttpTransport = false,
  clientName = 'unknown',
  cursorRuleVersion = '0',
}: {
  currentProjectRootDirectory: string;
  isHttpTransport?: boolean;
  clientName?: 'claude' | 'cursor' | 'unknown';
  cursorRuleVersion?: string;
}): {
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  try {
    // This tool writes files to the filesystem, which is only valid when called from stdio (Cursor)
    // Throw an error if called from HTTP transport
    if (isHttpTransport) {
      return handleError({
        toolName: createBladeCursorRulesToolName,
        mcpErrorMessage:
          'This tool cannot be called from HTTP transport. It requires direct filesystem access and should only be called from Cursor IDE via stdio transport.',
      });
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
        clientName,
        cursorRuleVersion,
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
  typeof createBladeCursorRulesStdioSchema
> = ({ currentProjectRootDirectory }) => {
  return createBladeCursorRulesCore({
    currentProjectRootDirectory,
    isHttpTransport: false,
    clientName: 'unknown',
    cursorRuleVersion: '0',
  });
};

// Callback for HTTP transport
const createBladeCursorRulesHttpCallback: ToolCallback<typeof createBladeCursorRulesHttpSchema> = ({
  currentProjectRootDirectory,
  clientName,
  cursorRuleVersion,
}) => {
  return createBladeCursorRulesCore({
    currentProjectRootDirectory,
    isHttpTransport: true,
    clientName,
    cursorRuleVersion,
  });
};

const createBladeCursorRulesToolSchema = (
  transportType: 'stdio' | 'http',
): typeof createBladeCursorRulesStdioSchema | typeof createBladeCursorRulesHttpSchema => {
  if (transportType === 'stdio') {
    return createBladeCursorRulesStdioSchema;
  }
  return createBladeCursorRulesHttpSchema;
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
