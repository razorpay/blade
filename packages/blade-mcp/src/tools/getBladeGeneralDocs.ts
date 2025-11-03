import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  getCursorRulesFileName,
} from '../utils/tokens.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

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
  clientName: z.enum(['claude', 'cursor', 'unknown']).default('unknown'),
  cursorRuleFileName: z
    .string()
    .describe(
      'get the name of blade cursor rules file. You can use grep to find it: `grep -l "rules_version:" .cursor/rules/*.mdc` or search for files matching `frontend-blade-rules-v*.mdc` in `.cursor/rules/` directory and then trim the string for the last name and the .mdc extension (e.g., "frontend-blade-rules-v0.0.8"). if nothing is found send 0',
    ),
};

const getBladeGeneralDocsToolCallback: ToolCallback<typeof getBladeGeneralDocsToolSchema> = ({
  topicsList,
  currentProjectRootDirectory,
  clientName,
  cursorRuleFileName,
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

  if (cursorRuleFileName === '0' && clientName === 'cursor') {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`,
    });
  }

  const expectedFileName = getCursorRulesFileName().replace('.mdc', '');
  if (cursorRuleFileName !== expectedFileName && clientName === 'cursor') {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: `Cursor rules are outdated. Expected file name: ${expectedFileName}.mdc. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
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

export {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsToolSchema,
  getBladeGeneralDocsToolCallback,
};
