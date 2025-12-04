import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  CHECK_CURSOR_RULES_DESCRIPTION,
} from '../utils/tokens.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { shouldCreateOrUpdateCursorRule } from '../utils/cursorRulesUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

const bladePatternsList = getBladeDocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getBladePatternDocsToolName = 'get_blade_pattern_docs';

const getBladePatternDocsToolDescription = `Fetch the Blade Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

// Schema for stdio transport
const getBladePatternDocsStdioSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of blade pattern names. E.g. "ListView, DetailedView". Possible values: ${bladePatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
    ),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  clientName: z
    .enum(['claude', 'cursor', 'unknown'])
    .default('unknown')
    .describe(
      'The name of the client that is calling the tool. It can be "claude", "cursor", or "unknown".',
    ),
};

// Schema for HTTP transport
const getBladePatternDocsHttpSchema = {
  ...getBladePatternDocsStdioSchema,
  cursorRuleVersion: z.string().describe(CHECK_CURSOR_RULES_DESCRIPTION),
};

// Core business logic function
const getBladePatternDocsCore = ({
  patternsList,
  currentProjectRootDirectory,
  skipLocalCursorRuleChecks = false,
  cursorRuleVersion,
  clientName,
}: {
  patternsList: string;
  currentProjectRootDirectory?: string;
  skipLocalCursorRuleChecks?: boolean;
  cursorRuleVersion: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const components = patternsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladePatternsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladePatternDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${bladePatternsList.join(
        ', ',
      )}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Check cursor rules using shouldCreateOrUpdateCursorRule which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateCursorRule = shouldCreateOrUpdateCursorRule(
      cursorRuleVersion,
      clientName,
      currentProjectRootDirectory,
      skipLocalCursorRuleChecks,
      getBladePatternDocsToolName,
      createBladeCursorRulesToolName,
    );
    if (createOrUpdateCursorRule) {
      return createOrUpdateCursorRule;
    }
  }

  try {
    const responseText = getBladeDocsResponseText({
      docsList: patternsList,
      documentationType: 'patterns',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladePatternDocsToolName,
        patternsList,
        rootDirectoryName: currentProjectRootDirectory
          ? basename(currentProjectRootDirectory)
          : undefined,
        cursorRuleVersion,
        clientName,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Below is the documentation for Patterns. After this, call ${getBladeComponentDocsToolName} to get documentation for components that are used in patterns.:\n ${responseText}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getBladePatternDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getBladePatternDocsStdioCallback: ToolCallback<typeof getBladePatternDocsStdioSchema> = ({
  patternsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getBladePatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalCursorRuleChecks: false, // Perform cursor rule checks for stdio
    cursorRuleVersion: '0',
    clientName,
  });
};

// Callback for HTTP transport
const getBladePatternDocsHttpCallback: ToolCallback<typeof getBladePatternDocsHttpSchema> = ({
  patternsList,
  cursorRuleVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladePatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalCursorRuleChecks: true, // Skip cursor rule checks for HTTP
    cursorRuleVersion,
    clientName,
  });
};

export {
  getBladePatternDocsToolName,
  getBladePatternDocsToolDescription,
  getBladePatternDocsStdioCallback,
  getBladePatternDocsHttpCallback,
  getBladePatternDocsStdioSchema,
  getBladePatternDocsHttpSchema,
};
