import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  CHECK_CURSOR_RULES_DESCRIPTION,
} from '../utils/tokens.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { shouldCreateOrUpdateCursorRule } from '../utils/cursorRulesUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

const bladeGeneralDocsList = getBladeDocsList('general');

const getBladeGeneralDocsToolName = 'get_blade_general_docs';

const whichGeneralDocsToUse = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getBladeGeneralDocsToolDescription = `Fetch general Blade Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.`;

// Schema for stdio transport
const getBladeGeneralDocsStdioSchema = {
  topicsList: z
    .string()
    .describe(
      `Comma separated list of general documentation topics. E.g. "Installation, Theming". Possible values: ${bladeGeneralDocsList.join(
        ', ',
      )}. Here is guide on how to decide which general docs you might need:\n ${whichGeneralDocsToUse}`,
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
const getBladeGeneralDocsHttpSchema = {
  ...getBladeGeneralDocsStdioSchema,
  cursorRuleVersion: z.string().describe(CHECK_CURSOR_RULES_DESCRIPTION),
};

// Core business logic function
const getBladeGeneralDocsCore = ({
  topicsList,
  currentProjectRootDirectory,
  skipLocalCursorRuleChecks = false,
  cursorRuleVersion,
  clientName,
}: {
  topicsList: string;
  currentProjectRootDirectory?: string;
  skipLocalCursorRuleChecks?: boolean;
  cursorRuleVersion: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const topics = topicsList.split(',').map((s) => s.trim());
  const invalidTopics = topics.filter((topic) => !bladeGeneralDocsList.includes(topic));
  if (invalidTopics.length > 0) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: `Invalid argument topicsList. Invalid values: ${invalidTopics.join(
        ', ',
      )}. Valid general docs values: ${bladeGeneralDocsList.join(', ')}`,
    });
  }

  // Check cursor rules using shouldCreateOrUpdateCursorRule which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateCursorRule = shouldCreateOrUpdateCursorRule(
      cursorRuleVersion,
      clientName,
      currentProjectRootDirectory,
      skipLocalCursorRuleChecks,
      getBladeGeneralDocsToolName,
      createBladeCursorRulesToolName,
    );
    if (createOrUpdateCursorRule) {
      return createOrUpdateCursorRule;
    }
  }

  try {
    const responseText = getBladeDocsResponseText({
      docsList: topicsList,
      documentationType: 'general',
    });

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladeGeneralDocsToolName,
        topicsList,
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
          text: responseText.trim(),
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getBladeGeneralDocsStdioCallback: ToolCallback<typeof getBladeGeneralDocsStdioSchema> = ({
  topicsList,
  currentProjectRootDirectory,
}) => {
  return getBladeGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalCursorRuleChecks: false, // Perform cursor rule checks for stdio
    cursorRuleVersion: '0',
    clientName: 'unknown',
  });
};

// Callback for HTTP transport
const getBladeGeneralDocsHttpCallback: ToolCallback<typeof getBladeGeneralDocsHttpSchema> = ({
  topicsList,
  cursorRuleVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladeGeneralDocsCore({
    topicsList,
    currentProjectRootDirectory,
    skipLocalCursorRuleChecks: true, // Skip cursor rule checks for HTTP
    cursorRuleVersion,
    clientName,
  });
};

const getBladeGeneralDocsToolSchema = (
  transportType: 'stdio' | 'http',
): typeof getBladeGeneralDocsStdioSchema | typeof getBladeGeneralDocsHttpSchema => {
  if (transportType === 'stdio') {
    return getBladeGeneralDocsStdioSchema;
  }
  return getBladeGeneralDocsHttpSchema;
};

const getBladeGeneralDocsToolCallback = (
  transportType: 'stdio' | 'http',
): typeof getBladeGeneralDocsStdioCallback | typeof getBladeGeneralDocsHttpCallback => {
  if (transportType === 'stdio') {
    return getBladeGeneralDocsStdioCallback;
  }
  return getBladeGeneralDocsHttpCallback;
};

export {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsToolSchema,
  getBladeGeneralDocsToolCallback,
};
