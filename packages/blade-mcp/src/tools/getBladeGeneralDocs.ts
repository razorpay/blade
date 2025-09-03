import { existsSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CONSUMER_CURSOR_RULES_RELATIVE_PATH,
  analyticsToolCallEventName,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
} from '../utils/tokens.js';

import { getBladeDocsList, hasOutDatedRules } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';

const bladeGeneralDocsList = getBladeDocsList('general');

const getBladeGeneralDocsToolName = 'get_blade_general_docs';

const whichGeneralDocsToUse = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getBladeGeneralDocsToolDescription = `Fetch general Blade Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.`;

const getBladeGeneralDocsToolSchema = {
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
};

const getBladeGeneralDocsToolCallback: ToolCallback<typeof getBladeGeneralDocsToolSchema> = ({
  topicsList,
  currentProjectRootDirectory,
}) => {
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

  const ruleFilePath = join(currentProjectRootDirectory, CONSUMER_CURSOR_RULES_RELATIVE_PATH);

  if (!existsSync(ruleFilePath)) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: 'Cursor rules do not exist. Call create_blade_cursor_rules first.',
    });
  }

  if (hasOutDatedRules(ruleFilePath)) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: 'Cursor rules are outdated. Call create_blade_cursor_rules first.',
    });
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
        rootDirectoryName: basename(currentProjectRootDirectory),

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

export {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsToolSchema,
  getBladeGeneralDocsToolCallback,
};
